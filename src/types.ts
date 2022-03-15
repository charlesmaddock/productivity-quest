export enum Proficiencies {
  strength,
  intelligence,
  sanity,
  charisma,
}

export interface CharacterProficiencies {
  [Proficiencies.strength]: number;
  [Proficiencies.intelligence]: number;
  [Proficiencies.sanity]: number;
  [Proficiencies.charisma]: number;
}

export interface Character {
  name: string;
  level: number;
  proficiencies: CharacterProficiencies;
}

export interface CheckboxObject {
  text: string;
  done: boolean;
}

export type Checkboxes = Array<CheckboxObject>;

export interface Quest {
  id: number;
  expMultiplier: number;
  isBeingCreated: boolean;
  objective: string;
  checkboxes: Checkboxes;
  expires: number;
  repeatDaily: boolean;
  repeatWeekly: boolean;
  repeatYearly: boolean;
  proficiency: Proficiencies;
  streak: number;
}

export interface QuestLog {
  title: string;
  quests: Array<Quest>;
}

export type Quests = Array<QuestLog>;
