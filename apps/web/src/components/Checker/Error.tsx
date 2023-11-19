"use client";

import { FC } from "react";
import { GreyCard } from "../Card";
import { TYPE } from "@/theme";

interface CheckerProps {
  error: string | undefined;
  children: React.ReactNode;
}

const Error: FC<CheckerProps> = ({ error, children }) => {
  if (error) {
    return (
      <GreyCard style={{ textAlign: "center" }}>
        <TYPE.main mb={"4px"}>{error}</TYPE.main>
      </GreyCard>
    );
  }
  return <>{children}</>;
};

export default Error;
