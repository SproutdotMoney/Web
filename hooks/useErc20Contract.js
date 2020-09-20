import erc20 from "../constants/abi/erc20.json";
import useContract from "./useContract";

export default function useErc20Contract(erc20Address) {
  return useContract(erc20Address, erc20);
}
