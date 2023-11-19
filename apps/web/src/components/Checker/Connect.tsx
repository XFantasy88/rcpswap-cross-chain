"use client";

import { FC } from "react";
import { useAccount } from "wagmi";
import { ButtonLight } from "../Button";
import { useWalletModalToggle } from "@/state/application/hooks";

interface CheckerProps {
  children: React.ReactNode;
}

const Connect: FC<CheckerProps> = ({ children }) => {
  const { address } = useAccount();
  const toggleWalletModal = useWalletModalToggle();

  if (!address) {
    return (
      <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
    );
  }
  return <>{children}</>;
};

export default Connect;
