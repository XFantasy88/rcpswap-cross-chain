import { TransactionReceipt } from "viem"
import { TransactionReceipt as EthersTransactionReceipt } from "@ethersproject/abstract-provider"
import { ethers } from "ethers"

export const getEthersTransactionReceipt = (
  receipt: TransactionReceipt
): EthersTransactionReceipt => {
  return {
    blockHash: receipt.blockHash,
    blockNumber: Number(receipt.blockNumber),
    byzantium: true,
    contractAddress: receipt?.contractAddress ?? "",
    cumulativeGasUsed: ethers.BigNumber.from(
      receipt.cumulativeGasUsed.toString()
    ),
    effectiveGasPrice: ethers.BigNumber.from(
      receipt.effectiveGasPrice.toString()
    ),
    from: receipt.from,
    gasUsed: ethers.BigNumber.from(receipt.gasUsed.toString()),
    logs: receipt.logs.map((log) => ({
      address: log.address,
      blockHash: log.blockHash,
      blockNumber: Number(log.blockNumber),
      data: log.data,
      logIndex: log.logIndex,
      removed: log.removed,
      topics: log.topics,
      transactionHash: log.transactionHash,
      transactionIndex: log.transactionIndex,
    })),
    logsBloom: receipt.logsBloom,
    to: receipt.to ?? "",
    transactionHash: receipt.transactionHash,
    transactionIndex: receipt.transactionIndex,
    type: receipt.type === "legacy" ? 0 : receipt.type === "eip1559" ? 1 : 2,
    status: receipt.status === "reverted" ? 0 : 1,
    confirmations: 0,
  }
}
