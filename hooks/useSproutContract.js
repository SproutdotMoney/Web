import sproutAbi from "../constants/abi/sproutContract.json";
import useContract from "./useContract";

export default function usePoolContract() {
  return useContract("0xf14c2a8a54ff392d7a86f19859e6c301d00c33c2",sproutAbi)
}

