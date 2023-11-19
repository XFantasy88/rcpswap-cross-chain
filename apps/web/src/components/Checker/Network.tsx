"use client";

import { FC } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { ButtonLight } from "../Button";

import { ChainId, chainName } from "rcpswap/chain";

interface CheckerProps {
  chainId: ChainId | undefined;
  children: React.ReactNode;
}

const Network: FC<CheckerProps> = ({ chainId, children }) => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  if (!chainId) return null;

  if (chain?.id !== chainId) {
    return (
      <ButtonLight onClick={() => switchNetwork?.(chainId)}>
        Switch to {chainName[chainId]}
      </ButtonLight>
    );
  }
  return <>{children}</>;
};

export default Network;
