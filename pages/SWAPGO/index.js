import { Button, Input, Radio, Spacer } from "@geist-ui/core";
import { Fade } from "@mui/material";
import { useEffect, useState } from "react";
import ServerStatusIndicator from "../../components/ServerStatusIndicator";
import Layout from "../../components/Layout";
import battlesData from "../../components/battlesData";

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: "/SWAPGO/start",
      permanent: true,
    },
  }
}

const StartGame = () => {
  const [selectedBattle, setSelectedBattle] = useState(2);
  const [side, setSide] = useState(1); //-1 white 1 black
  const [playerName, setPlayerName] = useState("SwapGo Player 1");
  const [difficulty, setDifficulty] = useState(2);
  const [boardSize, setBoardSize] = useState(9); // [9, 13, 19

  const [currentMusic, setCurrentMusic] = useState(null);

  useEffect(() => {
    if (currentMusic) {
      const audio = new Audio(currentMusic);
      audio.loop = true;
      audio.play();
      return () => {
        audio.pause();
      };
    }
  }, [currentMusic]);

  return (
    <div>
      <ServerStatusIndicator position="left" />
      <style jsx>{`
        .side-options {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .hint-text {
          font-size: 1rem;
          color: gray;
          animation: flashAndFloat 1.5s ease-in-out infinite;
          display: inline-block;
          position: relative;
          font-style: italic;
          font-weight: bold;
          margin-bottom: 8px;
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
      `}
      </style>
      <button
        style={{
          position: "absolute",
          padding: 10,
          right: 0,
          fontSize: "14px",
        }}
        onClick={() => {
          setCurrentMusic(
            currentMusic
              ? null
              : battlesData.find((b) => b.id === selectedBattle)?.music ||
                  battlesData[0].music
          );
        }}
      >
        <i>
          {currentMusic ? "🔈" : "🔇"} Turn {currentMusic ? "Off" : "On"}
        </i>
      </button>
      <Layout>
        <Spacer h={"40px"} />
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "40px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <img
              src="/swapgo/board2-removeBg.png"
              style={{
                width: "120px",
                height: "120px",
                display: "block",
                objectFit: "cover",
                margin: "0 auto",
              }}
            />
            <h1 style={{ fontSize: "4.2rem", fontStyle: "italic" }}>SwapGo</h1>
          </div>
          <p
            style={{
              fontSize: "1.2rem",
              fontStyle: "italic",
            }}
          >
            Every game of SwapGo is a journey through time; each move, a pivotal
            moment in history rewritten.
          </p>
          <div>
            {selectedBattle === 0 && (
              <h3 className="hint-text">⬇︎ Please select a battle ⬇︎</h3>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${battlesData.length}, 1fr)`,
                gap: "16px",
              }}
            >
              {battlesData.map((battle) => (
                <div
                  className="battle-card"
                  key={battle.id}
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
                  }}
                  onClick={() => {
                    if (battle.open) {
                      setSelectedBattle(battle.id);
                      setCurrentMusic(battle.music);
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
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      fontSize: "14px",
                    }}
                  >
                    {battle.description}
                  </p>
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
                        battlesData.find((b) => b.id === selectedBattle)?.black
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
                        battlesData.find((b) => b.id === selectedBattle)?.white
                      }`
                    : ""}
                </i>
              </div>
            </div>
          </div>
          {/* difficulty */}
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
        </div>
      </Layout>
    </div>
  );
};

export default StartGame;