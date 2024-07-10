import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
      </Head>
        <Component {...pageProps} />
    </>
  );
}

export default MyApp;
