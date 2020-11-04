import { Modal, ModalHeader } from "../Modal";
import { parseEther, formatEther } from "@ethersproject/units";
import { useForm } from "react-hook-form";
import usePoolContract from "../../hooks/usePoolContract";
import useDonationContract from "../../hooks/useDonationContract";
import {default as useSproutContract}  from "../../hooks/useSproutContract";
import useErc20Contract from "../../hooks/useErc20Contract";
import { useAsync } from "react-use";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";
import getReceipt from "../../lib/getReceipt";
import useToast from "../../hooks/useToast";
import { Input } from "../../components/inputs";
import {format_friendly} from "../../lib/utils";
import {ACTIVE_NETWORK} from  "../../constants"
import {useEffect, useState} from "react";

const StakingModal = ({
  poolAddress,
  tokenName,
  tokenIconPath,
  tokenAddress,
  open,
  setOpen,
}) => {
  const addToast = useToast();
  const { register, handleSubmit } = useForm();
  const contract = usePoolContract(poolAddress);

  // get donation contract and sprout contract
  const donation_contract = useDonationContract(poolAddress);
  const sprout_contract = useSproutContract();

  const { account, library } = useWeb3React();

  const maxAllowance = BigNumber.from(2).pow(256).sub(1);

  const erc20 = useErc20Contract(tokenAddress);

  //const allowance = useAsync(async () => {
  //  const allowance = await erc20.allowance(account, poolAddress);
  //  return allowance;
  //}, [erc20]);

  //set constants for later displaying
  const [first_loop, set_first_loop] = useState(0);
  const [seedethrate, set_seedethrate] = useState(0);
  const [donationremaining, set_donationremaining] = useState(0);
  const [ercBalance, set_ercBalance] = useState(0);
  const [sproutEarned, set_sproutEarned] = useState(0);
  const [amountStaked, set_amountStaked] = useState(0);

  const [allowance, set_allowance] = useState(0);
  const [hasSetAllowance, set_hasSetAllowance] = useState(false);

  //const hasSetAllowance = allowance?.value?._hex === "0x00" ? false : true;

  // effect hook for updating data
  useEffect(() => {

    // update the ui elements
    async function updateUIStates() {

      if (tokenName == 'ETH')
      {
        const rate = await donation_contract.getamout(BigNumber.from(10).pow(18));
        set_seedethrate(rate);
        const remain = await donation_contract.tbal();
        set_donationremaining(remain);
      }
      else
      {
        const allowance = await erc20.allowance(account, poolAddress);
        const hasSetAllowance = allowance._hex === "0x00" ? false : true;
        set_hasSetAllowance(hasSetAllowance);

        const balance = await erc20.balanceOf(account);
        set_ercBalance(balance);
        const earned = await contract.earned(account);
        set_sproutEarned(earned);
        const staked = await contract.balanceOf(account);
        set_amountStaked(staked);
      }



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

    }, 3000);

    // clearing interval
    return () => clearInterval(timer);
  }, [ account, donation_contract, erc20, contract, poolAddress] );


  const callExit = async () => {
    try {
      const { hash } = await contract.exit();
      await getReceipt(hash, library);
    } catch (e) {
      addToast({ body: e.message, type: "error" });
    }
  };

  const callApprove = async () => {
    try {
      const { hash } = await erc20.approve(poolAddress, maxAllowance);
      await getReceipt(hash, library);
    } catch (e) {
      addToast({ body: e.message, type: "error" });
    }
  };

  const callStake = async (values) => {
    try {
      if (!values.stakedAmount) {
        throw new Error("Value must be greater than 0");
      }

      const stakeInWei = parseEther(values?.stakedAmount);

      const { hash } = await contract.stake(stakeInWei);

      await getReceipt(hash, library);
    } catch (e) {
      addToast({ body: e.message, type: "error" });
    }
  };

  //donate eth to donation address
  const callDonate = async (values) => {

    try {
      if (!values.donatedAmount) {
        throw new Error("Value must be greater than 0");
      }

      const stakeInWei = parseEther(values?.donatedAmount);
      const donation_address = donation_contract.address;

      const trans_obj = {
        // Required unless deploying a contract (in which case omit)
        to: donation_address,  // the target address or ENS name

        // These are optional/meaningless for call and estimateGas
        nonce: 0,           // the transaction nonce
        gasLimit: 0,        // the maximum gas this transaction may spend
        //gasPrice: 0,        // the price (in wei) per unit of gas

        // These are always optional (but for call, data is usually specified)
        value: stakeInWei,           // the amount (in wei) this transaction is sending
        chainId: ACTIVE_NETWORK          // the network ID; usually added by a signer
      }

      const signer = library.getSigner(account);
      const {hash} = await signer.sendTransaction(trans_obj);
      await getReceipt(hash, library);
    } catch (e) {
      addToast({ body: e.message, type: "error" });
    }
  };

  function return_staking_modal(tokenName)
  {
    // if condition for donation
    if (tokenName == 'ETH')
    {
      return (
          <Modal
              isOpen={open}
              onDismiss={setOpen}
              className="bg-primary"
              ariaLabel="Staking Modal"
              wide
          >
            <ModalHeader
                title={  'Donate Ether to a charitable and public goods pool and receive Seeds'}
                onDismiss={setOpen}
            />
            <div className="my-4 flex justify-around relative sm:my-8">
              <div className="flex flex-col items-center content-box py-12">
                <p className="text-white text-xl mt-2">Donation Rate</p>
                <p className="text-white text-lg mt-2">
                  {(seedethrate && format_friendly(seedethrate, 4)) ||
                  "0.0000"}
                </p>
                <p className="text-white text-lg mt-2">
                  SEED / ETH
                </p>
                <p className="text-white text-xl mt-6">SEED remaining</p>
                <p className="text-white text-lg mt-1">{(donationremaining && format_friendly(donationremaining, 4)) ||
                "0.0000"}</p>
                <p className="text-white text-center text-xl mt-6">DONATIONS to</p>
                <p className="text-white text-center text-md mt-1">350.org</p>
                <p className="text-white text-center text-md mt-1">Gitcoin</p>
                <p className="text-white text-center text-md mt-1">Ethereum Foundation</p>
                <p className="text-white text-center text-md mt-1">Andreas Antonopolous</p>
              </div>
              <div className="flex flex-col items-center content-box py-12 px-4">
                <img src={`/${tokenIconPath}`} alt={`${tokenName} icon`} />

                <p className="text-white text-md mt-6 center">Amount of ETH to donate</p>

                {
                    <form onSubmit={handleSubmit(callDonate)}>
                      <div className="my-4 flex justify-around relative sm:my-8">
                        <Input
                            ref={register}
                            id="donatedAmount"
                            name="donatedAmount"
                            type="number"
                            step="0.000000000000000001"
                            required
                        />
                      </div>
                      <div className="my-4 flex justify-around relative sm:my-8">
                        <button className="btn">
                          <p className="capitalize">{`DONATE ${tokenName}`}</p>
                        </button>
                      </div>
                    </form>
                }
              </div>
            </div>
            <style jsx>
              {`
          .content-box {
            border: 1px solid var(--offwhite);
            border-radius: var(--radius);
            width: 350px;
          }
          img {
            height: 50px;
            width: 50px;
          }
          button {
            background-color: rgba(0, 255, 173, 0.25);
          }
          button:hover {
            background-color: rgba(0, 255, 173, 0.25);
          }
          .erc-balance {
            bottom: 120px;
          }
          button > p {
            color: rgba(0, 255, 173, 1);
            opacity: 1;
          }
        `}
            </style>
          </Modal>
      )
    }
    else
    {
      return (
          <Modal
              isOpen={open}
              onDismiss={setOpen}
              className="bg-primary"
              ariaLabel="Staking Modal"
              wide
          >
            <ModalHeader
                title={ `Deposit ${tokenName}, Earn SPROUT`}
                onDismiss={setOpen}
            />
            <div className="my-4 flex justify-around relative sm:my-8">
              <div className="flex flex-col items-center content-box py-12">
                <img src="/sprout_logo.png" alt="sprout-logo" />
                <p className="text-white text-lg mt-2">
                  {(sproutEarned && formatEther(sproutEarned)) ||
                  "0.0000"}
                </p>
                <p className="text-white text-md mt-1 mb-16">SEED Earned</p>
                <button className="btn" onClick={callExit}>
                  <p className="capitalize">HARVEST</p>
                </button>
              </div>
              <div className="flex flex-col items-center content-box py-12 px-4">
                <img src={`/${tokenIconPath}`} alt={`${tokenName} icon`} />
                <p className="text-white text-lg mt-2">
                  {(amountStaked && formatEther(amountStaked)) ||
                  "0.0000"}
                </p>
                <p className="text-white text-md mt-1 mb-16">{`${tokenName} Staked`}</p>
                {account && (
                    <p className="text-white text-md absolute erc-balance">{`Balance: ${
                        ercBalance && formatEther(ercBalance || "0.000")
                    }`}</p>
                )}
                {!hasSetAllowance ? (
                    <button
                        className="btn"
                        onClick={!hasSetAllowance ? callApprove : () => null}
                    >
                      <p className="capitalize">APPROVE</p>
                    </button>
                ) : (
                    <form onSubmit={handleSubmit(callStake)}>
                      <div className="flex flex-row justify-center">
                        <Input
                            ref={register}
                            id="stakedAmount"
                            name="stakedAmount"
                            type="number"
                            step="0.000000000000000001"
                            required
                        />
                        <button className="btn">
                          <p className="capitalize">{`STAKE ${tokenName}`}</p>
                        </button>
                      </div>
                    </form>
                )}
              </div>
            </div>
            <style jsx>
              {`
          .content-box {
            border: 1px solid var(--offwhite);
            border-radius: var(--radius);
            width: 350px;
          }
          img {
            height: 50px;
            width: 50px;
          }
          button {
            background-color: rgba(0, 255, 173, 0.25);
          }
          button:hover {
            background-color: rgba(0, 255, 173, 0.25);
          }
          .erc-balance {
            bottom: 120px;
          }
          button > p {
            color: rgba(0, 255, 173, 1);
            opacity: 1;
          }
        `}
            </style>
          </Modal>
      )
    }
  };

  return (
      return_staking_modal(tokenName)
  );
};

export default StakingModal;
