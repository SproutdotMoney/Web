import { Line } from "rc-progress";
import {getEtherscanLink} from "../lib/utils";
import {formatEther, parseEther, formatUnits} from "@ethersproject/units";
import useSproutContract from "../hooks/useSproutContract";
import {useWeb3React} from "@web3-react/core";
import getReceipt from "../lib/getReceipt";
import {addToast} from "../hooks/useToast";
import { useEffect, useState } from 'react';

function Home() {

  //getting the contract of sprout
  const contract = useSproutContract()
  const { account, library } = useWeb3React();

  //the new treasury dao address for proposal (user text field)
  const [newadd, setnewadd] = useState('');

  //set constants for later displaying
  const [first_loop, set_first_loop] = useState(0);
  const [voted, setvoted] = useState(0);
  const [votedad,setvotedad] = useState('0x0000000000000000000000000000000000000000');
  const [votet,setvotet] = useState(0);
  const [current_treasury,set_current_treasury] = useState('0x0000000000000000000000000000000000000000');
  const [seed_balance, set_seed_balance] = useState(0)

  // function to vote for new treasury
  const callVote = async () => {
    try {
      const { hash } = await contract.updateVote(newadd);
      await getReceipt(hash, library);
    } catch (e) {
      addToast({ body: e.message, type: "error" });
    }
  };

  //format addresses in ui
  function format_address(address)
  {
    const new_address = address.substring(0,5) + '...' + address.slice(-3)
    return new_address;
  }

  // effect hook for updating data
  useEffect(() => {

    // update the ui elements
    async function updateUIStates() {

      const balance = await contract.balanceOf(account);

      // set balance
      set_seed_balance(balance);

      const voted_value = await contract.voted(account);

      // set voted
      setvoted({...voted_value});
      const votedad_value = await contract.votedad(account);

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
    }

    // fix for updating after wallet login
    if (account && first_loop == 0)
    {
      set_first_loop(1);
      updateUIStates();
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

  //get user friendly numbers from wei
  //@input raw input from web3
  //@output formated string with only 4 decimals after comma
  function format_friendly(input)
  {
    const temp = formatEther(input);
    const words = temp.split('.');

    //only 4 decimals
    const slicer = words[1].slice(0,8);
    const returner = words[0] + "." + slicer;

    return returner;
  }

  function show_seed()
  {
    return (
        <div className="py-4 w-full flex justify-center">
          <div className="py-4 content-box w-full">
            <p className="text-center text-3xl font-bold text-white">
              SEED Balance
            </p>
            <p className="text-center text-3xl font-bold text-white">
              {format_friendly(seed_balance)}

            </p>
          </div>
        </div>
    )
  }

  return (

    <div className="container">
      <div className="py-16 min-w-full flex flex-col justify-start items-center">

        {account ? show_seed() : ""}

        <div className="py-4 w-full flex justify-center">
          <div className="py-4 content-box w-full">
            <p className="text-center text-lg font-bold text-white">
              Current Treasury Address
            </p>
            <a href={getEtherscanLink(1,current_treasury,"ADDRESS")} target="_blank">
              <p className="text-center text-lg font-bold text-white hover:text-green hover:underline cursor-pointer">
                {format_address(current_treasury)}

              </p>
            </a>
          </div>
        </div>

        <div className="py-4 w-full">
          <div className="flex flex-row w-full justify-center">
            <div className="py-4 pr-2 pl-2 content-box w-6/12">
              <p className="text-center text-lg font-bold text-white">
                Your Votes
              </p>

                <p className="text-center text-lg font-bold text-white">{  format_friendly(voted) }</p>
            </div>
            <div className="py-4 pl-2 pr-2 content-box w-6/12">
              <p className="text-center text-lg font-bold text-white">
                Voting For
              </p>
              <p className="text-center text-lg font-bold text-white break-words" >{format_address(votedad)}</p>
            </div>
          </div>
        </div>


        <div className="py-4 w-full">
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
          <div className="py-4 content-box w-full">
            <p className="text-center text-lg font-bold text-white">
              Vote for New Treasury Address
            </p>
              <p className="text-center text-lg font-bold text-black hover:underline cursor-pointer pt-4 ">
                <input className="text-center w-6/12 justify-center" type="text" onChange={e => setnewadd(e.target.value)}  />
              </p>
            <p className="text-center text-lg font-bold pt-4">
              <button
                  className="btn" onClick={callVote} style={{background: "#00ffad", text:"#202225"}}>
                <p className="capitalize hover:text-white">Vote for New Treasury</p>
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
