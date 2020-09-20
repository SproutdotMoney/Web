import sproutAbi from "../constants/abi/sproutContract.json";
import useContract from "./useContract";

export default function usePoolContract() {
  return useContract("0x91fC82f5c588c00985aa264FC7b45Ee680110703", sproutAbi);
}

