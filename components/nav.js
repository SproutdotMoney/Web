import { useWeb3React } from "@web3-react/core";
import { memo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useWalletModalToggle } from "./WalletModal/state";
import { Lock } from "./icons";

const WalletModal = dynamic(() => import("./WalletModal"), { ssr: false });

const Nav = () => {
  const { account } = useWeb3React();

  const toggleWalletModal = useWalletModalToggle();

  return (
    <>
      <div className="wrapper flex bg-primary z-4">
        <header className="container w-full">
          <nav className="flex justify-between items-center h-full">
            <Link href="/">
              <a>
                <div className="flex flex-row items-center">
                  <img src="/sprout_logo.png" alt="sprout" />
                  <h3 className="text-lg text-white">Sprout</h3>
                </div>
              </a>
            </Link>
            <div className="flex flex-row items-center">
              <Link href="/gardens">
                <a className="text-lg text-white p-6 hover:text-green cursor-pointer">
                  Gardens
                </a>
              </Link>
              <button className="btn p-6" onClick={toggleWalletModal}>
                <Lock />
                <p className="px-1">
                  {!!account ? "My Wallet" : "Unlock Wallet"}
                </p>
              </button>
            </div>
          </nav>
        </header>

        <WalletModal />

        <style jsx>{`
          .wrapper {
            min-height: 76px;
          }
          div > img {
            height: 30px;
            position: relative;
            bottom: 2x;
          }
          button {
            background-color: rgba(0, 255, 173, 0.25);
          }
          button:hover {
            background-color: rgba(0, 255, 173, 0.25);
          }
          button > p {
            color: rgba(0, 255, 173, 1);
            opacity: 1;
          }
        `}</style>
      </div>
    </>
  );
};

export default memo(Nav);
