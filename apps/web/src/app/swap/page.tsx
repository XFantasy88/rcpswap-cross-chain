"use client";

import SwapWidget from "@/ui/swap/swap-widget";
import { Providers } from "./providers";

export default function SwapPage() {
  return (
    <Providers>
      <SwapWidget />
    </Providers>
  );
}
