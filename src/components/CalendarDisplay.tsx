import React from "react";
import { panelStyle } from "../constants";

interface CalendarDisplayProps {}

const CalendarDisplay: React.FC<CalendarDisplayProps> = (
  pomodoroDisplayProps: CalendarDisplayProps
) => {
  return (
    <div style={{ ...panelStyle }}>
      <h2 style={{ margin: 0 }}>Calendar</h2>
    </div>
  );
};

export default CalendarDisplay;
