import React, { useEffect, useState } from "react";
import {
  generateId,
  getStoredCharacter,
  getStoredQuests,
  storeCharacter,
  storeQuests,
} from "./util";
import { Quests, Quest, QuestLog, Character } from "./types";
import CharacterDisplay from "./components/CharacterDisplay";
import QuestLogDisplay from "./components/QuestLogDisplay";
import PomodoroDisplay from "./components/PomodoroDisplay";
import MessagesDisplay from "./components/MessagesDisplay";
import CalendarDisplay from "./components/CalendarDisplay";

const defaultQuests: Quests = [
  { title: "Main Quests", quests: [] },
  { title: "Side Quests", quests: [] },
  { title: "Repeatable Quests", quests: [] },
];

const App = () => {
  const [character, setCharacter] = useState<Character>(getStoredCharacter());
  const [quests, setQuests] = useState(defaultQuests);

  useEffect(() => {
    let storedQuest = getStoredQuests();
    if (storedQuest !== null) {
      setQuests(storedQuest);
    }
  }, []);

  const createNewQuest = (questLogTitle: string, quest: Quest) => {
    console.log("created quest: ", quest);
    var newQuests = JSON.parse(JSON.stringify(quests));
    newQuests.forEach((questLog: QuestLog) => {
      if (questLog.title === questLogTitle) {
        questLog.quests.unshift(quest);
        storeQuests(newQuests);
        setQuests(newQuests);
        return;
      }
    });
  };

  const editCharacter = (editedValues: object) => {
    let newCharacter = { ...character, ...editedValues };
    console.log(newCharacter);
    setCharacter(newCharacter);
    storeCharacter(newCharacter);
  };

  const recreateRepeatQuest = (
    questLogTitle: string,
    quest: Quest
  ): Quest | null => {
    var newQuest: Quest = JSON.parse(JSON.stringify(quest));
    var newDate: Date = new Date(newQuest.expires);
    var currentDate: Date = new Date();
    if (newQuest.repeatDaily || newQuest.repeatWeekly) {
      let inc = newQuest.repeatDaily ? 1 : 7;
      newDate.setDate(currentDate.getDate() + inc);
      newQuest = {
        ...newQuest,
        id: generateId(),
        streak: newQuest.streak + 1,
        expires: newDate.getTime(),
      };
      return newQuest;
    } else if (quest.repeatYearly) {
      newDate.setFullYear(currentDate.getFullYear() + 1);
      newQuest = {
        ...newQuest,
        id: generateId(),
        streak: newQuest.streak + 1,
        expires: newDate.getTime(),
      };
      return newQuest;
    }
    return null;
  };

  const failedQuest = (questLogTitle: string, quest: Quest) => {
    let recreatedQuest = recreateRepeatQuest(questLogTitle, quest);
    removeQuest(questLogTitle, quest, recreatedQuest);
  };

  const completeQuest = (questLogTitle: string, quest: Quest) => {
    let newCharacter: Character = {
      ...character,
      proficiencies: {
        ...character.proficiencies,
        [quest.proficiency]: character.proficiencies[quest.proficiency] + 1,
      },
    };
    let leveledUpCharacter = incLevel(newCharacter);
    editCharacter(leveledUpCharacter);
    let recreatedQuest = recreateRepeatQuest(questLogTitle, quest);
    removeQuest(questLogTitle, quest, recreatedQuest);
  };

  const incLevel = (characterToLevelUp: Character): Character => {
    let inc = 1 / (Math.floor(characterToLevelUp.level) + 1);
    let newCharacter: Character = {
      ...characterToLevelUp,
      level: characterToLevelUp.level + inc,
    };
    console.log("inc is ", inc);
    return newCharacter;
  };

  const editQuest = (questLogTitle: string, quest: Quest) => {
    console.log("edited quest: ", quest);
    var newQuests = JSON.parse(JSON.stringify(quests));
    newQuests.forEach((questLog: QuestLog) => {
      if (questLog.title === questLogTitle) {
        questLog.quests.forEach((iteratedQuest: Quest, index: number) => {
          if (iteratedQuest.id === quest.id) {
            questLog.quests[index] = quest;
            storeQuests(newQuests);
            setQuests(newQuests);
            return;
          }
        });
      }
    });
  };

  const removeQuest = (
    questLogTitle: string,
    quest: Quest,
    replaceWith?: Quest | null
  ) => {
    var newQuests = JSON.parse(JSON.stringify(quests));
    newQuests.forEach((questLog: QuestLog) => {
      if (questLog.title === questLogTitle) {
        questLog.quests.forEach((iteratedQuest: Quest, index: number) => {
          if (iteratedQuest.id === quest.id) {
            questLog.quests.splice(index, 1);
            console.log("removed: ", iteratedQuest);

            if (replaceWith !== undefined && replaceWith !== null) {
              questLog.quests.push(replaceWith);
            }
            storeQuests(newQuests);
            setQuests(newQuests);
            return;
          }
        });
      }
    });
  };

  return (
    <div style={{ alignContent: "stretch", display: "flex", padding: 12 }}>
      <div style={{ width: 250 }}>
        <CharacterDisplay character={character} editCharacter={editCharacter} />
        <PomodoroDisplay />
        <MessagesDisplay />
        <CalendarDisplay />
      </div>
      {quests.map((questLog: QuestLog) => {
        return (
          <QuestLogDisplay
            title={questLog.title}
            quests={questLog.quests}
            createNewQuest={createNewQuest}
            completeQuest={completeQuest}
            failedQuest={failedQuest}
            editQuest={editQuest}
          />
        );
      })}
    </div>
  );
};

export default App;
