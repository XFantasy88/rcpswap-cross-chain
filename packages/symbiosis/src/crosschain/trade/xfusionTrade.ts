import { ChainId, ONE } from "../../constants";
import { Fraction, Percent, Token, TokenAmount } from "../../entities";
import { XFUSION_CHAINS } from "../constants";
import { Router, DataFetcher } from "@rcpswap/router";
import { XfusionRouter } from "../contracts";
import { SymbiosisTrade } from "./symbiosisTrade";
import { Native, Type, Token as RToken } from "rcpswap/currency";
import { PoolCode } from "@rcpswap/router";

import { MultiRoute, RouteStatus } from "@rcpswap/tines";
import { basisPointsToPercent } from "../utils";
import { ROUTE_PROCESSOR_3_ADDRESS } from "rcpswap/config";
import { PublicClient } from "viem";

export class XfusionTrade implements SymbiosisTrade {
  static isAvailable(chainId: ChainId): boolean {
    return XFUSION_CHAINS.includes(chainId);
  }

  tradeType = "dex" as const;

  public tokenAmountIn: TokenAmount;

  public trade!: MultiRoute;
  public route!: Token[];
  public amountOut!: TokenAmount;
  public amountOutMin!: TokenAmount;
  public callData!: string;
  public priceImpact!: Percent;
  public routerAddress!: string;
  public callDataOffset?: number;
  public maxDepth?: number;
  private poolsCodeMap?: Map<string, PoolCode>;

  private readonly tokenOut: Token;
  private readonly to: string;
  private readonly slippage: number;
  private readonly inToken: Type;
  private readonly outToken: Type;
  private readonly router: XfusionRouter;
  private readonly chain: ChainId;

  constructor(
    tokenAmountIn: TokenAmount,
    tokenOut: Token,
    to: string,
    slippage: number,
    router: XfusionRouter,
    maxDepth?: number
  ) {
    this.tokenAmountIn = tokenAmountIn;
    this.tokenOut = tokenOut;
    this.to = to;
    this.slippage = slippage;
    this.router = router;
    this.routerAddress = router.address;
    this.maxDepth = maxDepth;
    // @ts-ignore
    this.chain = tokenAmountIn.token.chain as ChainId;

    console.log(this.chain);

    this.inToken = this.getToken(this.tokenAmountIn.token);
    console.log(this.inToken);
    this.outToken = this.getToken(this.tokenOut);
    console.log(this.outToken);
  }

  public async init() {
    //@ts-ignore
    const dataFetcher = DataFetcher.onChain(this.chain);
    dataFetcher.startDataFetching();
    await dataFetcher.fetchPoolsForToken(this.inToken, this.outToken);
    dataFetcher.stopDataFetching();

    const gasPrice = await this.getGasPrice(dataFetcher.web3Client);

    const poolsCodeMap = await dataFetcher.getCurrentPoolCodeMap(
      this.inToken,
      this.outToken
    );

    this.poolsCodeMap = poolsCodeMap;

    const bestRoute = Router.findBestRoute(
      poolsCodeMap,
      //@ts-ignore
      this.chain,
      this.inToken,
      BigInt(this.tokenAmountIn.raw.toString()),
      this.outToken,
      Number(gasPrice.toString()),
      this.maxDepth ?? 100
    );

    console.log(bestRoute);

    if (bestRoute.status === RouteStatus.NoWay) {
      throw new Error("Cannot create trade");
    }

    this.trade = bestRoute;

    this.priceImpact = new Percent(
      Math.floor((bestRoute.priceImpact ?? 0) * 10000).toString(),
      "10000"
    );
    this.route = [this.tokenAmountIn.token, this.tokenOut];

    const amountOutMin = new TokenAmount(
      this.tokenOut,
      new Fraction(ONE)
        .add(basisPointsToPercent(this.slippage))
        .invert()
        .multiply(bestRoute.amountOutBI.toString()).quotient
    );

    this.amountOut = new TokenAmount(
      this.tokenOut,
      BigInt(bestRoute.amountOutBI.toString())
    );

    this.amountOutMin = amountOutMin;

    const { data, offset } = this.buildCallData();

    this.callData = data;
    this.callDataOffset = offset;

    return this;
  }

  private async getGasPrice(web3Client: PublicClient): Promise<bigint> {
    try {
      return await web3Client.getGasPrice();
    } catch (err) {
      return 10000000n;
    }
  }

  private getToken(token: Token): Type {
    this.slippage;
    this.to;
    this.inToken;
    this.outToken;
    this.router;
    //@ts-ignore
    if (token.isNative) return Native.onChain(this.chain);
    return new RToken({
      address: token.address,
      chainId: this.chain,
      decimals: token.decimals,
      name: token.name,
      symbol: token.symbol,
    });
  }

  private buildCallData(): { data: string; offset: number } {
    if (!this.poolsCodeMap) return { data: "0x00", offset: 0 };
    const args = Router.routeProcessor2Params(
      this.poolsCodeMap,
      this.trade,
      this.inToken,
      this.outToken,
      this.to as `0x${string}`,
      ROUTE_PROCESSOR_3_ADDRESS[this.chain]
    );

    return {
      data: this.router.interface.encodeFunctionData("processRoute", [
        args.tokenIn,
        args.amountIn.toString(),
        args.tokenOut,
        this.amountOutMin.raw.toString(),
        "0",
        args.to,
        args.routeCode,
      ]),
      offset: 68,
    };
  }
}
