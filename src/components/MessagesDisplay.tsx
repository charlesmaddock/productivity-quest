import React from "react";
import { panelStyle } from "../constants";

interface MessagesDisplayProps {}

const MessagesDisplay: React.FC<MessagesDisplayProps> = (
  pomodoroDisplayProps: MessagesDisplayProps
) => {
  return (
    <div style={{ ...panelStyle }}>
      <h2 style={{ margin: 0 }}>Messages</h2>
    </div>
  );
};

export default MessagesDisplay;
