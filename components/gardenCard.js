import StakingModal from "./StakingModal";
import { useState } from "react";

const GardenCard = ({
  tokenName,
  tokenGardenName,
  tokenIconPath,
  descriptionTop,
  poolAddress,
  tokenAddress,
}) => {
  const [stakingModalOpen, setStakingModalOpen] = useState(false);

  const toggleModal = () => {
    setStakingModalOpen(!stakingModalOpen);
  };

  return (
    <article className="relative">
      <section className="mb-3">
        <div className="outer py-12 flex flex-col items-center">
          <img
            className="my-2"
            src={`/${tokenIconPath}`}
            alt={`${tokenName} image`}
          />
          <header>
            <div className="flex flex-col items-center">
              <h2 className="mt-2 mb-4 text-lg text-white font-bold crop">
                {tokenGardenName}
              </h2>
              <p className="text-md text-white">{descriptionTop}</p>
            </div>
          </header>
          <div className="absolute harvest-button">
            <button className="btn" onClick={toggleModal}>
              <img src="/tractor-emoji.png" alt="harvest icon" />
              <h2 className="text-sm font-bold text-green pl-1">Open</h2>
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        .outer {
          border-radius: var(--radius);
          border: 1px solid var(--offwhite);
          min-height: 450px;
        }
        .harvest-button {
          bottom: 50px;
        }
        button {
          background-color: rgba(0, 255, 173, 0.25);
        }
        button:hover {
          background-color: rgba(0, 255, 173, 0.25);
        }
        button > img {
          height: 25px;
          width: 25px;
        }
        div > img {
          height: 65px;
          width: 65px;
        }
      `}</style>

      <StakingModal
        poolAddress={poolAddress}
        tokenName={tokenName}
        tokenIconPath={tokenIconPath}
        tokenAddress={tokenAddress}
        open={stakingModalOpen}
        setOpen={toggleModal}
      />
    </article>
  );
};

export default GardenCard;
