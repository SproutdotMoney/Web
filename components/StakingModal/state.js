import { newRidgeState } from "react-ridge-state";

const stakingModalState = newRidgeState(false);
const stakingModalPoolAddress = newRidgeState("");

export function useStakingModalOpen() {
  const state = stakingModalState.useValue();

  return state;
}

export function useSetStakingModalPool(pool) {
  const [poolAddress, setPoolAddress] = stakingModalPoolAddress.use();
  const setPool = () => {
    setPoolAddress(pool);
  };

  return setPool;
}

export function useStakingModalPoolAddress() {
  const state = stakingModalPoolAddress.useValue();

  return state;
}

export function useStakingModalToggle() {
  const [isOpen, setIsOpen] = stakingModalState.use();

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return toggle;
}
