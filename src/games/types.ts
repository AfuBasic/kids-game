export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'numeracy' | 'literacy' | 'shapes' | 'colors' | 'animals' | 'memory';
  estimatedDuration: number; // in seconds
  rewards: {
    stars: number;
    coins: number;
    badgeId?: string;
  };
}
