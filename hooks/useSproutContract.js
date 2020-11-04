import sproutAbi from "../constants/abi/sproutContract.json";
import useContract from "./useContract";

export default function usePoolContract() {
  return useContract("0x42b54830BCBb0A240Aa54cd3f8d1A4DB00851fE3",sproutAbi)
}

