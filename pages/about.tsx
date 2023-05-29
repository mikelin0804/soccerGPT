import Footer from "../components/Footer";
import Header from "../components/Header";

import Head from "next/head";
export default function Home() {
  return (
    <div className="main">
      <Head>
        <title>soccerGPT</title>
      </Head>
      <Header />
      <div className="about">
            <h2 className=" text-3xl font-extrabold">FAQ</h2>
            <div className="question"> What is this website?</div>  
            <div className="answer"> This website provide the latest Premier Leagues soccer match result and summary with the power of ChatGPT.</div>
            <div className="question"> How many soccer match does this website show?</div>  
            <div className="answer"> Due to limited budget, it will only show 3 latest Premier Leagues match. And it will be updated every 6 hours.</div>
            <div className="question"> What technology did you use?</div>  
            <div className="answer"> I use the <a href="https://www.api-football.com/" className="font-medium text-blue-600 underline dark:text-yellow-500 hover:no-underline">football API</a> to gather latest information and use chatGPT API to summarize it. This website is built with Nextjs.</div>
            <div className="question"> Future Plan?</div>  
            <div className="answer"> I planned to build a chrome extension so it will be easier to check out.</div>
    </div>
    <Footer />
    </div>
  );
}
