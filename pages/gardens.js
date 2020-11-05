import GardenCard from "../components/gardenCard";
import { GARDEN_OPTIONS } from "../constants";
import {format_friendly, getEtherscanLink} from "../lib/utils";

function Gardens() {
  return (
    <div className="relative">
      <div className="container">
          <div className="py-3 w-full flex">
              <div className="flex flex-row w-full justify-center style=">
                  <div className="py-4 pr-2 pl-2 content-box w-6/12" style={{border: "1px solid var(--offwhite)"}}>

                      <p className="text-center text-xs md:text-lg font-bold text-white">
                          Sprout Discord
                      </p>
                      < a href = "https://discord.gg/c2xH65Y" target="_blank">
                      <p className="text-center text-xs md:text-lg font-bold text-white hover:text-green hover:underline cursor-pointer">https://discord.gg/c2xH65Y</p>
                      </a>
                  </div>
                  <div className="py-4 pl-2 pr-2 content-box w-6/12" style={{border: "1px solid var(--offwhite)"}}>
                      <p className="text-center text-xs md:text-lg font-bold text-white">
                          Sprout Twitter
                      </p>
                      <a href="https://twitter.com/Sproutdotmoney" target="_blank">
                      <p className="text-center text-xs md:text-lg font-bold text-white break-words hover:text-green hover:underline cursor-pointer" >https://twitter.com/Sproutdotmoney</p>
                      </a>
                  </div>
              </div>
          </div>


        <div className="garden-list py-16 overflow-x-hidden">
          {GARDEN_OPTIONS.map((garden, i) => (
            <GardenCard {...garden} key={i} />
          ))}
        </div>
      </div>
      <style jsx>{`
        @media screen and (max-width: 831px) {
          .desktop-content {
            display: none;
          }
          .tabs-wrapper {
            margin-left: -1rem;
            width: 100vw;
          }
        }
      `}</style>
    </div>
  );
}

export default Gardens;
