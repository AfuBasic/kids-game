import Dexie, { type Table } from 'dexie';

export interface Child {
  id?: number;
  name: string;
  avatar: string; // emoji or SVG name
  age: number;
  stars: number;
  coins: number;
  level: number;
  streak: number;
  lastPlayed?: Date;
}

export interface Progress {
  id?: number;
  childId: number;
  gameId: string;
  category: string;
  starsEarned: number;
  coinsEarned: number;
  accuracy: number; // percentage
  playTime: number; // in seconds
  completedAt: Date;
}

export interface Achievement {
  id?: number;
  childId: number;
  badgeId: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface ChildSettings {
  id?: number;
  childId: number;
  musicVolume: number;
  sfxVolume: number;
  speechVolume: number;
  speechRate: number;
  speechPitch: number;
  voiceURI: string;
  reducedMotion: boolean;
  colorBlindFriendly: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export class MyKidsDB extends Dexie {
  children!: Table<Child>;
  progress!: Table<Progress>;
  achievements!: Table<Achievement>;
  settings!: Table<ChildSettings>;

  constructor() {
    super('MyKidsDB');
    this.version(1).stores({
      children: '++id, name, lastPlayed',
      progress: '++id, childId, gameId, category, completedAt',
      achievements: '++id, childId, badgeId',
      settings: '++id, childId',
    });
  }
}

export const db = new MyKidsDB();
