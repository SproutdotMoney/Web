import { memo } from "react";
const BottomNav = () => {
  return (
    <>
      <div className="wrapper flex bg-primary z-auto">
        <footer className="container w-full text-center">

            <div className=" flex-row items-center text-center">
                <a className="text-s md:text-lg text-white p-2 md:p-6 hover:text-green cursor-pointer" target="_blank" href="https://twitter.com/Sproutdotmoney">
                  Twitter
                </a>
                <a className="text-s md:text-lg text-white p-2 md:p-6 hover:text-green cursor-pointer" target="_blank" href="https://discord.gg/c2xH65Y">
                  Discord
                </a>
                <a  target="_blank" href="https://defipulse.com/">
                    <img src="/defi-pulse.png" alt="defi pulse" className="object-scale-down h-16 inline" />
                </a>
            </div>
        </footer>

        <style jsx>{`
          .wrapper {
            min-height: 76px;
          }

        `}</style>
      </div>
    </>
  );
};

export default memo(BottomNav);
