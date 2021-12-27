import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";

import { CoverCard } from "@/components/UI/organisms/cover/card";
import { CoverActionCard } from "@/components/UI/organisms/cover/action-card";
import { actions as coverActions } from "@/src/config/cover/actions";
import { useAvailableCovers } from "@/components/pages/home/useAvailableCovers";

export const HomePage = () => {
  const { availableCovers } = useAvailableCovers();

  if (!availableCovers) {
    return <>loading...</>;
  }

  return (
    <main>
      <div
        className="px-10 py-28"
        style={{
          backgroundImage: "url(/gradient.png)",
          backgroundSize: "cover",
          backgroundPosition: "left",
        }}
      >
        <Container>
          <h1 className="text-h1 font-sora font-bold">Neptune Mutual</h1>
          <p className="mt-3 max-w-prose">
            Neptune Mutual provides you with guaranteed stablecoin liquidity to
            reduce your risk exposure by hedging against possible capital risks
            and smart contract vulnerabilities.
          </p>
        </Container>
      </div>

      <div className="py-16 bg-F1F3F6">
        <Container>
          <div className="flex justify-between">
            <h1 className="text-h2 font-sora font-bold">Available Covers</h1>
            <div>
              <span className="inline-block border border-B0C4DB p-4 mr-4 rounded-lg bg-white">
                search
              </span>
              <span className="inline-block border border-B0C4DB p-4 rounded-lg bg-white">
                sort
              </span>
            </div>
          </div>
          <Grid className="mt-14 mb-24">
            {availableCovers.map((c) => {
              console.log(availableCovers, `availableCovers`);
              return (
                <Link href={`/cover/${c.key}`} key={c.name}>
                  <a className="rounded-3xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-black focus:outline-none">
                    <CoverCard details={c}></CoverCard>
                  </a>
                </Link>
              );
            })}
          </Grid>
        </Container>
      </div>
    </main>
  );
};
