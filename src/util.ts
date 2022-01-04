import {
  Character,
  CharacterProficiencies,
  Proficiencies,
  QuestLog,
  Quest,
} from "./types";

export const generateId = () => {
  return Math.floor(Math.random() * 9999999999);
};

export const getStoredQuests = () => {
  let questStorageItem = localStorage.getItem("quests");
  if (typeof questStorageItem === "string") {
    let quests = JSON.parse(questStorageItem);

    // Remove tasks that are being created
    quests.forEach((questLog: QuestLog) => {
      for (var i = questLog.quests.length - 1; i >= 0; i--) {
        var quest: Quest = questLog.quests[i];
        if (quest.isBeingCreated === true) {
          questLog.quests.splice(i, 1);
        }
      }
    });

    return quests;
  }
  return null;
};

export const storeQuests = (quests: Array<object>) => {
  localStorage.setItem("quests", JSON.stringify(quests));
};

export const getStoredHoursWorked = () => {
  let storageItem = localStorage.getItem("hoursWorked");
  if (typeof storageItem === "string") {
    let hoursWorked = JSON.parse(storageItem);
    return hoursWorked;
  }
  return 0;
};

export const storeHoursWorked = (hoursWorked: number) => {
  localStorage.setItem("hoursWorked", JSON.stringify(hoursWorked));
};

export const getStoredCharacter = () => {
  let storageItem = localStorage.getItem("character");
  if (typeof storageItem === "string") {
    let character = JSON.parse(storageItem);
    return character;
  }

  let defaultCharacterProficiencies: CharacterProficiencies = {
    [Proficiencies.strength]: 0,
    [Proficiencies.intelligence]: 0,
    [Proficiencies.sanity]: 0,
    [Proficiencies.charisma]: 0,
  };
  let defaultCharacter: Character = {
    name: "name",
    level: 0,
    proficiencies: defaultCharacterProficiencies,
  };
  return defaultCharacter;
};

export const storeCharacter = (character: Character) => {
  localStorage.setItem("character", JSON.stringify(character));
};
