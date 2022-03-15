import React from "react";
import { panelStyle } from "../constants";
import { Proficiencies, Character } from "../types";
import profilePic from "../images/profilePic.png";
import EditableText from "./EditableText";
import { getFlooredLevel } from "../util";

interface CharacterDisplayProps {
  character: Character;
  editCharacter: (editedValues: object) => void;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = (
  characterDisplayProps: CharacterDisplayProps
) => {
  const onSetName = (newName: string) => {
    characterDisplayProps.editCharacter({ name: newName });
  };
  let expWidth: number =
    (characterDisplayProps.character.level -
      Math.floor(characterDisplayProps.character.level)) *
    100;

  if (expWidth >= 99.9) {
    expWidth = 0;
  }

  return (
    <div style={{ ...panelStyle }}>
      <div style={{ display: "flex", marginBottom: 4 }}>
        <img
          src={profilePic}
          alt=""
          style={{ width: 70, height: 70, borderRadius: 12 }}
        />
        <div style={{ marginLeft: 6 }}>
          <EditableText
            style={{ fontSize: 22, fontWeight: "bold" }}
            blurCallback={onSetName}
            defaultValue={characterDisplayProps.character.name}
          />
          <p style={{ margin: 0 }}>
            Level: {getFlooredLevel(characterDisplayProps.character.level)}
          </p>
          <div style={{ margin: 0, display: "flex" }}>
            <div>Exp:</div>
            <div
              style={{
                background: "lightgrey",
                borderRadius: 4,
                width: "100%",
                overflow: "hidden",
                marginLeft: 4,
              }}
            >
              <div
                style={{
                  height: 20,
                  background:
                    "linear-gradient(80deg, rgba(199,206,65,1) 0%, rgba(231,232,163,1) 50%, rgba(199,206,65,1) 100%)",
                  boxShadow: "-10px 0px 10px rgba(204, 173, 20, 0.7) inset",
                  width: expWidth + "%",
                  transition: "all 1s ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          width: "100%",
          gridTemplateColumns: "30% 30% 30%",
          gap: 6,
        }}
      >
        {Object.values(characterDisplayProps.character.proficiencies).map(
          (proficiency: Proficiencies, index: number) => {
            return (
              <div
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  display: "inline-grid",
                  background: "antiquewhite",
                  opacity: 0.7,
                  padding: 4,
                  borderRadius: 8,
                }}
              >
                {Proficiencies[index]}: <br />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {proficiency}
                </span>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default CharacterDisplay;
