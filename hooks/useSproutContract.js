import sproutAbi from "../constants/abi/sproutContract.json";
import useContract from "./useContract";

export default function usePoolContract() {
  return useContract("0x9c539380C2c1c88E25dEB6275b24447D6059F7E8",sproutAbi)
}

