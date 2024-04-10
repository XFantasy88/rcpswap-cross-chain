import { utils } from "ethers";

export function getFunctionSelector(abi: any): string {
  if (abi instanceof utils.FunctionFragment) {
    // Convert to mutable JSON object
    abi = JSON.parse(abi.format(utils.FormatTypes["json"]));
  }

  abi.stateMutability = abi.stateMutability
    ? abi.stateMutability.toLowerCase()
    : "nonpayable";
  abi.type = abi.type ? abi.type.toLowerCase() : "";
  if (abi.type === "fallback" || abi.type === "receive") return "0x";
  const iface = new utils.Interface([abi]);
  if (abi.type === "event") {
    return iface.getEvent(abi.name).format(utils.FormatTypes["sighash"]);
  }
  return iface.getFunction(abi.name).format(utils.FormatTypes["sighash"]);
}
