import { Line } from "rc-progress";
import {getEtherscanLink} from "../lib/utils";
import {formatEther, parseEther} from "@ethersproject/units";
import useSproutContract from "../hooks/useSproutContract";
import {useWeb3React} from "@web3-react/core";
import getReceipt from "../lib/getReceipt";
import {addToast} from "../hooks/useToast";
import { useEffect, useState } from 'react'

function Home() {

  //getting the contract of sprout
  const contract = useSproutContract()
  const { account, library } = useWeb3React();

  //the new treasury dao address for proposal
  const new_add = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

  //set constants for later displaying
  const [first_loop, set_first_loop] = useState(0);
  const [voted, setvoted] = useState(0);
  const [votedad,setvotedad] = useState('0x0000000000000000000000000000000000000000');
  const [votet,setvotet] = useState(0);
  const [current_treasury,set_current_treasury] = useState('Connect Wallet First');

  // function to vote for new treasury
  const callVote = async () => {
    try {
      const { hash } = await contract.updateVote(new_add);
      await getReceipt(hash, library);
    } catch (e) {
      addToast({ body: e.message, type: "error" });
    }
  };

  // effect hook for updating data
  useEffect(() => {

    // update the ui elements
    async function updateUIStates() {
      const voted_value = await contract.voted(new_add);

      // set voted
      setvoted({...voted_value});
      const votedad_value = await contract.votedad(new_add);

      // set votedad
      setvotedad(votedad_value)
      const votet_value = await contract.votet(votedad_value);
      const supply = await contract.totalSupply();
      const returner = votet_value / supply * 0.51;

      // set votet
      setvotet(returner);
      const treasury = await contract.treasuryDAO();

      //set treasury (current)
      set_current_treasury(treasury);
      console.log('in');
    }

    // fix for updating after wallet login
    if (account && first_loop == 0)
    {
      set_first_loop(1);
      updateUIStates()
    }

    // schedule every 15 sec refresh
    const timer = setInterval(() => {
       if (account)
       {
         updateUIStates()
       }

    }, 15000);

    // clearing interval
    return () => clearInterval(timer);
  }, [ account, voted, votedad, votet,current_treasury] );


  return (

    <div className="container">
      <div className="py-16 min-w-full flex flex-col justify-start items-center">
        <div className="py-4 w-full flex justify-center">
          <div className="py-4 content-box w-8/12">
            <p className="text-center text-lg font-bold text-white">
              Current Treasury Address
            </p>
            <a href={getEtherscanLink(1,current_treasury,"ADDRESS")} target="_blank">
              <p className="text-center text-lg font-bold text-white hover:text-green hover:underline cursor-pointer">
                {!!account ? current_treasury : "Connect Wallet First"}

              </p>
            </a>
          </div>
        </div>

        <div className="py-4 w-full">
          <div className="flex flex-row w-full justify-center">
            <div className="py-4 pr-2 pl-2 content-box w-4/12">
              <p className="text-center text-lg font-bold text-white">
                Your Votes
              </p>

                <p className="text-center text-lg font-bold text-white">{  formatEther(voted) }</p>
            </div>
            <div className="py-4 pl-2 pr-2 content-box w-4/12">
              <p className="text-center text-lg font-bold text-white">
                Voting For
              </p>
              <p className="text-center text-lg font-bold text-white">{votedad}</p>
            </div>
          </div>
        </div>


        <div className="py-4 w-8/12">
          <Line
            percent={[(votet) || 0 , 100]}
            strokeWidth="4"
            trailWidth="4"
            strokeColor={[
              "#00ffad",
              {
                "100%": "#ffffff",
                "0%": "#00ffad",
              },
            ]}
            strokeLinecap="round"
          />
        </div>

        <div className="py-4 w-full flex justify-center">
          <div className="py-4 content-box w-8/12">
            <p className="text-center text-lg font-bold text-white">
              Vote for New Treasury Address
            </p>
            <a href={getEtherscanLink(1,new_add,"ADDRESS")} target="_blank">
              <p className="text-center text-lg font-bold text-white hover:text-green hover:underline cursor-pointer">
                {new_add}
              </p>
            </a>
            <p className="text-center text-lg font-bold text-white">
              <button
                  className="btn" onClick={callVote} style={{background: "#00ffad"}}>
                <p className="capitalize">Vote for New Treasury</p>
              </button>
            </p>

          </div>

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
export default Home
