import abi from "../constants/abi/abi.json";
import useContract from "./useContract";

export default function usePoolContract(poolAddress) {
  return useContract(poolAddress, abi);
}
