import { Button, Input, Radio, Spacer } from "@geist-ui/core";
import { Fade } from "@mui/material";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Head from "next/head";
import ServerStatusIndicator from "../../components/ServerStatusIndicator";
import Layout from "../../components/Layout";
import battlesData from "../../components/battlesData";

const StartGame = () => {
  const [selectedBattle, setSelectedBattle] = useState(2);
  const [side, setSide] = useState(1); //-1 white, 1 black
  const [playerName, setPlayerName] = useState("SwapGo Player 1");

  const [difficulty, setDifficulty] = useState(2);
  const [boardSize, setBoardSize] = useState(9); // [9, 13, 19

  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!rendered) {
      setRendered(true);
    }
  }, []);

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "SWAPGO Start Page",
    description:
      "Start your journey with SwapGo, a strategic game that rewrites pivotal moments in history.",
    url: "https://go.swap.work/SWAPGO/start",
    image: "https://go.swap.work/logo/swapgo_trans.png",
    author: {
      "@type": "Organization",
      name: "SwapGo",
      url: "https://go.swap.work",
    },
    // "potentialAction": {
    //   "@type": "SearchAction",
    //   "target": "https://go.swap.work/SWAPGO/start?q={search_term_string}",
    //   "query-input": "required name=search_term_string"
    // }
  };

  return (
    rendered && (
      <>
        <Head>
          <title>SWAPGO Start Page</title>
          <meta
            name="description"
            content="Start your journey with SwapGo, a strategic game that rewrites pivotal moments in history."
          />
          <meta
            name="keywords"
            content="SwapGo, strategic game, history, board game, Go game"
          />
          <link rel="canonical" href="https://go.swap.work/SWAPGO/start" />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://go.swap.work/SWAPGO/start" />
          <meta property="og:title" content="SWAPGO Start Page" />
          <meta
            property="og:description"
            content="Start your journey with SwapGo, a strategic game that rewrites pivotal moments in history."
          />
          <meta
            property="og:image"
            content="https://go.swap.work/logo/swapgo_trans.png"
          />

          {/* Twitter Card */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:url"
            content="https://go.swap.work/SWAPGO/start"
          />
          <meta property="twitter:title" content="SWAPGO Start Page" />
          <meta
            property="twitter:description"
            content="Start your journey with SwapGo, a strategic game that rewrites pivotal moments in history."
          />
          <meta
            property="twitter:image"
            content="https://go.swap.work/logo/swapgo_trans.png"
          />

          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
          />
        </Head>
        <ServerStatusIndicator />
        <style jsx>{`
          .start-game-container {
            padding: 16px;
          }
          @media (min-width: 1080px) {
            .start-game-container {
              max-width: 1024px;
            }
          }
          @media (min-width: 1440px) {
            .start-game-container {
              max-width: 1280px;
            }
          }

          @media (max-width: 1079px) {
            .battle-card-container {
              grid-template-columns: 1fr !important;
            }
            .battle-card {
              height: 150px !important;
            }
            .hint-text2 {
              margin-top: 40px;
            }
          }

          .side-options {
            display: flex;
            align-items: center;
            cursor: pointer;
          }

          .hint-text {
            font-size: 1rem;
            color: gray;
            display: inline-block;
            position: relative;
            font-style: italic;
            font-weight: bold;
            margin-bottom: 4px;
          }

          @keyframes flashAndFloat {
            0%,
            100% {
              opacity: 1;
              transform: translateY(0);
            }
            50% {
              opacity: 0.7;
              transform: translateY(2.5px);
            }
          }
        `}</style>
        <Layout>
          <Spacer h={"40px"} />
          <div
            className="start-game-container"
            style={{
              margin: "0 auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "30px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img
                src="/swapgo/board2-remove-bg.png"
                style={{
                  width: "120px",
                  height: "120px",
                  display: "block",
                  objectFit: "cover",
                  margin: "0 auto",
                }}
              />
              <h1 style={{ fontSize: "4.2rem", fontStyle: "italic" }}>
                SwapGo
              </h1>
            </div>
            <p
              style={{
                fontSize: "1.2rem",
                fontStyle: "italic",
              }}
            >
              Every game of SwapGo is a journey through time; each move, a
              pivotal moment in history rewritten.
            </p>
            <div>
              <div
                className="battle-card-container"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${battlesData.length + 1}, 1fr)`,
                  gap: "16px",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <h3 className="hint-text">Live Demo video</h3>
                  <div className="battle-card">
                    <ReactPlayer
                      url={"https://youtu.be/on3ye7jCcRg"}
                      width={320}
                      height={180}
                      volume={1}
                      controls={true}
                      style={{
                        borderRadius: "8px",
                        cursor: "pointer",
                        overflow: "hidden",
                        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                </div>
                {battlesData.map((battle, index) => (
                  <div key={battle.id}>
                    {index === 0 && (
                      <h3 className="hint-text hint-text2">
                        Please select a battle to start
                      </h3>
                    )}
                    <div
                      className="battle-card"
                      style={{
                        border: `1px solid ${
                          selectedBattle === battle.id ? `black` : "lightgrey"
                        }`,
                        boxShadow:
                          selectedBattle === battle.id
                            ? "0 0 10px rgba(0,0,0,0.2)"
                            : "none",
                        transition: "all 0.3s",
                        borderRadius: "8px",
                        cursor: battle.open ? "pointer" : "not-allowed",
                        overflow: "hidden",
                        padding: "16px",
                        height: "180px",
                      }}
                      onClick={() => {
                        if (battle.open) {
                          setSelectedBattle(battle.id);
                        } else alert("This battle is coming soon");
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <img
                          src={battle.img}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            objectPosition: "center",
                            borderRadius: "8px",
                          }}
                        />
                        <div>
                          <h3
                            style={{
                              color:
                                selectedBattle === battle.id ? "black" : "gray",
                              fontWeight: "bold",
                            }}
                          >
                            {battle.name}
                          </h3>
                          <p style={{ fontSize: "12px", fontStyle: "italic" }}>
                            {battle.open ? "Ready to play" : " Coming Soon"}
                          </p>
                        </div>
                      </div>
                      <p
                        style={{
                          color: "gray",
                          marginTop: "8px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          fontSize: "14px",
                        }}
                      >
                        {battle.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* choose size */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              Please select board size
              {[
                { value: 9, label: "9x9", disabled: false },
                { value: 13, label: "13x13", disabled: true },
                { value: 19, label: "19x19", disabled: true },
              ].map((item) => (
                <div
                  key={`${item.label}`}
                  onClick={() => {
                    if (!item.disabled) setBoardSize(item.value);
                  }}
                  style={{
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  {boardSize === item.value ? (
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        background: "black",
                      }}
                    />
                  ) : null}
                  <span
                    style={{
                      color: boardSize === item.value ? "black" : "gray",
                      fontWeight: boardSize === item.value ? "bold" : "normal",
                      textDecoration:
                        boardSize === item.value ? "underline" : "none",
                      fontStyle: "italic",
                    }}
                  >
                    {item.label}
                    {item.disabled ? " (coming soon)" : ""}
                  </span>
                </div>
              ))}
            </div>
            {/* first or not */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                Please choose your side
                <div
                  className="side-options"
                  style={{
                    textDecoration: side === 1 ? "underline" : "none",
                    fontWeight: side === 1 ? "bold" : "normal",
                    color: side === 1 ? "black" : "gray",
                  }}
                  onClick={() => {
                    setSide(1);
                  }}
                >
                  <img
                    src="/swapgo/black.png"
                    style={{
                      width: "30px",
                      height: "30px",
                      transform: `scale(
                    ${side === 1 ? 1.5 : 1}
                    )`,
                      marginRight: "4px",
                    }}
                  />
                  <i>
                    Black{" "}
                    {battlesData.find((b) => b.id === selectedBattle)
                      ? `(${
                          battlesData.find((b) => b.id === selectedBattle)
                            ?.black
                        })`
                      : ""}
                  </i>
                </div>
                <div
                  className="side-options"
                  style={{
                    textDecoration: side === -1 ? "underline" : "none",
                    fontWeight: side === -1 ? "bold" : "normal",
                    color: side === -1 ? "black" : "gray",
                  }}
                  onClick={() => {
                    setSide(-1);
                  }}
                >
                  <img
                    src="/swapgo/white.png"
                    style={{
                      width: "30px",
                      height: "30px",
                      transform: `scale(
                    ${side === -1 ? 1.5 : 1}
                    )`,
                      marginRight: "4px",
                    }}
                  />
                  <i>
                    White{" "}
                    {battlesData.find((b) => b.id === selectedBattle)
                      ? `${
                          battlesData.find((b) => b.id === selectedBattle)
                            ?.white
                        }`
                      : ""}
                  </i>
                </div>
              </div>
            </div>
            {/* difficulty choose */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Please select difficulty
              {[
                { value: 2, label: "Easy" },
                { value: 1, label: "Normal" },
                { value: 0, label: "Hard" },
              ].map((item) => (
                <Radio
                  key={item.value}
                  checked={difficulty === item.value}
                  type="default"
                  onClick={() => setDifficulty(item.value)}
                >
                  <span
                    style={{
                      color: difficulty === item.value ? "black" : "gray",
                      fontWeight: difficulty === item.value ? "bold" : "normal",
                      textDecoration:
                        difficulty === item.value ? "underline" : "none",
                      fontStyle: "italic",
                    }}
                  >
                    {item.label}
                  </span>
                </Radio>
              ))}
            </div>
            {/* name input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div style={{ flex: "1 1 auto" }}>Enter your name</div>
              <Input
                type="secondary"
                placeholder="You want to be called?"
                autoFocus
                width={"240px"}
                onChange={(e) => setPlayerName(e.target.value)}
                value={playerName}
                style={{ fontStyle: "italic" }}
                h={"30px"}
              />
            </div>
            {/* start */}
            <Button
              h={"36px"}
              type="secondary"
              disabled={
                playerName.length === 0 || side === 0 || selectedBattle === 0
              }
              onClick={() => {
                window.location.href = `/SWAPGO/go?id=${selectedBattle}&side=${side}&player=${playerName}&difficulty=${difficulty}&boardSize=${boardSize}`;
              }}
            >
              Start
            </Button>
            <div>
              {
                // English Declaration
                //1.this is a ' Build with Claude June 2024 contest' event project at https://docs.anthropic.com/en/build-with-claude-contest/overview，
                // the website is only for demo for the event, please do not fill in personal sensitive data
                //2. Github attached  : https://github.com/yosgo-opensource/swapgo
                //3.please show it in Footer format
                <div
                  style={{
                    padding: "8px 0",
                    fontStyle: "italic",
                    color: "gray",
                    fontSize: "13px",
                  }}
                >
                  <p>
                    This is a project for the{" "}
                    <a
                      href="https://docs.anthropic.com/en/build-with-claude-contest/overview"
                      style={{ margin: "0 4px", textDecoration: "underline" }}
                    >
                      Build with Claude June 2024 contest
                    </a>{" "}
                    and is for demonstration purposes only. Please do not enter
                    personal or sensitive information.
                    <a
                      href="https://github.com/yosgo-opensource/swapgo"
                      style={{ margin: "0 4px", textDecoration: "underline" }}
                    >
                      View the project Github repository
                    </a>
                  </p>
                </div>
              }
            </div>
          </div>
        </Layout>
      </>
    )
  );
};

export default StartGame;
