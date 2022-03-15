import React, { useEffect, useState } from "react";
import { Checkboxes, CheckboxObject, Proficiencies, Quest } from "../types";
import { buttonStyle, lightBrown, panelStyle } from "../constants";
import moment from "moment";
import EditableText from "./EditableText";
import { generateId } from "../util";

interface QuestLogDisplayProps {
  title: string;
  quests: Array<Quest>;
  createNewQuest: (questLogTitle: string, quest: Quest) => void;
  completeQuest: (questLogTitle: string, quest: Quest) => void;
  failedQuest: (questLogTitle: string, quest: Quest) => void;
  editQuest: (questLogTitle: string, quest: Quest) => void;
}

const QuestLogDisplay: React.FC<QuestLogDisplayProps> = (
  questLogProps: QuestLogDisplayProps
) => {
  const createEmptyQuest = () => {
    let newQuest: Quest = {
      id: generateId(),
      expMultiplier: 1,
      isBeingCreated: true,
      objective: "",
      checkboxes: [],
      expires: new Date().getTime(),
      repeatDaily: false,
      repeatWeekly: false,
      repeatYearly: false,
      proficiency: -1,
      streak: 0,
    };
    questLogProps.createNewQuest(questLogProps.title, newQuest);
  };

  return (
    <div style={{ flex: 1 }}>
      <div style={{ padding: 8, ...panelStyle }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>{questLogProps.title}</h2>

          <button
            onClick={() => createEmptyQuest()}
            style={{ width: 64, ...buttonStyle }}
          >
            + New
          </button>
        </div>
        <div>
          {questLogProps.quests.map((quest: Quest, index: number) => {
            return (
              <div key={index}>
                <QuestDisplay
                  quest={quest}
                  questLogTitle={questLogProps.title}
                  completeQuest={questLogProps.completeQuest}
                  failedQuest={questLogProps.failedQuest}
                  editQuest={questLogProps.editQuest}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface CheckBoxDisplayProps {
  checkBoxes: Checkboxes;
  updateCheckBoxes: (changedValues: Checkboxes) => void;
}

const CheckBoxDisplay: React.FC<CheckBoxDisplayProps> = ({
  checkBoxes,
  updateCheckBoxes,
}) => {
  const onCheckBoxChanged = (text: string, isDone: boolean, index: number) => {
    let newCheckBoxes = JSON.parse(JSON.stringify(checkBoxes));
    let newCheckBoxObj: CheckboxObject = { text: text, done: isDone };
    newCheckBoxes[index] = newCheckBoxObj;
    updateCheckBoxes(newCheckBoxes);
  };

  return (
    <div style={{ margin: 4 }}>
      {checkBoxes.map((checkboxObject: CheckboxObject, index: number) => {
        return (
          <div key={index} style={{ display: "flex" }}>
            <span>
              <input
                type="checkbox"
                checked={checkboxObject.done}
                onChange={(e) => {
                  onCheckBoxChanged(
                    checkboxObject.text,
                    e.target.checked,
                    index
                  );
                }}
              />
            </span>
            <EditableText
              blurCallback={(newText) =>
                onCheckBoxChanged(newText, checkboxObject.done, index)
              }
              style={{ fontSize: 14, opacity: 0.7 }}
              defaultValue={checkboxObject.text}
            />
          </div>
        );
      })}
    </div>
  );
};

interface QuestDisplayProps {
  quest: Quest;
  questLogTitle: string;
  completeQuest: (questLogTitle: string, quest: Quest) => void;
  failedQuest: (questLogTitle: string, quest: Quest) => void;
  editQuest: (questLogTitle: string, quest: Quest) => void;
}

const QuestDisplay: React.FC<QuestDisplayProps> = ({
  quest,
  questLogTitle,
  completeQuest,
  failedQuest,
  editQuest,
}: QuestDisplayProps) => {
  const [editingQuest, setEditingQuest] = useState(quest.isBeingCreated);

  const updateCheckBoxes = (newCheckBoxes: Checkboxes) => {
    let editedQuest: Quest = {
      ...quest,
      checkboxes: newCheckBoxes,
    };
    editQuest(questLogTitle, editedQuest);
  };

  const handleObjectiveChanged = (newObj: string) => {
    let editedQuest: Quest = {
      ...quest,
      objective: newObj,
    };
    editQuest(questLogTitle, editedQuest);
  };

  return (
    <>
      {quest.isBeingCreated || editingQuest ? (
        <EditQuestDisplay
          quest={quest}
          editQuest={editQuest}
          updateCheckBoxes={updateCheckBoxes}
          questLogTitle={questLogTitle}
          setEditingQuest={setEditingQuest}
        />
      ) : (
        <div
          style={{
            margin: "4px 0",
            padding: 6,
            borderRadius: 12,
            background: lightBrown,
            display: "flex",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: 0 }}>{quest.objective}</p>
              {quest.streak !== 0 && (
                <p style={{ margin: 0, marginRight: 4 }}>
                  <span>🔥</span>
                  {quest.streak}
                </p>
              )}
            </div>
            <CheckBoxDisplay
              updateCheckBoxes={updateCheckBoxes}
              checkBoxes={quest.checkboxes}
            />
            <div style={{ display: "flex" }}>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: 12,
                }}
              >
                {Proficiencies[quest.proficiency] === undefined
                  ? ""
                  : Proficiencies[quest.proficiency].substr(0, 3)}
              </p>
              <p style={{ fontSize: 12, opacity: 0.4, margin: 5 }}>{" * "}</p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: 12,
                  color:
                    new Date().getTime() > quest.expires ? "FireBrick" : "grey",
                }}
              >
                {moment(new Date(quest.expires)).fromNow()}
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 20,
            }}
          >
            <button
              style={{
                background: "lightgreen",
                border: "none",
                height: 20,
                color: "white",
                cursor: "pointer",
                margin: "2px 0",
              }}
              onClick={() => completeQuest(questLogTitle, quest)}
            >
              ✓
            </button>
            <button
              style={{
                background: "FireBrick",
                border: "none",
                height: 20,
                color: "white",
                cursor: "pointer",
                margin: "2px 0",
              }}
              onClick={() => failedQuest(questLogTitle, quest)}
            >
              x
            </button>
            <button
              style={{
                background: "lightgrey",
                border: "none",
                height: 20,
                color: "white",
                cursor: "pointer",
                margin: "2px 0",
              }}
              onClick={() => setEditingQuest(true)}
            >
              <span style={{ marginTop: -5, marginLeft: -4 }}>⚙</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

interface EditQuestDisplayProps {
  editQuest: (questLogTitle: string, newQuest: Quest) => void;
  setEditingQuest: (val: boolean) => void;
  updateCheckBoxes: (newCheckBoxes: Checkboxes) => void;
  questLogTitle: string;
  quest: Quest;
}

const EditQuestDisplay: React.FC<EditQuestDisplayProps> = ({
  editQuest,
  setEditingQuest,
  updateCheckBoxes,
  questLogTitle,
  quest,
}: EditQuestDisplayProps) => {
  let tzOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
  let expireDate = new Date(quest.expires - tzOffsetMs);
  const questIsoDate = expireDate.toISOString().split("T")[0];
  const questIsoTime = expireDate.toISOString().split("T")[1].substring(0, 5);

  const [newQuestObjective, setNewQuestObjective] = useState(quest.objective);
  const [newQuestCheckboxes, setNewQuestCheckboxes] = useState<Checkboxes>(
    quest.checkboxes
  );
  const [currentCheckboxText, setCurrentCheckboxText] = useState("");
  const [newQuestExpireDate, setNewQuestExpireDate] = useState(questIsoDate);
  const [newQuestExpireTime, setNewQuestExpireTime] = useState(questIsoTime);
  const [repeatDaily, setRepeatDaily] = useState(quest.repeatDaily);
  const [repeatWeekly, setRepeatWeekly] = useState(quest.repeatWeekly);
  const [repeatYearly, setRepeatYearly] = useState(quest.repeatYearly);
  const [expMultiplier, setExpMultiplier] = useState(quest.expMultiplier);
  const [newQuestProficiency, setNewQuestProficiency] = useState(
    quest.proficiency
  );

  const handleEditQuest = () => {
    var checkboxes = JSON.parse(JSON.stringify(newQuestCheckboxes));
    if (currentCheckboxText !== "") {
      let newCheckBoxObj: CheckboxObject = {
        text: currentCheckboxText,
        done: false,
      };
      checkboxes.push(newCheckBoxObj);
    }

    console.log("repeatDaily: ", repeatDaily);
    let expireTime =
      new Date(
        `${newQuestExpireDate}T${newQuestExpireTime}:00.000Z`
      ).getTime() + tzOffsetMs;
    let editedQuest: Quest = {
      id: quest.id,
      expMultiplier: expMultiplier,
      isBeingCreated: false,
      objective: newQuestObjective,
      checkboxes: checkboxes,
      expires: expireTime,
      repeatDaily,
      repeatWeekly,
      repeatYearly,
      proficiency: newQuestProficiency,
      streak: quest.streak,
    };
    editQuest(questLogTitle, editedQuest);
    setEditingQuest(false);
  };

  const handleEnterCheckbox = (event: any) => {
    if (event.key === "Enter") {
      appendCheckBox();
    }
  };

  const appendCheckBox = () => {
    let newCheckBoxObj: CheckboxObject = {
      text: currentCheckboxText,
      done: false,
    };
    setCurrentCheckboxText("");
    setNewQuestCheckboxes([...newQuestCheckboxes, newCheckBoxObj]);
  };

  return (
    <div
      style={{
        margin: "2px 0",
        padding: 6,
        borderRadius: 12,
        background: lightBrown,
      }}
    >
      <input
        style={{ width: "95%" }}
        placeholder="Objective"
        value={newQuestObjective}
        onChange={(e) => {
          setNewQuestObjective(e.target.value);
        }}
      />
      <input
        style={{ width: "95%" }}
        placeholder="Add checkbox"
        onChange={(e) => {
          setCurrentCheckboxText(e.target.value);
        }}
        value={currentCheckboxText}
        onKeyDown={handleEnterCheckbox}
      />

      <CheckBoxDisplay
        updateCheckBoxes={updateCheckBoxes}
        checkBoxes={newQuestCheckboxes}
      />
      <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: 12, marginRight: 6 }}>
          Exp multiplier:
        </p>
        <input
          type="number"
          value={expMultiplier}
          style={{ width: 40 }}
          onChange={(e) => {
            setExpMultiplier(Number(e.target.value));
          }}
        />
      </div>

      <input
        placeholder="Expires"
        type="date"
        value={newQuestExpireDate}
        onChange={(e) => {
          setNewQuestExpireDate(e.target.value);
        }}
      />
      <input
        type="time"
        value={newQuestExpireTime}
        onChange={(e) => {
          setNewQuestExpireTime(e.target.value);
        }}
      />
      <br />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <RepeatCheckbox
          text="Daily"
          toggle={setRepeatDaily}
          val={repeatDaily}
        />
        <RepeatCheckbox
          text="Weekly"
          toggle={setRepeatWeekly}
          val={repeatWeekly}
        />
        <RepeatCheckbox
          text="Yearly"
          toggle={setRepeatYearly}
          val={repeatYearly}
        />
      </div>
      <ProficiencySelector
        newQuestProficiency={newQuestProficiency}
        setNewQuestProficiency={setNewQuestProficiency}
      />
      <button
        onClick={() => handleEditQuest()}
        style={{
          ...buttonStyle,
          background: "brown",
          color: "white",
          fontWeight: 600,
          margin: 0,
        }}
      >
        {quest.isBeingCreated ? "Create" : "Update"}
      </button>
    </div>
  );
};

interface ProficiencySelectorProps {
  newQuestProficiency: number;
  setNewQuestProficiency: (val: number) => void;
}

const ProficiencySelector: React.FC<ProficiencySelectorProps> = ({
  newQuestProficiency,
  setNewQuestProficiency,
}: ProficiencySelectorProps) => {
  return (
    <div style={{ display: "flex" }}>
      {Object.values(Proficiencies).map((proficiency) => {
        var castedProficiency: Proficiencies = Number(proficiency);
        if (isNaN(castedProficiency) === false) {
          return (
            <div>
              <input
                type="checkbox"
                checked={proficiency === newQuestProficiency}
                onChange={(e) => setNewQuestProficiency(castedProficiency)}
              />
              <label style={{ fontSize: 13 }}>
                {Proficiencies[castedProficiency].substr(0, 3)}
              </label>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

interface RepeatCheckboxProps {
  text: string;
  toggle: (val: boolean) => void;
  val: boolean;
}

const RepeatCheckbox: React.FC<RepeatCheckboxProps> = ({
  text,
  toggle,
  val,
}: RepeatCheckboxProps) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={val}
        onChange={(e) => toggle(e.target.checked)}
      />
      <label style={{ fontSize: 13 }}>{text}</label>
    </div>
  );
};

export default QuestLogDisplay;
