import Link from "next/link";

import { Container } from "@/common/Container/Container";
import { Grid } from "@/common/Grid/Grid";
import { PolicyCard } from "@/src/modules/my-policies/PolicyCard";
import { useActivePolicies } from "@/src/hooks/useActivePolicies";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { COVERS_PER_PAGE } from "@/src/config/constants";
import { t, Trans } from "@lingui/macro";

export const PoliciesActivePage = () => {
  const { data, loading } = useActivePolicies();
  const { activePolicies } = data;

  const renderMyActivePolicies = () => {
    const noData = activePolicies.length <= 0;

    if (!loading && !noData) {
      return (
        <Grid className="mb-24 mt-14">
          {activePolicies.map((policyInfo) => {
            return (
              <PolicyCard
                key={policyInfo.id}
                policyInfo={policyInfo}
              ></PolicyCard>
            );
          })}
        </Grid>
      );
    } else if (!loading && noData) {
      return (
        <div className="flex flex-col items-center w-full pt-20">
          <img
            src="/images/covers/empty-list-illustration.svg"
            alt={t`no data found`}
            className="w-48 h-48"
          />
          <p className="max-w-full mt-8 text-center text-h5 text-404040 w-96">
            <Trans>
              A cover policy enables you to claim and receive payout when an
              incident occurs. To purchase a policy, select a cover from the
              home screen.
            </Trans>
          </p>
        </div>
      );
    }

    return (
      <Grid className="mb-24 mt-14">
        <CardSkeleton
          numberOfCards={COVERS_PER_PAGE}
          statusBadge={false}
          subTitle={false}
        />
      </Grid>
    );
  };

  return (
    <Container className="py-16">
      <div className="flex justify-end">
        <Link href="/my-policies/transactions">
          <a className="font-medium text-h4 text-4e7dd9 hover:underline">
            <Trans>Transaction List</Trans>
          </a>
        </Link>
      </div>
      {renderMyActivePolicies()}
    </Container>
  );
};
