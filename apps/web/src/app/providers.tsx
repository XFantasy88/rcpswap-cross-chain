"use client";

import * as React from "react";
import { WagmiConfig } from "@/providers/wagmiProvider";
import { QueryClientProvider } from "@/providers/queryClientProvider";
import { Provider } from "react-redux";
import { DarkModeProvider } from "@rcpswap/hooks";

import store from "@/state";
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from "@/theme";
import ListsUpdater from "@/state/lists/updater";

const Updaters = () => {
  return (
    <>
      <ListsUpdater />
    </>
  );
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <>
      <FixedGlobalStyle />
      <WagmiConfig>
        <QueryClientProvider>
          <Provider store={store}>
            <Updaters />
            <DarkModeProvider>
              <ThemeProvider>
                <ThemedGlobalStyle />
                {mounted && children}
              </ThemeProvider>
            </DarkModeProvider>
          </Provider>
        </QueryClientProvider>
      </WagmiConfig>
    </>
  );
}
