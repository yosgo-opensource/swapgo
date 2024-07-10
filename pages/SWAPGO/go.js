import React from "react";
import { useEffect, useState } from "react";
import { Layout, battlesData } from "./start";
import { Fade } from "@mui/material";
import axios from "axios";
import ReactPlayer from "react-player";
import ReactTyped from "react-typed";

const GO = () => {
  // 網址參數
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

  //解析網址參數
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

  //初始化棋盤
  useEffect(() => {
    if (parsed) {
      // 清空
      document.querySelector(".tenuki-board").innerHTML = "";

      // 新的棋盘 github.com/aprescott/tenuki
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
        // 設定 state
        let _game = game.currentState();
        setCurrentState(_game);
      };
    }
  }, [parsed]);

  //自行記錄 moves 歷史，以供 API 使用
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

  //更新 Log
  const handleAddGameLog = (string) => {
    setGameLog([...gameLog, string]);
  };
  //函式發送棋譜給 AI
  const handleGetAIMove = async () => {
    //整理棋譜
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
    payload = `[${payload.join(",")}]`; //給 API 看的棋譜

    //常數
    const playerColor = side === "1" ? "black" : "white";
    const aiColor = side === "1" ? "white" : "black";
    const lastColor = moves[moves.length - 1]?.color;
    const waitForAIString = "AI is thinking... 🤔";
    const waitForPlayerString = `It's your turn 『${player}』`;

    //API 請求
    const fetchAI = async () => {
      setAIThinking(true);
      try {
        //劇本提示詞
        let _newScreenWriting;
        const screenWritingTemplate = `這是一場圍棋比賽，而你的任務就是轉譯，把棋盤上的局勢描述成歷史上的戰役

玩家的名稱是 ${player} 代表 ${playerColor} 方，對手是 AI 代表 ${aiColor} 方，由 ${whoFirst} 先手

${
  aiResponse
    ? `對手下在了 ${aiResponse.next_move_number_format} 位置，目前的局勢是 ${aiResponse?.score_lead}，勝率分別是黑：${aiResponse?.black_win_rate} 與白：${aiResponse?.white_win_rate}，`
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

        //生成劇本與圖片提示詞
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

        //生成圖片
        await axios
          .post("/api/openai_sprint", {
            type: "image",
            prompt: _newScreenWriting.imgPrompt,
          })
          .then((res) => {
            const img = res.data.data[0].url;
            _newScreenWriting = {
              ..._newScreenWriting,
              img,
            };
          })
          .catch((err) => {
            alert("> ImageGenerating error");
          });

        //更新劇情
        setScreenWriting([...screenWriting, _newScreenWriting]);

        //取得 AI 棋盤回應
        await axios
          .post(`https://swapgo.yosgo.com/ana`, {
            moves: payload,
          })
          .then((res) => {
            let ana = res.data;
            let pass = `${ana.next_move}`.indexOf("pass") !== -1;
            //依照難度計算下一步的數字格式
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

        //AI 結束思考
        setAIThinking(false);
      } catch (err) {
        console.log("> fetchAI error", err);
      }
    };

    //下棋順序判斷
    if (moves.length === 0) {
      if (playerColor === "black") {
        handleAddGameLog(waitForPlayerString);
      } else {
        handleAddGameLog(waitForAIString);
        await fetchAI();
      }
    } else {
      if (playerColor !== lastColor) {
        handleAddGameLog(waitForPlayerString);
      } else {
        handleAddGameLog(waitForAIString);
        await fetchAI();
      }
    }
  };
  //執行自動下棋
  useEffect(() => {
    (async () => {
      if (parsed && moves) {
        await handleGetAIMove();
      }
    })();
  }, [moves, parsed]);
  //取得 AI 回應，更新棋盤、判斷勝負
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
      alert(
        `Game Over. ${aiResponse.score_lead}. 
          
Black: ${aiResponse.black_win_rate}

White: ${aiResponse.white_win_rate}`
      );
    }
  }, [aiResponse]);

  //監聽劇情
  useEffect(() => {
    console.log("> screenWriting", screenWriting);
  }, [screenWriting]);

  //樣式
  const styles = {
    container: {
      display: "flex",
      width: "100vw",
      minHeight: "100vh",
      overflow: "hidden",
      alignItems: "stretch",
      border: "3px solid rgba(55,55,55,1)",
      boxSize: "border-box",
    },
    leftColumn: {
      display: "flex",
      flexDirection: "column",
      width: "50%",
      height: "calc(100vh - 6px)",
      borderRight: "3px solid rgba(55,55,55,1)",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column",
      boxSize: "border-box",
    },
    rightColumn: {
      width: "50%",
      height: "calc(100vh - 6px)",
      position: "relative",
    },
    leftTop: {
      overflow: "auto",
      boxSize: "border-box",
      padding: "8px 16px",
    },
    leftBottom: {
      borderTop: "3px solid rgba(55,55,55,1)",
      boxSize: "border-box",
      position: "relative",
    },
  };

  return (
    <Layout>
      <style jsx>
        {`
          .swap-go-board {
            width: calc(50vw - 6px) !important;
            height: calc(50vw - 6px) !important;
          }
        `}
      </style>
      {parsed && (
        <Fade in={parsed}>
          <div style={styles.container}>
            <div style={styles.leftColumn}>
              <div style={styles.leftTop}>
                <div
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
                      aiResponse,
                      screenWriting,
                    });
                  }}
                >
                  <h1 style={{ fontSize: "2rem", fontStyle: "italic" }}>
                    {battle.name}
                  </h1>
                  <YTMusic />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                  }}
                >
                  {[
                    {
                      label: battle.black,
                      type: "black",
                      img: "/swapgo/black.png",
                      value: "1",
                    },
                    {
                      label: battle.white,
                      type: "white",
                      img: "/swapgo/white.png",
                      value: "-1",
                    },
                  ].map((item) => (
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
                        style={{ width: "20px", height: "20px" }}
                      />
                      <i>
                        {item.label}(
                        {side === item.value ? ` You, ${player}` : " AI"})
                      </i>
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.leftBottom}>
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
                        Round {currentState?.moveNumber}.{" "}
                        {gameLog[gameLog.length - 1]}
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
                      height: "100%",
                      fontSize: "12px",
                      transition: "width 1s",
                    }}
                  ></div>
                  <div
                    style={{
                      zIndex: 1,
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "white",
                      width: aiResponse ? aiResponse?.white_win_rate : "50%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      transition: "width 1s",
                    }}
                  >
                    <span
                      style={{
                        position: "relative",
                        zIndex: 999,
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
                <div
                  className="tenuki-board swap-go-board"
                  data-include-coordinates={true}
                />
                {/* 遮罩 */}
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
            <div style={styles.rightColumn}>
              {screenWriting.map((item, index) => {
                const randomRotate = Math.random() * 3 + 1;
                return (
                  <div
                    key={`screenWriting-${index}`}
                    style={{
                      zIndex: index,
                      position: "absolute",
                      height: "95%",
                      width: "95%",
                      top: "2.5%",
                      left: "2.5%",
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
                      transform: `rotate(${
                        index === 0 ? "0" : randomRotate
                      }deg)`,
                      transition: "transform 0.5s",
                    }}
                  >
                    <div
                      style={{
                        padding: "16px",
                        fontSize: "14px",
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
        </Fade>
      )}
    </Layout>
  );
};

export default GO;

/** 輔助函式 */
//
function convertArrayIndexToGoPosition(row, col, boardSize = 9) {
  const actualRow = boardSize - 1 - row;
  return [actualRow, col];
}
//轉成英文座標
function convertMove(moveStr) {
  let col = moveStr.charCodeAt(0) - "A".charCodeAt(0);
  const row = 9 - parseInt(moveStr[1]);
  // 處理 'I' 之後的字母
  if (col >= 8) {
    col = 8; // 跳過 'I'
  }
  return [col, row];
}
//棋譜紀錄
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
//棋譜圖像化
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
//音樂元件
const YTMusic = () => {
  return (
    <div style={{ position: "absolute", zIndex: -9999 }}>
      <ReactPlayer
        url={
          "https://www.youtube.com/playlist?list=PLh4Eme5gACZFflgnk-qzmDGWroz2EIqi8"
        }
        width={320}
        height={180}
        volume={1}
        playsinline={true}
        playing={true}
        onPlay={(state) => {
          console.log(state);
        }}
      />
    </div>
  );
};

/**
 * 1. 可以選難度、黑白方
 * 2. 下棋 Log、搭配戰役劇情文案、一黑一白搭配一張圖片
 * 3. 依據勝率調整爭鬥 bar
 * 4. 增加音樂
 * 語言轉換
 * 計時、數值
 * 主動投降，計算
 * 語音朗讀
 * 版權聲明
 * Onboarding
 * Export 功能
 */
