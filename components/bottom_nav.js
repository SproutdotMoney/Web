import { memo } from "react";
import Link from "next/link";
const BottomNav = () => {
  return (
    <>
      <div className="wrapper flex bg-primary z-auto">
        <footer className="container w-full text-center">

            <div className=" flex-row items-center text-center">
              <Link href="https://twitter.com/Sproutdotmoney">
                <a className="text-s md:text-lg text-white p-2 md:p-6 hover:text-green cursor-pointer" target="_blank">
                  Twitter
                </a>
              </Link>
              <Link href="https://discord.gg/c2xH65Y">
                <a className="text-s md:text-lg text-white p-2 md:p-6 hover:text-green cursor-pointer" target="_blank">
                  Discord
                </a>
              </Link>
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
