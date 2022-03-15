import React, { useEffect, useState } from "react";
import Reward, { RewardElement } from "react-rewards";
import { Character } from "../types";
import { getFlooredLevel } from "../util";
import "./RewardOverlay.css";

const RewardOverlay: React.FC<{ character: Character }> = ({ character }) => {
  const [prevFlooredLevel, setPrevFlooredLevel] = useState<number>(
    getFlooredLevel(character.level)
  );
  const [opacity, setOpacity] = useState<number>(0);
  const rewardRef = React.useRef<RewardElement>(null);

  const config = {
    fakingRequest: false,
    angle: 90,
    decay: 0.91,
    spread: 160,
    startVelocity: 25,
    elementCount: 15,
    elementSize: 50,
    lifetime: 200,
    zIndex: 10,
    springAnimation: true,
    rewardPunish: "reward",
    type: "emoji",
    emoji: ["⭐", "✨", "🔥", "🗡️"],
  };

  useEffect(() => {
    let newFlooredLevel = getFlooredLevel(character.level);
    if (newFlooredLevel > prevFlooredLevel) {
      setPrevFlooredLevel(newFlooredLevel);
      setOpacity(1);
      setTimeout(() => {
        rewardRef.current?.rewardMe();
      }, 500);
      setTimeout(() => {
        setOpacity(0);
      }, 4000);
    }
  }, [character]);

  return (
    <div
      style={{
        position: "absolute",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        flexDirection: "column",
        opacity: opacity,
        transition: "0.5s all ease",
        background:
          "radial-gradient(circle, rgba(57,56,9,0.6965161064425771) 0%, rgba(255,255,255,0) 53%, rgba(255,255,255,0) 100%)",
      }}
    >
      <div
        style={{
          pointerEvents: "none",

          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: -60, pointerEvents: "none" }}>
          <Reward ref={rewardRef} type={"emoji"} config={config} />
        </div>
      </div>
      <h1 id="goldText">LEVEL UP</h1>
      <p style={{ fontSize: 32, color: "gold", margin: 0 }}>
        You are now level {Math.floor(character.level) + 1}
      </p>
    </div>
  );
};

export default RewardOverlay;
