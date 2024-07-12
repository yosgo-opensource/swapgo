import { Button, Input, Radio, Spacer } from "@geist-ui/core";
import { Fade } from "@mui/material";
import { useEffect, useState } from "react";

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
      `}</style>
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
              src="/swapgo/board2-removebg.png"
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

export const battlesData = [
  {
    id: 1,
    name: "関ヶ原の戦い",
    description:
      "The Battle of Sekigahara was a decisive battle on October 21, 1600 that preceded the establishment of the Tokugawa shogunate.",
    open: true,
    white: "Eastern Army",
    black: "Western Army",
    img: "/swapgo/関ヶ原の戦い-batter-img.png",
    music: "/swapgo/aoe-japanese.mp3",
    loadingHints: [
      "This battle was fought in a valley surrounded by mountains.",
      "This Battle that ended the Sengoku period and unified Japan.",
      "The Eastern Army was led by Tokugawa Ieyasu.",
      "The Western Army was led by Ishida Mitsunari.",
      "This battle was fought in the fog.",
      "The Western Army had a numerical advantage.",
      "The Eastern Army had a tactical advantage.",
    ],
  },
  {
    id: 2,
    name: "D-Day",
    description:
      "The Normandy landings were the landing operations on Tuesday, 6 June 1944 of the Allied invasion of Normandy in Operation Overlord during World War II.",
    open: true,
    white: "Allies Forces",
    black: "Axis Powers",
    img: "/swapgo/dday-battle-img.png",
    music: "/swapgo/dday.mp3",
    loadingHints: [
      "This battle was fought on the beaches of Normandy.",
      "This battle was the largest seaborne invasion in history.",
      "The Allies landed on five beaches.",
      "The Axis Powers were caught off guard.",
      "The Allies had air superiority.",
      "The Axis Powers had the advantage of fortifications.",
      "The Allies had numerical superiority.",
    ],
  },
  {
    id: 3,
    name: "Dune",
    description:
      "The Battle of Arrakeen was a battle fought between the forces of House Atreides and House Harkonnen.",
    open: true,
    white: "House Atreides",
    black: "House Harkonnen",
    img: "/swapgo/dune-battle-img.png",
    music: "/swapgo/dune.mp3",
    loadingHints: [
      "This battle was fought in the desert.",
      "This battle was fought over the spice melange.",
      "House Atreides had the support of the Fremen.",
      "House Harkonnen had the Sardaukar.",
      "The battle was fought over control of Arrakis.",
      "The spice melange was the most valuable substance in the universe.",
      "The Fremen were the native people of Arrakis.",
    ],
  },
];

export const Layout = ({ children }) => {
  return (
    <Fade in={true}>
      <div
        style={{
          minHeight: "100vh",
          gap: "6vw",
          background: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('/swapgo/background.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {children}
      </div>
    </Fade>
  );
};
