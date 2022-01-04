import React from "react";
import { panelStyle } from "../constants";
import { Proficiencies, Character } from "../types";
import profilePic from "../images/profilePic.png";
import EditableText from "./EditableText";

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
            Level: {Math.floor(characterDisplayProps.character.level) + 1}
          </p>
          <p style={{ margin: 0 }}>
            Level: {Math.floor(characterDisplayProps.character.level) + 1}
          </p>
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
