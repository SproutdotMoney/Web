import { Modal, ModalHeader } from "../Modal";
import { parseEther, formatEther } from "@ethersproject/units";
import { useForm } from "react-hook-form";
import usePoolContract from "../../hooks/usePoolContract";
import useErc20Contract from "../../hooks/useErc20Contract";
import { useAsync } from "react-use";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";
import getReceipt from "../../lib/getReceipt";
import useToast from "../../hooks/useToast";
import { Input } from "../../components/inputs";

const StakingModal = ({
  poolAddress,
  tokenName,
  tokenIconPath,
  tokenAddress,
  open,
  setOpen,
}) => {
  const addToast = useToast();
  const { register, handleSubmit, reset } = useForm();
  const contract = usePoolContract(poolAddress);

  const { account, library } = useWeb3React();

  const maxAllowance = BigNumber.from(2).pow(256).sub(1);

  const erc20 = useErc20Contract(tokenAddress);

  const allowance = useAsync(async () => {
    const allowance = await erc20.allowance(account, poolAddress);
    return allowance;
  }, [erc20]);

  const ercBalance = useAsync(async () => {
    const balance = await erc20.balanceOf(account);
    return balance;
  }, [erc20]);

  const sproutEarned = useAsync(async () => {
    const earned = await contract.earned(account);
    return earned;
  }, [contract, poolAddress]);

  const amountStaked = useAsync(async () => {
    const staked = await contract.balanceOf(account);
    return staked;
  }, [contract, poolAddress]);

  const hasSetAllowance = allowance?.value?._hex === "0x00" ? false : true;

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

  return (
    <Modal
      isOpen={open}
      onDismiss={setOpen}
      className="bg-primary"
      ariaLabel="Staking Modal"
      wide
    >
      <ModalHeader
        title={`Deposit ${tokenName}, Earn SPROUT`}
        onDismiss={setOpen}
      />
      <div className="my-4 flex justify-around relative sm:my-8">
        <div className="flex flex-col items-center content-box py-12">
          <img src="/sprout_logo.png" alt="sprout-logo" />
          <p className="text-white text-lg mt-2">
            {(sproutEarned?.value && formatEther(sproutEarned?.value)) ||
              "0.0000"}
          </p>
          <p className="text-white text-md mt-1 mb-16">SEED Earned</p>
          <button className="btn">
            <p className="capitalize">HARVEST</p>
          </button>
        </div>
        <div className="flex flex-col items-center content-box py-12 px-4">
          <img src={`/${tokenIconPath}`} alt={`${tokenName} icon`} />
          <p className="text-white text-lg mt-2">
            {(amountStaked?.value && formatEther(amountStaked?.value)) ||
              "0.0000"}
          </p>
          <p className="text-white text-md mt-1 mb-16">{`${tokenName} Staked`}</p>
          <p className="text-white text-md absolute erc-balance">{`Balance: ${
            ercBalance?.value && formatEther(ercBalance?.value || "0.000")
          }`}</p>
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
  );
};

export default StakingModal;
