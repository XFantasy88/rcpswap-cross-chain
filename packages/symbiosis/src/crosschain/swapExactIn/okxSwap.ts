import BigNumber from "bignumber.js";
import CryptoJS from "crypto-js";
import { ChainId, getNativeTokenAddress } from "../../constants";
import { Token, TokenAmount } from "../../entities";
import { DataProvider } from "../dataProvider";
import { OneInchTrade, getTradePriceImpact } from "../trade";
import { SwapExactInParams, SwapExactInResult } from "./types";

const OKX_CHAINS = new Set([
  ChainId.MATIC_MAINNET,
  ChainId.BSC_MAINNET,
  ChainId.AVAX_MAINNET,
  ChainId.ARBITRUM_MAINNET,
]);

export function isOKXSwapSupported(params: SwapExactInParams): boolean {
  const inChainId = params.inTokenAmount.token.chainId;
  const outChainId = params.outToken.chainId;

  return (
    inChainId === outChainId &&
    OKX_CHAINS.has(inChainId) &&
    OneInchTrade.isAvailable(inChainId)
  );
}

function okxSecurityHeaders(url: URL): Record<string, string> {
  const secretKey = "5E7583807F073388BC0E127817D08A4D";
  const timestamp = new Date().toISOString();
  const passphrase = "*N0b0C@1tq&6";
  const hash = CryptoJS.HmacSHA256(
    `${timestamp}GET${url.pathname}${url.search}`,
    secretKey
  );
  const sign = CryptoJS.enc.Base64.stringify(hash);

  return {
    "OK-ACCESS-KEY": "a90cfe67-4bb8-4d65-9115-d4ab0cb8f83c",
    "OK-ACCESS-SIGN": sign,
    "OK-ACCESS-TIMESTAMP": timestamp,
    "OK-ACCESS-PASSPHRASE": passphrase,
  };
}

function getTokenAddress(token: Token): string {
  if (token.isNative) {
    return getNativeTokenAddress(token.chainId);
  }

  return token.address;
}

export async function okxSwap({
  symbiosis,
  inTokenAmount,
  outToken,
  fromAddress,
  toAddress,
  slippage,
}: SwapExactInParams): Promise<SwapExactInResult> {
  if (fromAddress.toLowerCase() !== toAddress.toLowerCase()) {
    throw new Error("Sender and receiver must be the same");
  }

  const fromTokenAddress = getTokenAddress(inTokenAmount.token);
  const toTokenAddress = getTokenAddress(outToken);

  const convertedSlippage = new BigNumber(slippage).div(10000).toString();

  const url = new URL("https://www.okx.com/api/v5/dex/aggregator/swap");

  url.searchParams.set("chainId", inTokenAmount.token.chainId.toString());
  url.searchParams.set("fromTokenAddress", fromTokenAddress);
  url.searchParams.set("toTokenAddress", toTokenAddress);
  url.searchParams.set("amount", inTokenAmount.raw.toString());
  url.searchParams.set("userWalletAddress", fromAddress);
  url.searchParams.set("slippage", convertedSlippage);

  const response = await fetch(url.toString(), {
    headers: {
      "content-type": "application/json",
      ...okxSecurityHeaders(url),
    },
  });

  const { data } = await response.json();

  if (!data?.length) {
    throw new Error("No data in response");
  }

  const { routerResult, tx } = data[0];

  const amountOut = new TokenAmount(outToken, routerResult.toTokenAmount);

  const oracle = symbiosis.oneInchOracle(inTokenAmount.token.chainId);
  const dataProvider = new DataProvider(symbiosis);
  const priceImpactPromise = getTradePriceImpact({
    dataProvider,
    oracle,
    tokenAmountIn: inTokenAmount,
    tokenAmountOut: amountOut,
  });

  const approveUrl = new URL(
    "https://www.okx.com/api/v5/dex/aggregator/approve-transaction"
  );
  approveUrl.searchParams.set(
    "chainId",
    inTokenAmount.token.chainId.toString()
  );
  approveUrl.searchParams.set("tokenContractAddress", fromTokenAddress);
  approveUrl.searchParams.set("approveAmount", inTokenAmount.raw.toString());

  const approveResponsePromise = fetch(approveUrl.toString(), {
    headers: {
      "content-type": "application/json",
      ...okxSecurityHeaders(approveUrl),
    },
  });

  const [priceImpact, approveResponse] = await Promise.all([
    priceImpactPromise,
    approveResponsePromise,
  ]);

  const { data: approveData } = await approveResponse.json();

  const approveTo = approveData?.[0]?.dexContractAddress;

  return {
    kind: "onchain-swap",
    route: [inTokenAmount.token, outToken],
    tokenAmountOut: amountOut,
    approveTo,
    priceImpact,
    transactionType: "evm",
    inTradeType: "okx",
    transactionRequest: {
      to: tx.to,
      data: tx.data,
      value: inTokenAmount.token.isNative
        ? inTokenAmount.raw.toString()
        : undefined,
    },
  };
}
