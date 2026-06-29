import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, type Child, type ChildSettings } from '@/database/db';
import { audioService } from '@/services/AudioService';
import { speechService } from '@/services/SpeechService';

interface ChildContextType {
  children: Child[];
  activeChild: Child | null;
  settings: ChildSettings | null;
  loading: boolean;
  selectChild: (id: number) => Promise<void>;
  createProfile: (name: string, age: number, avatar: string) => Promise<void>;
  deleteProfile: (id: number) => Promise<void>;
  addRewards: (stars: number, coins: number) => Promise<void>;
  updateSettings: (newSettings: Partial<ChildSettings>) => Promise<void>;
  resetProgress: () => Promise<void>;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const ChildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Child[]>([]);
  const [activeChild, setActiveChild] = useState<Child | null>(null);
  const [settings, setSettings] = useState<ChildSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Load children profiles from database on mount
  const loadProfiles = async () => {
    try {
      const all = await db.children.toArray();
      setProfiles(all);
      
      // If there's an active profile ID stored, restore it
      const savedId = localStorage.getItem('activeChildId');
      if (savedId) {
        const idNum = parseInt(savedId, 10);
        const child = all.find(c => c.id === idNum);
        if (child) {
          setActiveChild(child);
          await loadSettings(idNum);
        }
      }
    } catch (e) {
      console.error("Failed to load profiles:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadSettings = async (childId: number) => {
    let childSettings = await db.settings.where('childId').equals(childId).first();
    if (!childSettings) {
      // Create default settings
      const newSettingsId = await db.settings.add({
        childId,
        musicVolume: 0.5,
        sfxVolume: 0.8,
        speechVolume: 1.0,
        speechRate: 0.9,
        speechPitch: 1.2,
        voiceURI: '',
        reducedMotion: false,
        colorBlindFriendly: false,
        difficulty: 'easy'
      });
      childSettings = await db.settings.get(newSettingsId);
    }
    if (childSettings) {
      setSettings(childSettings);
      
      // Synchronize active service values
      audioService.musicEnabled = !childSettings.reducedMotion; // or specific music toggle
      audioService.sfxEnabled = true;
      speechService.rate = childSettings.speechRate;
      speechService.pitch = childSettings.speechPitch;
      speechService.volume = childSettings.speechVolume;
    }
  };

  const selectChild = async (id: number) => {
    const child = profiles.find(c => c.id === id);
    if (child) {
      setActiveChild(child);
      localStorage.setItem('activeChildId', id.toString());
      await loadSettings(id);
      
      // Update last played timestamp
      child.lastPlayed = new Date();
      await db.children.put(child);
    }
  };

  const createProfile = async (name: string, age: number, avatar: string) => {
    const newChildId = await db.children.add({
      name,
      age,
      avatar,
      stars: 0,
      coins: 0,
      level: 1,
      streak: 1,
      lastPlayed: new Date()
    });

    const all = await db.children.toArray();
    setProfiles(all);
    await selectChild(newChildId);
  };

  const deleteProfile = async (id: number) => {
    await db.children.delete(id);
    await db.settings.where('childId').equals(id).delete();
    await db.progress.where('childId').equals(id).delete();
    await db.achievements.where('childId').equals(id).delete();

    if (activeChild?.id === id) {
      setActiveChild(null);
      setSettings(null);
      localStorage.removeItem('activeChildId');
    }
    await loadProfiles();
  };

  const addRewards = async (stars: number, coins: number) => {
    if (!activeChild || !activeChild.id) return;
    const updated = {
      ...activeChild,
      stars: activeChild.stars + stars,
      coins: activeChild.coins + coins,
      // Cute leveling logic: level up every 50 stars!
      level: Math.floor((activeChild.stars + stars) / 50) + 1
    };
    await db.children.put(updated);
    setActiveChild(updated);
    setProfiles(profiles.map(p => p.id === updated.id ? updated : p));
  };

  const updateSettings = async (newSettings: Partial<ChildSettings>) => {
    if (!settings || !activeChild || !activeChild.id) return;
    const updated = { ...settings, ...newSettings };
    await db.settings.put(updated);
    setSettings(updated);

    // Sync with services
    speechService.rate = updated.speechRate;
    speechService.pitch = updated.speechPitch;
    speechService.volume = updated.speechVolume;
    speechService.voiceName = updated.voiceURI;
  };

  const resetProgress = async () => {
    if (!activeChild || !activeChild.id) return;
    await db.progress.where('childId').equals(activeChild.id).delete();
    await db.achievements.where('childId').equals(activeChild.id).delete();
    
    const resetChild = {
      ...activeChild,
      stars: 0,
      coins: 0,
      level: 1,
      streak: 1
    };
    await db.children.put(resetChild);
    setActiveChild(resetChild);
    await loadProfiles();
  };

  return (
    <ChildContext.Provider
      value={{
        children: profiles,
        activeChild,
        settings,
        loading,
        selectChild,
        createProfile,
        deleteProfile,
        addRewards,
        updateSettings,
        resetProgress
      }}
    >
      {children}
    </ChildContext.Provider>
  );
};

export const useChild = () => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
};
