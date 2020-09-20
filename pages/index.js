import { Line } from "rc-progress";

export default function Home() {
  return (
    <div className="container">
      <div className="py-16 min-w-full flex flex-col justify-start items-center">
        <div className="py-4 w-full flex justify-center">
          <div className="py-4 content-box w-6/12">
            <p className="text-center text-lg font-bold text-white">
              Current Treasury Address
            </p>
            <a>
              <p className="text-center text-lg font-bold text-white hover:text-green hover:underline cursor-pointer">
                {`0x123...456`}
              </p>
            </a>
          </div>
        </div>

        <div className="py-4 w-full">
          <div className="flex flex-row w-full justify-center">
            <div className="py-4 pr-2 pl-2 content-box w-3/12">
              <p className="text-center text-lg font-bold text-white">
                Your Votes
              </p>
              <p className="text-center text-lg font-bold text-white">-</p>
            </div>
            <div className="py-4 pl-2 pr-2 content-box w-3/12">
              <p className="text-center text-lg font-bold text-white">
                Voting For
              </p>
              <p className="text-center text-lg font-bold text-white">-</p>
            </div>
          </div>
        </div>

        <div className="py-4 w-6/12">
          <Line
            percent={[10, 100]}
            strokeWidth="4"
            trailWidth="4"
            strokeColor={[
              "#00FFAD",
              {
                "100%": "#FFFFFF",
                "0%": "#00FFAD",
              },
            ]}
            strokeLinecap="round"
          />
        </div>
      </div>

      <style jsx>
        {`
          .content-box {
            border: 1px solid var(--offwhite);
            border-radius: var(--radius);
          }
        `}
      </style>
    </div>
  );
}
