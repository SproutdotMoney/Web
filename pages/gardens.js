import GardenCard from "../components/gardenCard";
import {GARDEN_OPTIONS} from "../constants";

function Gardens() {
    return (
        <div className="relative">
            <div className="container">
                <div className="garden-list py-16 overflow-x-hidden">
                    {GARDEN_OPTIONS.map((garden, i) => (
                        <GardenCard {...garden} key={i}/>
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
