import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Error from "next/error";
import { Fade } from "@mui/material";
import axios from "axios";
import ReactTyped from "react-typed";
import { Button, Divider, Loading, Modal } from "@geist-ui/core";
import Head from "next/head";
import ServerStatusIndicator from "../../components/ServerStatusIndicator";
import { imageLoadingMessages, aiThinkingMessages  } from "../../components/loadingMessages";
import { getScreenWritingTemplate, getEndGameScreenWritingTemplate } from "../../components/screenWriting/screenWritingTemplate";
import Layout from "../../components/Layout";
import battlesData from "../../components/battlesData";
import YTMusic from "../../components/YTMusic";

const GO = () => {

  const [imageLoadingModalVisible, setImageLoadingModalVisible] = useState(false);
  const [aiThinkingModalVisible, setAiThinkingModalVisible] = useState(false);

  const router = useRouter();
  // parameters
  const [parsed, setParsed] = useState(null);
  const [player, setPlayer] = useState(null);
  const [side, setSide] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [boardSize, setBoardSize] = useState(null);
  const [battle, setBattle] = useState(null);
  const [whoFirst, setWhoFirst] = useState(null);

  const [currentState, setCurrentState] = useState(null);
  const [moves, setMoves] = useState(null);
  const [gameLog, setGameLog] = useState([]);
  const [aiThinking, setAIThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [screenWriting, setScreenWriting] = useState([]);
  const [aiReplyCountDown, setAIReplyCountDown] = useState(0);
  const [endGameModalOpen, setEndGameModalOpen] = useState(false);
  const [endGameScreenWriting, setEndGameScreenWriting] = useState(null);

  // parse URL parameters
  useEffect(() => {
    if (!parsed) {
      const urlParams = new URLSearchParams(window.location.search);
      const _player = urlParams.get("player");
      const _side = urlParams.get("side");
      const _difficulty = urlParams.get("difficulty");
      const _boardSize = urlParams.get("boardSize");
      const _battle = battlesData.find(
        (b) => `${b.id}` === `${urlParams.get("id")}`
      );

      if (!_player || !_side || !_difficulty || !_boardSize || !_battle) {
        router.push("/SWAPGO/start");
        return;
      }

      setPlayer(_player);
      setSide(_side);
      setDifficulty(_difficulty);
      setBoardSize(_boardSize);
      setBattle(_battle);
      setWhoFirst(_side === "1" ? "Player" : "AI");
      setScreenWriting([
        {
          img: _battle.img,
          description: _battle?.description,
        },
      ]);

      setTimeout(() => {
        setParsed(true);
      }, 50);
    }
  }, []);

  //initialize game board
  useEffect(() => {
    if (parsed) {
      // clean up
      document.querySelector(".tenuki-board").innerHTML = "";

      // new game board : github.com/aprescott/tenuki
      var boardElement = document.querySelector(".tenuki-board");
      var game = new tenuki.Game({
        element: boardElement,
        komi: 6.5,
        scoring: "area",
        boardSize: Number(boardSize),
      });
      setCurrentState(game.currentState());

      // callback
      game.callbacks.postRender = function (game) {
        // setup state
        let _game = game.currentState();
        setCurrentState(_game);
      };
    }
  }, [parsed]);

  //Manually record moves history for later API uses
  useEffect(() => {
    if (currentState) {
      // console.log("> currentState", currentState);
      setMoves(moveAccFunction(moves, currentState));
    }
  }, [currentState]);
  useEffect(() => {
    if (moves) {
      // console.log("> moves", moves);
    }
  }, [moves]);

  //Update Log
  const handleAddGameLog = (string) => {
    setGameLog([...gameLog, string]);
  };
  // function deliver game record to AI
  const handleGetAIMove = async () => {
    // game record clean-up
    const format = () => {
      return moves.map((m) => {
        const revert = convertArrayIndexToGoPosition(
          m.y,
          m.x,
          currentState.boardSize
        );
        return `("${m?.color?.charAt(0)}",(${revert[0]}, ${revert[1]}))`;
      });
    };
    let payload = format();
    payload = `[${payload.join(",")}]`; // API-read game play record

    //constants
    const playerColor = side === "1" ? "black" : "white";
    const aiColor = side === "1" ? "white" : "black";
    const lastColor = moves[moves.length - 1]?.color;
    const waitForAIString = "AI is thinking... 🤔";
    const waitForPlayerString = `It's your turn 『${player}』`;

    //API request
    const fetchGenAI = async () => {
      setImageLoadingModalVisible(true);
      try {
      let _newScreenWriting;
      
      const screenWritingTemplate = getScreenWritingTemplate({
        player,
        playerColor,
        aiColor,
        whoFirst,
        currentState,
        aiResponse,
        battle,
        screenWriting
      });
      // console.log("> screenWritingTemplate", screenWritingTemplate);

      //Generate Narratives and image prompts
      await axios
        .post("/api/claude_call", {
          prompts: [
            {
              role: "user",
              content: `${screenWritingTemplate}`,
            },
          ],
        })
        .then((res) => {
          const parsed = JSON.parse(res.data.payload.text);
          const { description, imgPrompt } = parsed;
          _newScreenWriting = {
            imgPrompt,
            description,
          };
        })
        .catch((err) => {
          alert("> ScreenWriting error");
        });

      //Generate Images
      await axios
        .post("/api/dalle", {
          type: "image",
          prompt: _newScreenWriting.imgPrompt,
        })
        .then((res) => {
          const img = res?.data?.data[0]?.url || battle.img;
          _newScreenWriting = {
            ..._newScreenWriting,
            img,
          };
          setScreenWriting([...screenWriting, _newScreenWriting]);
        })
        .catch((err) => {
          _newScreenWriting = {
            ..._newScreenWriting,
            img: battle.img,
          };
          console.log("> ImageGenerating error", err);
        });
      } finally {
        setImageLoadingModalVisible(false);
      }
    };

    const fetchAI = async () => {
      setAiThinkingModalVisible(true);

      try {
        setAIThinking(true);
        setAIReplyCountDown(90);
        //Get AI board response
        await axios
          .post(`https://swapgo.yosgo.com/ana`, {
            moves: payload,
          })
          .then((res) => {
            let ana = res.data;
            let pass =
              `${ana.next_move}`.indexOf("pass") !== -1 ||
              ana?.top_moves.find((m) => m.move.indexOf("pass") !== -1);
            // According to the difficulty, calculate the next step in number format
            let next_move_number_format;
            let next_move_text_format;
            let next_move_english_format;
            if (!pass && ana?.top_moves?.length > 0) {
              const { top_moves } = ana;
              let selected_move = top_moves[Number(difficulty)];
              if (selected_move) {
                next_move_english_format = selected_move.move.substring(0, 2);
                next_move_number_format = convertMove(
                  selected_move.move.substring(0, 2)
                );
                next_move_text_format = `${selected_move.move} probability: ${selected_move.probability}`;
              }
            }
            ana = {
              ...ana,
              pass,
              next_move_english_format,
              next_move_number_format,
              next_move_text_format,
            };

            // Update State
            setAIThinking(false);
            setAiResponse(ana);
            setAIReplyCountDown(0);
          })
          .catch((err) => {
            alert("KataGo error");
            console.log("> fetchAI error", err);
          });
      } catch (err) {
        // setAIThinking(false);
        // setAIReplyCountDown(0);
        console.log("Error", err);
      } finally {
        setAIThinking(false);
        setAIReplyCountDown(0);
        setAiThinkingModalVisible(false);
        handleAddGameLog("Your Turn 換你了");
      }
    };

    // play sequence judgement
    if (moves.length === 0) {
      if (playerColor === "black") {
        handleAddGameLog(waitForPlayerString);
      } else {
        handleAddGameLog(waitForAIString);
        fetchGenAI();
        fetchAI();
      }
    } else {
      if (playerColor !== lastColor) {
        handleAddGameLog(waitForPlayerString);
      } else {
        handleAddGameLog(waitForAIString);
        fetchGenAI();
        fetchAI();
      }
    }
  };

  useEffect(() => {
    if (aiResponse && !aiThinking) {
      setAiThinkingModalVisible(false);
    }
  }, [aiResponse, aiThinking]);

  // Enforce auto-playing
  useEffect(() => {
    (async () => {
      if (parsed && moves) {
        await handleGetAIMove();
      }
    })();
  }, [moves, parsed]);
  // AI Click the board
  useEffect(() => {
    if (
      aiThinking === false &&
      aiResponse &&
      aiReplyCountDown === 0 &&
      aiResponse?.next_move_number_format &&
      !aiResponse?.pass
    ) {
      // Get AI response，update board & judge win/lose
      try {
        // console.log("> ana", aiResponse);
        const x = aiResponse.next_move_number_format[0];
        const y = aiResponse.next_move_number_format[1];
        const intersection = document.querySelector(
          `.intersection[data-intersection-x="${x}"][data-intersection-y="${y}"]`
        );
        if (intersection) {
          const event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          });
          intersection.dispatchEvent(event);
          intersection.dispatchEvent(event);
        } else {
          throw new Error(`No intersection element found with coordinates (${x}, ${y})`);
        }
      } catch (err) {
        alert("Click board Error", err);
      }
    } else if (aiResponse && aiResponse?.pass) {
      //AI judge end game
      setEndGameModalOpen(true);
    }
  }, [aiThinking, aiResponse, aiReplyCountDown]);

  // AI respond anticipated countdown
  useEffect(() => {
    if (aiReplyCountDown > 0) {
      const timer = setTimeout(() => {
        setAIReplyCountDown(aiReplyCountDown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [aiReplyCountDown]);

  // monitoring Narratives
  useEffect(() => {
    // console.log("> screenWriting", screenWriting);
  }, [screenWriting]);

  // Dealing with End game
  useEffect(() => {
    (async () => {
      //while endGameModelOpen, deliver data to ai to produce narratives and combat outcome
      if (endGameModalOpen) {
        //constants
        const playerColor = side === "1" ? "black" : "white";
        const aiColor = side === "1" ? "white" : "black";

        // narratives prompt
        let _endGameScreenWriting;
        const endGameScreenWritingTemplate = getEndGameScreenWritingTemplate({
          player,
          playerColor,
          aiColor,
          whoFirst,
          currentState,
          aiResponse,
          battle,
          screenWriting
        });
        // Generate Narratives and image prompts
        await axios
          .post("/api/claude_call", {
            prompts: [
              {
                role: "user",
                content: `${endGameScreenWritingTemplate}`,
              },
            ],
          })
          .then((res) => {
            const parsed = JSON.parse(res.data.payload.text);
            const { description, imgPrompt } = parsed;
            _endGameScreenWriting = {
              imgPrompt,
              description,
            };
          })
          .catch((err) => {
            alert("> ScreenWriting error");
          });

        // Generate Images
        await axios
          .post("/api/dalle", {
            type: "image",
            prompt: _endGameScreenWriting.imgPrompt,
          })
          .then((res) => {
            const img = res?.data?.data[0]?.url || battle.img;
            _endGameScreenWriting = {
              ..._endGameScreenWriting,
              img,
            };
          })
          .catch((err) => {
            _endGameScreenWriting = {
              ..._endGameScreenWriting,
              img: battle.img,
            };
            console.log("> ImageGenerating error", err);
          });

        // Update Narratives
        setEndGameScreenWriting(_endGameScreenWriting);
      }
    })();
  }, [endGameModalOpen]);

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "SWAPGO Game Page",
    description: `Game session for ${player} in SWAPGO`,
    url: `https://go.swap.work/SWAPGO/go?id=${battle?.id}&side=${side}&player=${player}&difficulty=${difficulty}&boardSize=${boardSize}`,
    image: "https://go.swap.work/logo/swapgo_trans.png",
    author: {
      "@type": "Organization",
      name: "SwapGo",
      url: "https://go.swap.work",
    },
  };

  return (
    <Layout>
      <Head>
        <title>{`${player}'s Game - SWAPGO`}</title>
        <meta
          name="description"
          content={`SwapGo Go game session for ${player} in SWAPGO`}
        />
        <link
          rel="canonical"
          href={`https://go.swap.work/SWAPGO/go?id=${battle?.id}&side=${side}&player=${player}&difficulty=${difficulty}&boardSize=${boardSize}`}
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://go.swap.work/SWAPGO/go?id=${battle?.id}&side=${side}&player=${player}&difficulty=${difficulty}&boardSize=${boardSize}`}
        />
        <meta property="og:title" content={`${player}'s Game - SWAPGO`} />
        <meta
          property="og:description"
          content={`Go game session for ${player} in SWAPGO`}
        />
        <meta
          property="og:image"
          content="https://go.swap.work/logo/swapgo_trans.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`https://go.swap.work/SWAPGO/go?id=${battle?.id}&side=${side}&player=${player}&difficulty=${difficulty}&boardSize=${boardSize}`}
        />
        <meta property="twitter:title" content={`${player}'s Game - SWAPGO`} />
        <meta
          property="twitter:description"
          content={`Go game session for ${player} in SWAPGO`}
        />
        <meta
          property="twitter:image"
          content="https://go.swap.work/logo/swapgo_trans.png"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
        />
      </Head>
      <ServerStatusIndicator />
      <style jsx>
        {`
          .swap-go-board-container {
            width: 480px;
            height: 480px;
          }
          .swap-go-board {
            width: 100% !important;
            height: 100% !important;
          }

          .swap-go-container {
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            border: 3px solid black;
            box-sizing: border-box;
            min-height: 100vh;
            overflow: auto;
          }
          .leftColumn {
            display: flex;
            border-right: 3px solid rgba(55, 55, 55, 1);
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            box-sizing: border-box;
          }
          .rightColumn {
            width: 100%;
            position: relative;
          }
          .leftTop {
            overflow: auto;
            box-sizing: border-box;
            padding: 8px 16px;
          }
          .leftBottom {
            border-top: 3px solid rgba(55, 55, 55, 1);
            box-sizing: border-box;
            position: relative;
          }

          //當螢幕寬度小於 960px 時
          @media (max-width: 960px) {
            .swap-go-board-container {
              width: calc(100vw - 6px);
              height: calc(100vw - 6px);
            }
            .swap-go-container {
              flex-wrap: wrap;
            }
            .rightColumn {
              height: 100vw;
              width: 100vw;
            }
            .leftColumn {
              border-right: none;
              border-bottom: 3px solid rgba(55, 55, 55, 1);
            }
            .leftBottom {
              border-top: none;
            }
            .screenWriting-text {
              font-size: 13px !important;
              padding: 2px 8px !important;
            }
          }
        `}
      </style>
      {!parsed ? (
        <div> Loading... </div>
      ) : (
        <Fade in={parsed}>
          <div>
            {/* End Game Modal */}
            <Modal
              visible={endGameModalOpen}
              onClose={() => setEndGameModalOpen(false)}
              aria-labelledby="end-game-modal-title"
            >
              {endGameScreenWriting === null ? (
                <div>
                  <Loading />
                  Someone call end game. System is scoring
                </div>
              ) : (
                <div style={{ textAlign: "left" }}>
                  {aiResponse && endGameScreenWriting && (
                    <div>
                      <img
                        src={endGameScreenWriting?.img}
                        style={{
                          borderRadius: "2px",
                        }}
                      />
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "1rem",
                          fontStyle: "italic",
                        }}
                      >
                        {endGameScreenWriting.description}
                      </div>
                      <Divider />
                      <p>{aiResponse.score_lead}</p>
                      <p>Black: {aiResponse.black_win_rate}</p>
                      <p>White: {aiResponse.white_win_rate}</p>
                    </div>
                  )}
                </div>
              )}
              <Modal.Action
                onClick={() => {
                  window.location.href = "/SWAPGO/start";
                }}
              >
                Play Again
              </Modal.Action>
            </Modal>
            <div className="swap-go-container" role="main">
              <div
                className="leftColumn"
                aria-label="SwapGo Go Game Board and Controls"
              >
                <div className="leftTop">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      // console.log("> All state", {
                      //   player,
                      //   side,
                      //   difficulty,
                      //   boardSize,
                      //   battle,
                      //   whoFirst,
                      //   currentState,
                      //   moves,
                      //   gameLog,
                      //   aiThinking,
                      //   aiResponse,
                      //   screenWriting,
                      //   aiReplyCountDown,
                      //   endGameModalOpen,
                      // });
                    }}
                  >
                    <h1
                      style={{ fontSize: "1.5rem", fontStyle: "italic" }}
                      aria-label="Battle Name"
                    >
                      {battle.name}
                    </h1>
                    {aiResponse && (
                      <div>
                        <Button
                          width={"20px"}
                          paddingLeft={"8px"}
                          paddingRight={"8px"}
                          height={"30px"}
                          aria-label="End Game"
                          onClick={() => {
                            if (aiThinking) {
                              alert(
                                "AI is thinking, please for the next move to end the game."
                              );
                            } else {
                              var confirm = window.confirm(
                                "Are you sure to end the game? The game will be scored and ended."
                              );
                              if (confirm) {
                                setEndGameModalOpen(true);
                              }
                            }
                          }}
                        >
                          End game
                        </Button>
                      </div>
                    )}
                    <YTMusic />
                  </div>
                  <div>
                    {[
                      {
                        label: battle.black,
                        type: "black",
                        img: "/swapgo/black.png",
                        value: "1",
                        captured: currentState?.blackStonesCaptured,
                      },
                      {
                        label: battle.white,
                        type: "white",
                        img: "/swapgo/white.png",
                        value: "-1",
                        captured: currentState?.whiteStonesCaptured,
                      },
                    ].map((item) => (
                      <div key={item.img} style={{ marginTop: "16px" }}>
                        <i>
                          {item.type.toUpperCase()}: {item.label}(
                          {side === item.value ? `You, ${player}` : "AI"})
                        </i>

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <img
                            src={item.img}
                            style={{ width: "20px", height: "20px" }}
                          />
                          <i>
                            <b>{item.captured}</b>{" "}
                            {item.captured > 1 ? "stones" : "stone"}{" "}
                            {item.captured > 1 ? "were" : "was"} captured
                          </i>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="leftBottom" aria-label="Go board">
                  {/* 棋盤狀態 */}
                  <div
                    style={{
                      padding: "4px 16px",
                      textAlign: "center",
                      position: "relative",
                    }}
                  >
                    {gameLog.length > 0 && (
                      <span
                        style={{
                          position: "relative",
                          zIndex: 3,
                          display: "inline-block",
                          margin: "0 auto",
                          backdropFilter: "blur(5px)",
                          backgroundColor: "rgba(255, 255, 255, 0.5)",
                          border: "1px solid rgba(255, 255, 255, 0.18)",
                          borderRadius: "8px",
                          padding: "0 8px",
                          fontStyle: "italic",
                        }}
                      >
                        <i>
                          {currentState?.moveNumber > 0
                            ? `Move ${currentState?.moveNumber}. `
                            : ""}
                          {gameLog[gameLog.length - 1]}
                          {aiReplyCountDown > 0 ? (
                            <span>
                              , estimating reply in <b>{aiReplyCountDown}</b>{" "}
                              seconds
                            </span>
                          ) : (
                            ""
                          )}
                        </i>
                      </span>
                    )}
                    <div
                      style={{
                        zIndex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        background: "black",
                        width: aiResponse ? aiResponse?.black_win_rate : "50%",
                        minHeight: "34px",
                        height: "100%",
                        fontSize: "12px",
                        transition: "width 1s",
                      }}
                    ></div>
                    <div
                      style={{
                        zIndex: 2,
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "white",
                        width: aiResponse ? aiResponse?.white_win_rate : "50%",
                        minHeight: "34px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        transition: "width 1s",
                      }}
                    >
                      <span
                        style={{
                          width: "30px",
                          margin: "-55px 0 0 -8px",
                          fontSize: "1rem",
                        }}
                      >
                        🚩
                      </span>
                    </div>
                  </div>
                  {/* 棋盤 */}
                  <div className="swap-go-board-container">
                    <div
                      className="tenuki-board swap-go-board"
                      data-include-coordinates={true}
                    />
                    {aiThinkingModalVisible && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "rgba(255, 255, 255, 0.8)",
                          zIndex: 100,
                        }}
                      >
                        <Modal visible={aiThinkingModalVisible} disableBackdropClick>
                          <Modal.Content>
                            <Loading>
                              <ReactTyped
                                strings={aiThinkingMessages}
                                typeSpeed={40}
                                backSpeed={50}
                                loop
                              />
                            </Loading>
                          </Modal.Content>
                        </Modal>
                        </div>
                      )}
                  </div>
                  {/* mask */}
                  {aiThinking && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        cursor: "not-allowed",
                        zIndex: 99,
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="rightColumn" aria-label="Game Narrative">
              <Modal visible={imageLoadingModalVisible} disableBackdropClick>
                <Modal.Content>
                  <Loading>
                    <ReactTyped
                      strings={imageLoadingMessages}
                      typeSpeed={40}
                      backSpeed={50}
                      loop
                    />
                  </Loading>
                </Modal.Content>
              </Modal>
                {screenWriting.map((item, index) => {
                  const rotate = index * 0.05;
                  return (
                    <div
                      key={`screenWriting-${index}`}
                      aria-label={`Narrative Scene ${index + 1}`}
                      style={{
                        zIndex: index,
                        position: "absolute",
                        height: "92%",
                        width: "92%",
                        top: "4%",
                        left: "4%",
                        borderRadius: "2px",
                        backgroundImage: `url(${item?.img}), linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url("/swapgo/background.png")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxSize: "border-box",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        transform: `rotate(${index * 0.05}deg)`,
                        border: "2px solid #909090",
                        transform: `rotate(${rotate}deg)`,
                      }}
                    >
                      <div
                        className="screenWriting-text"
                        style={{
                          padding: "16px",
                          fontSize: "1.2rem",
                          width: "90%",
                          margin: "8px auto 8px auto",
                          backdropFilter: "blur(5px)",
                          backgroundColor: "rgba(255, 255, 255, 0.5)",
                          border: "1px solid rgba(255, 255, 255, 0.18)",
                          borderRadius: "8px",
                          fontStyle: "italic",
                        }}
                      >
                        <ReactTyped
                          strings={[`${item.description}`]}
                          typeSpeed={60}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Fade>
      )}
    </Layout>
  );
};

export default GO;

/** supplement function */
//
function convertArrayIndexToGoPosition(row, col, boardSize = 9) {
  const actualRow = boardSize - 1 - row;
  return [actualRow, col];
}
// convert to English coordinates
function convertMove(moveStr) {
  let col = moveStr.charCodeAt(0) - "A".charCodeAt(0);
  const row = 9 - parseInt(moveStr[1]);
  // deal with every alphabet after "I"
  if (col >= 8) {
    col = 8; // skip "I"
  }
  return [col, row];
}

// board record
const moveAccFunction = (moves = [], currentState) => {
  let result;
  if (currentState && currentState?.playedPoint) {
    result = [
      ...moves,
      {
        color: currentState.color,
        x: currentState.playedPoint.x,
        y: currentState.playedPoint.y,
      },
    ];
  } else {
    result = moves || [];
  }
  return result;
};

/**
 * 1. Choose difficulty and side
 * 2. go game Log、narrative battle copywriting、a set of black&white stones coupled with an image
 * 3.  Adjust fight bar According to win rate
 * 4. Add music
 * Lang convert
 * Timer、Number Value
 * Surrender, Scoring
 * voice reading
 * copyright
 * Onboarding
 * Export
 */