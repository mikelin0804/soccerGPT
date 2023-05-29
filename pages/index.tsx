import Header from "../components/Header";
import Footer from "../components/Footer";

import Head from "next/head";
import { Configuration, OpenAIApi } from "openai";

export default function Home({ combinedData }: any) {
  return (
    <div className="main">
      <Head>
        <title>soccerGPT</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <Header />
      <div className="content">
        {combinedData.map((item: any, index: any) => (
          <div className="container" key={item.matchDescription.fixture.id}>
            <div className="match ">
              <div className="match-content ">
                <div className="column">
                  <div className="team team--home">
                    <div className="team-logo">
                      <img src={item.matchDescription.teams.home.logo} />
                    </div>
                    <h2 className="team-name">
                      {item.matchDescription.teams.home.name}
                    </h2>
                  </div>
                </div>
                <div className="column">
                  <div className="match-details">
                    <div className="match-score">
                      <span className="match-score-number">
                        {item.matchDescription.goals.home}
                      </span>
                      <span className="match-score-divider">:</span>
                      <span className="match-score-number">
                        {item.matchDescription.goals.away}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="team team--away">
                    <div className="team-logo">
                      <img src={item.matchDescription.teams.away.logo} />
                    </div>
                    <h2 className="team-name">
                      {item.matchDescription.teams.away.name}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="gpt">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/2048px-ChatGPT_logo.svg.png"
                  className="w-10 h-10 "
                />
                <div className="gptText">{item.matchDetail}</div>
              </div>
            </div>
          </div>
        ))}
        <Footer />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  let futballtAPI = process.env.FUT_API!;
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API,
  });

  const openai = new OpenAIApi(configuration);
  let recentMatch = await fetch(
    "https://v3.football.api-sports.io/fixtures?season=2022&league=39&last=3",
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": futballtAPI,
      },
    }
  )
    .then(function (response) {
      if (!response.ok) {
        console.log(response.statusText);
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .catch(function (error) {
      console.log(error);
    });

  recentMatch = recentMatch.response;

  const YAML = require("yaml");

  let matchDetail: any;
  var gptResponse = recentMatch.map(async (data: any, index: any) => {
    matchDetail = await fetch(
      "https://v3.football.api-sports.io/fixtures/events?fixture=" +
        data.fixture.id,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": futballtAPI,
        },
      }
    )
      .then(function (response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.json())
      .catch(function (error) {
        console.log(error);
      });

    matchDetail = matchDetail.response;
    const doc = new YAML.Document();
    doc.contents = matchDetail;
    var gptResponse;
    await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content:
              "You are a professional football commentator, please help me summarize this football match in thrilling way and with less than 100 words." +
              YAML.stringify(doc),
          },
        ],
      })
      .then((res) => {
        gptResponse = res.data.choices[0].message?.content;
      });

    return gptResponse;
  });

  gptResponse = await Promise.all(gptResponse);
  var combinedData = recentMatch.map((item: any, index: any) => {
    return {
      matchDescription: item,
      matchDetail: gptResponse[index],
    };
  });

  return {
    props: {
      combinedData,
    },
    revalidate: 21600,
  };
}
