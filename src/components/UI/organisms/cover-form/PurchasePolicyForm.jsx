import { useRouter } from "next/router";

import InfoCircleIcon from "@/icons/info-circle";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { Radio } from "@/components/UI/atoms/radio";
import { PolicyFeesAndExpiry } from "@/components/UI/organisms/PolicyFeesAndExpiry/PolicyFeesAndExpiry";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { monthNames } from "@/lib/dates";
import { convertFromUnits, isValidNumber } from "@/utils/bn";
import BigNumber from "bignumber.js";
import { usePurchasePolicy } from "@/components/UI/organisms/cover-form/usePurchasePolicy";
import { useLiquidityAddress } from "@/src/hooks/useLiquidityAddress";
import { useState } from "react";
import { usePolicyFees } from "@/components/UI/organisms/cover-form/usePolicyFees";

export const PurchasePolicyForm = ({ coverKey }) => {
  const router = useRouter();
  const [value, setValue] = useState();
  const [coverMonth, setCoverMonth] = useState();
  const { liquidityTokenAddress, liquidityTokenSymbol } = useLiquidityAddress();
  const { feePercent, feeAmount } = usePolicyFees({
    value,
    coverMonth,
    coverKey,
  });
  const {
    balance,
    approving,
    purchasing,
    canPurchase,
    isError,
    handleApprove,
    handlePurchase,
  } = usePurchasePolicy({
    value,
    coverMonth,
    coverKey,
  });

  const handleChange = (val) => {
    if (typeof val === "string") {
      setValue(val);
    }
  };

  const handleRadioChange = (e) => {
    setCoverMonth(e.target.value);
  };

  const handleChooseMax = () => {
    if (!balance) {
      return;
    }
    setValue(convertFromUnits(balance).toString());
  };

  const now = new Date();
  const coverPeriodLabels = [
    monthNames[(now.getMonth() + 0) % 12],
    monthNames[(now.getMonth() + 1) % 12],
    monthNames[(now.getMonth() + 2) % 12],
  ];

  return (
    <div className="max-w-md">
      <TokenAmountInput
        labelText={"Amount you wish to cover"}
        onChange={handleChange}
        error={isError}
        handleChooseMax={handleChooseMax}
        tokenAddress={liquidityTokenAddress}
        tokenSymbol={liquidityTokenSymbol}
        tokenBalance={balance}
        inputId={"cover-amount"}
        inputValue={value}
      >
        {value && isValidNumber(value) && (
          <div className="flex items-center text-15aac8">
            <p>You will receive: {new BigNumber(value).toString()} cxDAI</p>

            <button className="ml-3">
              <span className="sr-only">Info</span>
              <InfoCircleIcon width={24} fill="currentColor" />
            </button>
          </div>
        )}
      </TokenAmountInput>
      <div className="mt-12 px-3">
        <h5
          className="block uppercase text-black text-h6 font-semibold mb-4"
          htmlFor="cover-period"
        >
          Select your coverage period
        </h5>
        <div className="flex">
          <Radio
            label={coverPeriodLabels[0]}
            id="period-1"
            value="1"
            name="cover-period"
            onChange={handleRadioChange}
          />
          <Radio
            label={coverPeriodLabels[1]}
            id="period-2"
            value="2"
            name="cover-period"
            onChange={handleRadioChange}
          />
          <Radio
            label={coverPeriodLabels[2]}
            id="period-3"
            value="3"
            name="cover-period"
            onChange={handleRadioChange}
          />
        </div>
      </div>
      {value && coverMonth && (
        <PolicyFeesAndExpiry
          fees={feePercent}
          feeAmount={feeAmount}
          claimEnd={coverMonth}
        />
      )}

      {!canPurchase ? (
        <RegularButton
          disabled={isError || approving}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          onClick={handleApprove}
        >
          {approving ? "Approving..." : <>Approve {liquidityTokenSymbol}</>}
        </RegularButton>
      ) : (
        <RegularButton
          disabled={isError || purchasing}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          onClick={handlePurchase}
        >
          {purchasing ? "Purchasing..." : "Purchase policy"}
        </RegularButton>
      )}

      <div className="mt-16">
        <OutlinedButton className="rounded-big" onClick={() => router.back()}>
          &#x27F5;&nbsp;Back
        </OutlinedButton>
      </div>
    </div>
  );
};
