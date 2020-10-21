import abi from "../constants/abi/donationContract.json";
import useContract from "./useContract";

export default function useDonationContract(donationAddress) {
    return useContract(donationAddress, abi);
}