import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "./../../redux/store";
import { Provider } from "react-redux";
import "@rainbow-me/rainbowkit/styles.css";
import { XMTPProvider } from "@xmtp/react-sdk";
import { init } from "@airstack/airstack-react";
import 'core-js/es/map';
import 'core-js/es/promise';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import moment from "moment";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  Theme,
} from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import Modals from "@/components/Modals/modules/Modals";
import RouterChange from "@/components/Common/modules/RouterChange";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import Footer from "@/components/Layout/modules/Footer";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import Cart from "@/components/Common/modules/Cart";
import {
  createReactClient,
  studioProvider,
  LivepeerConfig,
} from "@livepeer/react";
import { KinoraProvider } from "kinora-sdk";
import { apolloClient } from "../../lib/lens/client";
import Head from "next/head";

const walletTheme = merge(darkTheme(), {
  colors: {
    accentColor: "#111313",
  },
} as Theme);

interface Translations {
  [key: string]: string;
}

type LanguageContextType = {
  t: (key: keyof Translations) => string;
  setLocale: (locale: "es" | "en") => void;
  locale: "es" | "en";
};

const defaultState: LanguageContextType = {
  t: () => "",
  setLocale: () => {},
  locale: "en",
};

const LanguageContext = createContext<LanguageContextType>(defaultState);
export const useTranslation = (): LanguageContextType =>
  useContext(LanguageContext);

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_KEY!,
  }),
});

const { chains, publicClient } = configureChains(
  [polygon],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! })]
);

const { connectors } = getDefaultWallets({
  appName: "Cypher Search",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

init(process.env.NEXT_PUBLIC_AIRSTACK_KEY!);

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const client = new LitNodeClient({ litNetwork: "cayenne", debug: false });
  const handleRewind = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [locale, setLocale] = useState<"en" | "es">();
  const [translations, setTranslations] = useState<Translations>({});
  const t = (key: keyof Translations) => translations[key] || (key as string);
  const [routerChangeLoading, setRouterChangeLoading] =
    useState<boolean>(false);
  useEffect(() => {
    if (locale) {
      localStorage.setItem("locale", locale);
      fetch(`/locales/${locale}.json`)
        .then((res) => res.json())
        .then((data) => setTranslations(data));
    }
  }, [locale]);
  useEffect(() => {
    const handleStart = () => {
      setRouterChangeLoading(true);
    };

    const handleStop = () => {
      setRouterChangeLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") || "en";
    setLocale(savedLocale as "en" | "es");
    moment.utc();
    console.log(`                                  
    _      _)_ _   _   _   _ _       
   (_( (_( (_ (_) ) ) (_) ) ) ) (_(  
                                  _) `);
  }, []);

  if (routerChangeLoading) {
    return <RouterChange />;
  }
  return (
    <LanguageContext.Provider value={{ t, setLocale, locale: locale ?? "en" }}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={walletTheme}>
          <LivepeerConfig client={livepeerClient}>
            <XMTPProvider dbVersion={2}>
              <KinoraProvider playerAuthedApolloClient={apolloClient}>
                <Provider store={store}>
                  <div
                    className={`relative w-full h-auto flex flex-col ${
                      router?.asPath?.includes("autograph")
                        ? "bg-black"
                        : "bg-offBlack"
                    }`}
                  >
                    <Head>
                      <meta
                        name="keywords"
                        content="Web3, Web3 Fashion, Moda Web3, Open Source, CC0, Emma-Jane MacKinnon-Lee, Open Source LLMs, DIGITALAX, F3Manifesto, www.digitalax.xyz, www.f3manifesto.xyz, Women, Life, Freedom."
                      />
                      <meta name="robots" content="index, follow" />
                      <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                          __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: "Cypher Search",
                            description:
                              "Web3, Web3 Fashion, Moda Web3, Open Source, CC0, Emma-Jane MacKinnon-Lee, Open Source LLMs, DIGITALAX, F3Manifesto, www.digitalax.xyz, www.f3manifesto.xyz, Women, Life, Freedom.",
                            url: "https://www.cypher.digitalax.xyz/",
                          }),
                        }}
                      ></script>
                    </Head>
                    <Component {...pageProps} router={router} client={client} />
                    <Modals router={router} />
                    {router?.asPath?.includes("/autograph/") &&
                      !router?.asPath?.includes("/drop/") && (
                        <Cart router={router} />
                      )}
                    <Footer handleRewind={handleRewind} />
                  </div>
                </Provider>
              </KinoraProvider>
            </XMTPProvider>
          </LivepeerConfig>
        </RainbowKitProvider>
      </WagmiConfig>
    </LanguageContext.Provider>
  );
}

export default App;
