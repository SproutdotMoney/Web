import { Web3ReactProvider } from "@web3-react/core";
import Nav from "../components/nav";
import BottomNav from "../components/bottom_nav";
import App from "next/app";
import NProgress from "../components/nprogress";
import getLibrary from "../lib/getLibrary";
import "../styles/tailwind.css";

function SproutApp({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="flex min-h-screen flex-col">
        <Nav />

        <div className="flex-auto min-w-0 min-h-0 bg-primary">
          <Component {...pageProps} />
        </div>
        <BottomNav />
      </div>


      <NProgress />

    </Web3ReactProvider>
  );
}

SproutApp.getInitialProps = async (appContext) => ({
  ...(await App.getInitialProps(appContext)),
});

export default SproutApp;
