import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Error from "next/error";
import { Layout, battlesData } from "./start";
import { Fade } from "@mui/material";
import axios from "axios";
import ReactPlayer from "react-player";
import ReactTyped from "react-typed";
import { Button, Divider, Loading, Modal } from "@geist-ui/core";
<<<<<<< HEAD
import { max } from "moment";
=======
import Head from "next/head";


>>>>>>> d36991db5016997d3c49e2847f92a1ccc06f6efa

const GO = () => {
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
  const [aiGenerating, setAIGenerating] = useState(false);
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

<<<<<<< HEAD
  //初始化棋盤
=======
  //decide the board width
  const handleResizeTheBoardWidth = () => {
    //get window width first
    const screenWidth = window.innerWidth;
    setBoardWidth(screenWidth / 2 - 6);
  };
  useEffect(() => {
    handleResizeTheBoardWidth();
  }, []);
  useEffect(() => {
    // while resizing the window, the board width will be recalculated
    window.addEventListener("resize", handleResizeTheBoardWidth);
  }, []);

  //initialize game board
>>>>>>> d36991db5016997d3c49e2847f92a1ccc06f6efa
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
      console.log("> currentState", currentState);
      setMoves(moveAccFunction(moves, currentState));
    }
  }, [currentState]);
  useEffect(() => {
    if (moves) {
      console.log("> moves", moves);
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
    const fetchAI = async () => {
      setAIGenerating(true);
      setAIReplyCountDown(90);
      try {
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
            setAiResponse(ana);
          })
          .catch((err) => {
            alert("KataGo error");
            console.log("> fetchAI error", err);
          });

        //AI stop generating
        setAIThinking(false);
        setAIReplyCountDown(0);
      } catch (err) {
        console.log("> fetchAI error", err);
      }
    };
    const fetchGenAI = async () => {
      // Narratives prompts
      setAIThinking(true);
      let _newScreenWriting;
      const screenWritingTemplate = `這是一場圍棋比賽，而你的任務就是轉譯，把棋盤上的局勢描述成歷史上的戰役

玩家的名稱是 ${player} 代表 ${playerColor} 方，對手是 AI 代表 ${aiColor} 方，由 ${whoFirst} 先手
黑子被吃掉的數量是 ${currentState?.blackStonesCaptured}，白子被吃掉的數量是 ${
        currentState?.whiteStonesCaptured
      }

${
  aiResponse
    ? `對手下在了 ${aiResponse.next_move_number_format} 位置
    即時分析的局勢是 ${aiResponse?.score_lead}
    勝率分別是黑：${aiResponse?.black_win_rate} 與白：${aiResponse?.white_win_rate}，
`
    : ""
}

目前的棋盤是 
${
  currentState?.intersections &&
  visualizeGoBoard(currentState?.intersections, currentState.boardSize)
}

${
  currentState?.playedPoint
    ? `玩家下在了 [${currentState?.playedPoint.x}, ${currentState?.playedPoint.y}] 的位置`
    : ""
}

戰役的部分是 ${battle.name}

黑方是 ${battle.black}，白方是 ${battle.white}

${
  screenWriting.length > 0 &&
  `先前有以下劇情
${screenWriting.map((s, index) => `${index}.${s.description}`).join("\n")}`
}

接下來請你使用圍棋的規則與想像力，把當前的戰況劇情描述出來，並提供該劇情場景所需的圖片提示詞，

description: 30字的英文
imgPrompt: 搭配劇情的生成圖片提示詞，請你搭配使用此基本風格 sketch style, black and white illustration, soft pencil lines, minimalist details, vintage look, beige background

另外就是圖片提示詞可能要注意安全政策(Safe Policy)，在不影響生成圖片的精彩度之下，避免一些過於細節暴力、血腥的場景

最後請你直接回應 JSON 格式的字串，例如下方

{
    description: ""
    imgPrompt: ""
}
`;
      console.log("> screenWritingTemplate", screenWritingTemplate);

      //Generate Narratives and image prompts
      await axios
        .post("/api/claude_call2", {
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
        .post("/api/openai_sprint", {
          type: "image",
          prompt: _newScreenWriting.imgPrompt,
        })
        .then((res) => {
          const img = res?.data?.data[0]?.url || battle.img;
          _newScreenWriting = {
            ..._newScreenWriting,
            img,
          };
        })
        .catch((err) => {
          _newScreenWriting = {
            ..._newScreenWriting,
            img: battle.img,
          };
          console.log("> ImageGenerating error", err);
        });

      //Update Narratives
      setScreenWriting([...screenWriting, _newScreenWriting]);

      //AI stop generating
      setAIGenerating(false);
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
  // Enforce auto-playing
  useEffect(() => {
    (async () => {
      if (parsed && moves) {
        await handleGetAIMove();
      }
    })();
  }, [moves, parsed]);
  // Get AI response，update board & judge win/lose
  useEffect(() => {
    if (
      aiResponse &&
      aiResponse?.next_move_number_format &&
      !aiResponse?.pass
    ) {
      console.log("> aiResponse", aiResponse);
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
      } else {
        console.error(`沒有找到坐標為 (${x}, ${y}) 的交叉點元素`);
      }
    } else if (aiResponse && aiResponse?.pass) {
      //AI judge end game
      setEndGameModalOpen(true);
    }
  }, [aiResponse]);

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
    console.log("> screenWriting", screenWriting);
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
        const endGameScreenWritingTemplate = `這是一場圍棋比賽，而你的任務就是轉譯，把棋盤上的局勢描述成歷史上的戰役

玩家的名稱是 ${player} 代表 ${playerColor} 方，對手是 AI 代表 ${aiColor} 方，由 ${whoFirst} 先手
黑子被吃掉的數量是 ${currentState?.blackStonesCaptured}，白子被吃掉的數量是 ${
          currentState?.whiteStonesCaptured
        }

${
  aiResponse
    ? `對手下在了 ${aiResponse.next_move_number_format} 位置
    即時分析的局勢是 ${aiResponse?.score_lead}
    勝率分別是黑：${aiResponse?.black_win_rate} 與白：${aiResponse?.white_win_rate}，
`
    : ""
}

目前的棋盤是 
${
  currentState?.intersections &&
  visualizeGoBoard(currentState?.intersections, currentState.boardSize)
}

${
  currentState?.playedPoint
    ? `玩家下在了 [${currentState?.playedPoint.x}, ${currentState?.playedPoint.y}] 的位置`
    : ""
}

戰役的部分是 ${battle.name}

黑方是 ${battle.black}，白方是 ${battle.white}

${
  screenWriting.length > 0 &&
  `先前有以下劇情
${screenWriting.map((s, index) => `${index}.${s.description}`).join("\n")}`
}

現在有人發動了棋盤的判決，玩家是 ${player}，代表 ${playerColor} 方，對手是 AI，代表 ${aiColor} 方，這場比賽將會結束

黑子的勝率是 ${aiResponse?.black_win_rate}，白子的勝率是 ${
          aiResponse?.white_win_rate
        }，目前的局勢是 ${aiResponse?.score_lead}
目前情勢是：${aiResponse?.score_lead}

請為這場比賽做結束的劇情描述與圖片生成提示詞

description: 30字的英文
imgPrompt: 搭配劇情的生成圖片提示詞，請你搭配使用此基本風格 sketch style, black and white illustration, soft pencil lines, minimalist details, vintage look, beige background

另外就是圖片提示詞可能要注意安全政策(Safe Policy)，在不影響生成圖片的精彩度之下，避免一些過於細節暴力、血腥的場景

最後請你直接回應 JSON 格式的字串，例如下方

{
    description: ""
    imgPrompt: ""
}
`;
        // Generate Narratives and image prompts
        await axios
          .post("/api/claude_call2", {
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
          .post("/api/openai_sprint", {
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

<<<<<<< HEAD
=======
  //styles
  const styles = {
    container: {
      display: "flex",
      width: "100vw",
      minHeight: "100vh",
      overflow: "hidden",
      alignItems: "stretch",
      border: "3px solid black",
      boxSize: "border-box",
    },
    leftColumn: {
      display: "flex",
      width: "100%",
      height: "calc(100vh - 6px)",
      borderRight: "3px solid rgba(55,55,55,1)",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column",
      boxSize: "border-box",
    },
    rightColumn: {
      width: "100%",
      height: "calc(100vh - 6px)",
      position: "relative",
    },
    leftTop: {
      overflow: "auto",
      boxSize: "border-box",
      padding: "8px 16px",
      minHeight: "88px",
    },
    leftBottom: {
      borderTop: "3px solid rgba(55,55,55,1)",
      boxSize: "border-box",
      position: "relative",
    },
  };

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    "name": "SWAPGO Game Page",
    "description": `Game session for ${player} in SWAPGO`,
    "url": `https://go.swap.work/SWAPGO/go?id=${battle?.id}&side=${side}&player=${player}&difficulty=${difficulty}&boardSize=${boardSize}`,
    "image": "https://go.swap.work/logo/swapgo_trans.png",
    "author": {
      "@type": "Organization",
      "name": "SwapGo",
      "url": "https://go.swap.work"
    }
  };

>>>>>>> d36991db5016997d3c49e2847f92a1ccc06f6efa
  return (
    <Layout>
       <Head>
        <title>{`${player}'s Game - SWAPGO`}</title>
        <meta name="description" content={`SwapGo Go game session for ${player} in SWAPGO`} />
        <link rel="canonical" href={`https://go.swap.work/SWAPGO/go?id=${battle?.id}&side=${side}&player=${player}&difficulty=${difficulty}&boardSize=${boardSize}`} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://go.swap.work/SWAPGO/go?id=${battle?.id}&side=${side}&player=${player}&difficulty=${difficulty}&boardSize=${boardSize}`} />
        <meta property="og:title" content={`${player}'s Game - SWAPGO`} />
        <meta property="og:description" content={`Go game session for ${player} in SWAPGO`} />
        <meta property="og:image" content="https://go.swap.work/logo/swapgo_trans.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://go.swap.work/SWAPGO/go?id=${battle?.id}&side=${side}&player=${player}&difficulty=${difficulty}&boardSize=${boardSize}`} />
        <meta property="twitter:title" content={`${player}'s Game - SWAPGO`} />
        <meta property="twitter:description" content={`Go game session for ${player} in SWAPGO`} />
        <meta property="twitter:image" content="https://go.swap.work/logo/swapgo_trans.png" />

        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
          />
      </Head>
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
<<<<<<< HEAD
            <div className="swap-go-container">
              <div className="leftColumn">
                <div className="leftTop">
=======
            <div style={styles.container} role="main">
              <div style={styles.leftColumn} aria-label="SwapGo Go Game Board and Controls">
                <div style={styles.leftTop}>
>>>>>>> d36991db5016997d3c49e2847f92a1ccc06f6efa
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      console.log("> All state", {
                        player,
                        side,
                        difficulty,
                        boardSize,
                        battle,
                        whoFirst,
                        currentState,
                        moves,
                        gameLog,
                        aiThinking,
                        aiGenerating,
                        aiResponse,
                        screenWriting,
                        aiReplyCountDown,
                        endGameModalOpen,
                      });
                    }}
                  >
                    <h1 style={{ fontSize: "1.5rem", fontStyle: "italic" }}
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
                            if (aiThinking || aiGenerating) {
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
<<<<<<< HEAD
                      <div key={item.img} style={{ marginTop: "16px" }}>
=======
                      <div
                        key={item.img}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <img
                          src={item.img}
                          alt={`${item.type} stone`}
                          style={{ width: "20px", height: "20px" }}
                        />
                        <i>
                          <b>{item.captured}</b>{" "}
                          {item.captured > 1 ? "stones" : "stone"}{" "}
                          {item.captured > 1 ? "were" : "was"} captured
                        </i>
                        ,{" "}
>>>>>>> d36991db5016997d3c49e2847f92a1ccc06f6efa
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
<<<<<<< HEAD
                <div className="leftBottom">
                  {/* 棋盤狀態 */}
=======
                <div style={styles.leftBottom} 
                      aria-label="Go board">
                  {/* board status */}
>>>>>>> d36991db5016997d3c49e2847f92a1ccc06f6efa
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
<<<<<<< HEAD
                  {/* 棋盤 */}
                  <div className="swap-go-board-container">
=======
                  {/* board */}
                  <div
                    style={{
                      width: `${boardWidth}px`,
                      height: `${boardWidth}px`,
                    }}
                  >
>>>>>>> d36991db5016997d3c49e2847f92a1ccc06f6efa
                    <div
                      className="tenuki-board swap-go-board"
                      data-include-coordinates={true}
                    />
                  </div>
                  {/* mask */}
                  {(aiThinking || aiGenerating) && (
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
<<<<<<< HEAD
              <div className="rightColumn">
=======
              <div style={styles.rightColumn}
                  aria-label="Game Narrative">
>>>>>>> d36991db5016997d3c49e2847f92a1ccc06f6efa
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
                        backgroundImage: `url(${item?.img}), linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('/swapgo/background.png')`,
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
  // deal with every alphabet after 'I' 
  if (col >= 8) {
    col = 8; // 跳過 'I'
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
// visualize board record
function visualizeGoBoard(intersections, size) {
  if (![9, 13, 19].includes(size)) {
    return "Invalid board size. Please use 9, 13, or 19.";
  }

  let board = "";
  const symbols = {
    empty: "⋅",
    black: "●",
    white: "○",
  };

  for (let y = 0; y < size; y++) {
    let row = "";
    for (let x = 0; x < size; x++) {
      const intersection = intersections.find((i) => i.x === x && i.y === y);
      row += symbols[intersection.value] + " ";
    }
    board += row.trim() + "\n";
  }

  return board;
}
// music element
export const YTMusic = () => {
  return (
    <div style={{ position: "absolute", zIndex: -9999, opacity: 0 }}>
      <ReactPlayer
        url={"https://www.youtube.com/watch?v=jZSquuCHVZA"}
        width={320}
        height={180}
        volume={1}
        playsinline={true}
        playing={true}
        loop={true}
        aria-label="Background Battlefield Music"
      />
    </div>
  );
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
