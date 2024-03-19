import { ChainId } from "../../constants";
import { SwapExactInTransactionPayload } from "./types";

interface PreparePayloadParams {
  chainId: ChainId;
  fromAddress: string;
  toAddress: string;
  value?: string;
  callData: string;
  functionSelector?: string;
}

// Prepare payload for evm or tron transaction
export function preparePayload({
  chainId,
  fromAddress,
  toAddress,
  callData,
  value = "0",
  functionSelector,
}: PreparePayloadParams): SwapExactInTransactionPayload {
  return {
    transactionType: "evm",
    transactionRequest: {
      chainId,
      from: fromAddress,
      to: toAddress,
      value,
      data: callData,
    },
  };
}
