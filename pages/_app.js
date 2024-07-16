import Head from "next/head";
import "../styles/globals.css";
import localFont from '@next/font/local'

const playwriteHR = localFont({
  src: '../fonts/PlaywriteHR-VariableFont_wght.ttf',
  variable: '--font-playwrite-hr',
})

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
      </Head>
      <main className={`${playwriteHR.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
