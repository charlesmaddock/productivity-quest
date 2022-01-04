import React, { useEffect, useState } from "react";
import { panelStyle } from "../constants";
import { getStoredHoursWorked, storeHoursWorked } from "../util";

interface PomodoroDisplayProps {}

type TimerState = "work" | "short break";

const PomodoroDisplay: React.FC<PomodoroDisplayProps> = (
  pomodoroDisplayProps: PomodoroDisplayProps
) => {
  const [timerState, setTimerState] = useState<TimerState>("work");
  const [workTime] = useState(1000 * 60 * 25);
  const [shortBreakTime] = useState(1000 * 60 * 5);

  const [totalWorkTime, setTotalWorkTime] = useState(getStoredHoursWorked());
  const [countingTotalWorkTime, setCountingTotalWorkTime] = useState(false);

  const [timeLeftText, setTimeLeftText] = useState("00:00:00");
  const [timerStatus, setTimerStatus] = useState("Welcome back!");
  const [finishTime, setFinishTime] = useState(0);
  const [countdownOver, setCountdownOver] = useState(true);

  const breakOverAudio = new Audio("/frozen.wav");
  const clickAudio = new Audio("/click.wav");
  const workOverAudio = new Audio("/sneakyTree.wav");

  useEffect(() => {
    const interval = setInterval(() => {
      if (countingTotalWorkTime === true) {
        setTotalWorkTime(totalWorkTime + 1000);
      }

      var distance = finishTime - new Date().getTime();
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      // If the count down is finished, write some text
      if (distance <= 0 && countdownOver === false) {
        handleTimeout();
        setTimeLeftText("00:00:00");
      } else if (distance > 0) {
        setTimeLeftText(
          String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0")
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [finishTime, countdownOver, totalWorkTime, countingTotalWorkTime]);

  const handleClearTotalWorkTime = () => {
    let result: boolean = window.confirm(
      "Are you sure you want to clear the amount of hours you have worked?"
    );
    if (result === true) {
      setTotalWorkTime(0);
    }
  };

  const handleStartStopTimerClicked = () => {
    setCountingTotalWorkTime(!countingTotalWorkTime);
    storeHoursWorked(totalWorkTime);
  };

  const startWorking = () => {
    setCountdownOver(false);
    setCountingTotalWorkTime(true);
    setTimerStatus("Working...");
    clickAudio.play();
    setFinishTime(new Date().getTime() + workTime);
    setTimerState("work");
  };

  const startBreak = () => {
    setCountdownOver(false);
    setCountingTotalWorkTime(true);
    setTimerStatus("Taking a break...");
    clickAudio.play();
    setFinishTime(new Date().getTime() + shortBreakTime);
    setTimerState("short break");
  };

  const stopPomodoro = () => {
    clickAudio.play();
    setCountdownOver(true);
    setFinishTime(new Date().getTime());
    setTimeLeftText("00:00:00");
    setTimerStatus("Timer stopped.");
  };

  const handleTimeout = () => {
    setCountdownOver(true);
    storeHoursWorked(totalWorkTime);
    setTimerState(timerState === "work" ? "short break" : "work");
    if (timerState === "work") {
      setTimerStatus("Time for a break!");
      workOverAudio.play();
    } else if (timerState === "short break") {
      setTimerStatus("Time to work.");
      breakOverAudio.play();
    }
  };

  return (
    <div style={{ ...panelStyle }}>
      <p style={{ margin: 0 }}>Pomodoro Timer</p>
      <h2 style={{ margin: "6px 0 0 0", textAlign: "center" }}>
        {timeLeftText}
      </h2>
      <p
        style={{
          margin: "0 0 6px 0",
          textAlign: "center",
          fontSize: 12,
          opacity: 0.8,
        }}
      >
        {timerStatus}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={{ width: "32%" }} onClick={() => startWorking()}>
          Work
        </button>
        <button style={{ width: "32%" }} onClick={() => startBreak()}>
          Break
        </button>
        <button style={{ width: "32%" }} onClick={() => stopPomodoro()}>
          Stop
        </button>
      </div>
      <div
        style={{
          width: "97%",
          height: 1,
          margin: "16px 0",
          background: "rgba(0,0,0,0.3)",
        }}
      />
      <p style={{ margin: "0 0 6px 0" }}>
        Hours' worked:{" "}
        {Math.round((totalWorkTime / (1000 * 60 * 60)) * 10000) / 10000}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          style={{ width: "48%" }}
          onClick={() => handleStartStopTimerClicked()}
        >
          {countingTotalWorkTime ? "Stop Counting" : "Start Counting"}
        </button>
        <button
          style={{ width: "48%" }}
          onClick={() => handleClearTotalWorkTime()}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default PomodoroDisplay;
