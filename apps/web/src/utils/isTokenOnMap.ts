import { Token, Type } from "rcpswap/currency";

export function isTokenOnMap(tokenMap: Record<string, Token> | undefined, token: Type) {
  return tokenMap
    ? Object.values(tokenMap).find((item) => item.equals(token))
    : false;
}