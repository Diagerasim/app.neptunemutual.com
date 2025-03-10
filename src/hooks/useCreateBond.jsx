import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isEqualTo,
  isValidNumber,
  convertFromUnits,
} from "@/utils/bn";
import { useNetwork } from "@/src/context/Network";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useBondPoolAddress } from "@/src/hooks/contracts/useBondPoolAddress";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useDebounce } from "@/src/hooks/useDebounce";
import { formatCurrency } from "@/utils/formatter/currency";
import { t } from "@lingui/macro";

export const useCreateBond = ({ info, refetchBondInfo, value }) => {
  const debouncedValue = useDebounce(value, 200);
  const [receiveAmount, setReceiveAmount] = useState("0");
  const [receiveAmountLoading, setReceiveAmountLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [bonding, setBonding] = useState(false);
  const [error, setError] = useState("");

  const { networkId } = useNetwork();
  const { account, library } = useWeb3React();
  const bondContractAddress = useBondPoolAddress();
  const {
    allowance,
    loading: loadingAllowance,
    refetch: updateAllowance,
    approve,
  } = useERC20Allowance(info.lpTokenAddress);
  const {
    balance,
    loading: loadingBalance,
    refetch: updateBalance,
  } = useERC20Balance(info.lpTokenAddress);

  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    updateAllowance(bondContractAddress);
  }, [bondContractAddress, updateAllowance]);

  // Resets loading and other states which are modified in the above hook
  // "IF" condition should match the above effect
  // Should appear after the effect which contains the async function (which sets loading state)
  useEffect(() => {
    if (!networkId || !account || !debouncedValue) {
      if (receiveAmount !== "0") {
        setReceiveAmount("0");
      }
      if (receiveAmountLoading !== false) {
        setReceiveAmountLoading(false);
      }
    }
  }, [account, debouncedValue, networkId, receiveAmount, receiveAmountLoading]);

  useEffect(() => {
    let ignore = false;
    if (!networkId || !account || !debouncedValue) return;

    async function updateReceiveAmount() {
      setReceiveAmountLoading(true);

      const cleanup = () => {
        setReceiveAmountLoading(false);
      };
      const handleError = (err) => {
        notifyError(err, t`calculate tokens`);
      };

      try {
        const signerOrProvider = getProviderOrSigner(
          library,
          account,
          networkId
        );
        const instance = await registry.BondPool.getInstance(
          networkId,
          signerOrProvider
        );

        const onTransactionResult = async (tx) => {
          const result = tx;

          if (ignore) return;
          setReceiveAmount(result.toString());
          cleanup();
        };

        const onRetryCancel = () => {
          cleanup();
        };

        const onError = (err) => {
          handleError(err);
          cleanup();
        };

        const args = [convertToUnits(debouncedValue).toString()];
        invoke({
          instance,
          methodName: "calculateTokensForLp",
          args,
          retry: false,
          onTransactionResult,
          onRetryCancel,
          onError,
        });
      } catch (err) {
        handleError(err);
        cleanup();
      }
    }

    updateReceiveAmount();

    return () => {
      ignore = true;
    };
  }, [networkId, debouncedValue, invoke, notifyError, account, library]);

  useEffect(() => {
    if (!value && error) {
      setError("");
      return;
    }

    if (!value) {
      return;
    }

    if (!isValidNumber(value)) {
      setError(t`Invalid amount to bond`);
      return;
    }

    if (isGreater(convertToUnits(value), balance)) {
      setError(t`Insufficient Balance`);
      return;
    }

    if (isEqualTo(convertToUnits(value), 0)) {
      setError(t`Please specify a value`);
      return;
    }

    if (isGreater(receiveAmount, info.maxBond)) {
      setError(
        t`Exceeds maximum bond ${
          formatCurrency(convertFromUnits(info.maxBond).toString(), "NPM", true)
            .long
        }`
      );
      return;
    }

    if (error) {
      setError("");
      return;
    }
  }, [balance, error, info.maxBond, receiveAmount, value]);

  const handleApprove = async () => {
    setApproving(true);

    const cleanup = () => {
      setApproving(false);
    };
    const handleError = (err) => {
      notifyError(err, t`approve LP tokens`);
    };

    const onTransactionResult = async (tx) => {
      try {
        await txToast.push(tx, {
          pending: t`Approving LP tokens`,
          success: t`Approved LP tokens Successfully`,
          failure: t`Could not approve LP tokens`,
        });
        cleanup();
      } catch (err) {
        handleError(err);
        cleanup();
      }
    };

    const onRetryCancel = () => {
      cleanup();
    };

    const onError = (err) => {
      handleError(err);
      cleanup();
    };

    approve(bondContractAddress, convertToUnits(value).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError,
    });
  };

  const handleBond = async (onTxSuccess) => {
    setBonding(true);

    const cleanup = () => {
      setBonding(false);
      updateBalance();
      updateAllowance(bondContractAddress);
      refetchBondInfo();
    };
    const handleError = (err) => {
      notifyError(err, t`create bond`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.BondPool.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(
          tx,
          {
            pending: t`Creating bond`,
            success: t`Created bond successfully`,
            failure: t`Could not create bond`,
          },
          {
            onTxSuccess,
          }
        );
        cleanup();
      };

      const onRetryCancel = () => {
        cleanup();
      };

      const onError = (err) => {
        handleError(err);
        cleanup();
      };

      const args = [convertToUnits(value).toString(), receiveAmount];
      invoke({
        instance,
        methodName: "createBond",
        args,
        onTransactionResult,
        onRetryCancel,
        onError,
      });
    } catch (err) {
      handleError(err);
      cleanup();
    }
  };

  const canBond =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || "0"));

  return {
    balance,
    loadingBalance,

    receiveAmount,
    receiveAmountLoading,

    approving,
    loadingAllowance,

    bonding,

    canBond,
    error,

    handleApprove,
    handleBond,
  };
};
