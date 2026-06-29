import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChild } from '../providers/ChildProvider';
import { BouncyButton } from '../components/KidsElements';
import { useNavigate } from 'react-router-dom';
import { audioService } from '../services/AudioService';
import { speechService } from '../services/SpeechService';
import { db } from '../database/db';
import { FiArrowLeft, FiTrash2, FiVolume2, FiSliders, FiEye, FiDownload, FiUpload } from 'react-icons/fi';
import { AvatarSVG } from '../components/SVGIcons';

export const ParentSettings: React.FC = () => {
  const {
    children,
    activeChild,
    settings,
    updateSettings,
    deleteProfile,
    resetProgress,
  } = useChild();
  
  const [pin, setPin] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [pinError, setPinError] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load speech voices
    const loadVoices = () => {
      setVoices(speechService.getVoices());
    };
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsLocked(false);
      setPinError(false);
    } else {
      audioService.play('wrong');
      setPinError(true);
      setPin('');
    }
  };

  const handleExport = async () => {
    const allData = {
      children: await db.children.toArray(),
      progress: await db.progress.toArray(),
      settings: await db.settings.toArray(),
      achievements: await db.achievements.toArray(),
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mykids_backup_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.children && data.progress) {
          // Clear current tables and import
          await db.children.clear();
          await db.progress.clear();
          await db.settings.clear();
          await db.achievements.clear();

          await db.children.bulkAdd(data.children);
          await db.progress.bulkAdd(data.progress);
          await db.settings.bulkAdd(data.settings);
          await db.achievements.bulkAdd(data.achievements);
          
          alert("Import successful! Reloading page...");
          window.location.reload();
        } else {
          alert("Invalid backup file format!");
        }
      } catch (err) {
        alert("Failed to parse file: " + err);
      }
    };
    reader.readAsText(file);
  };

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[40px] border-4 border-purple-magic p-8 max-w-md w-full shadow-2xl"
        >
          <h1 className="text-4xl font-black text-slate-700 mb-2">Parents Area</h1>
          <p className="text-lg font-bold text-slate-500 mb-6">Enter parent passcode to unlock settings (Default: 1234)</p>

          <form onSubmit={handlePinSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="text-center text-4xl tracking-widest font-black py-4 bg-slate-100 border-3 border-slate-300 focus:border-purple-magic outline-none rounded-2xl"
            />
            {pinError && <p className="text-red-500 font-bold">Incorrect PIN! Try again.</p>}
            
            <div className="flex gap-3">
              <BouncyButton type="button" variant="danger" onClick={() => navigate('/')} className="flex-1 text-xl py-3">
                Exit
              </BouncyButton>
              <BouncyButton type="submit" variant="primary" className="flex-1 text-xl py-3">
                Unlock
              </BouncyButton>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-3xl border-3 border-slate-200 shadow-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-800"
        >
          <FiArrowLeft className="text-2xl" /> Back to Home
        </button>
        <h1 className="text-3xl font-black text-slate-700">Settings Panel</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profiles Section */}
        <div className="bg-white rounded-[32px] p-6 border-3 border-slate-200 shadow-md">
          <h2 className="text-2xl font-black text-slate-700 mb-4 flex items-center gap-2">
            <FiTrash2 className="text-coral" /> Profiles Manager
          </h2>
          <div className="flex flex-col gap-3">
            {children.map((child) => (
              <div key={child.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-slate-200/50 rounded-full flex items-center justify-center p-1">
                    <AvatarSVG name={child.avatar} className="w-full h-full" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-700">{child.name}</h3>
                    <span className="text-xs text-slate-500">Age: {child.age} | Level {child.level}</span>
                  </div>
                </div>
                <button
                  onClick={() => child.id && deleteProfile(child.id)}
                  className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors border border-red-200 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Speech Settings */}
        {settings && (
          <div className="bg-white rounded-[32px] p-6 border-3 border-slate-200 shadow-md flex flex-col gap-4">
            <h2 className="text-2xl font-black text-slate-700 mb-2 flex items-center gap-2">
              <FiVolume2 className="text-sky-blue" /> Speech Settings
            </h2>
            
            <div>
              <label className="block font-bold text-slate-600 mb-1">Voice Narration</label>
              <select
                value={settings.voiceURI}
                onChange={(e) => updateSettings({ voiceURI: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl font-medium outline-none focus:border-sky-blue"
              >
                <option value="">Default Voice</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.name}>{v.name} ({v.lang})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Speech Speed ({settings.speechRate})</label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.speechRate}
                onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
                className="w-full accent-sky-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Voice Pitch ({settings.speechPitch})</label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.speechPitch}
                onChange={(e) => updateSettings({ speechPitch: parseFloat(e.target.value) })}
                className="w-full accent-sky-blue"
              />
            </div>
          </div>
        )}

        {/* Global Controls & Accessibility */}
        {settings && (
          <div className="bg-white rounded-[32px] p-6 border-3 border-slate-200 shadow-md flex flex-col gap-4">
            <h2 className="text-2xl font-black text-slate-700 mb-2 flex items-center gap-2">
              <FiEye className="text-grass-green" /> Accessibility
            </h2>

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-600">Reduced Motion</span>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                className="w-6 h-6 rounded-md accent-grass-green"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-600">Color Blind Friendly Mode</span>
              <input
                type="checkbox"
                checked={settings.colorBlindFriendly}
                onChange={(e) => updateSettings({ colorBlindFriendly: e.target.checked })}
                className="w-6 h-6 rounded-md accent-grass-green"
              />
            </div>
          </div>
        )}

        {/* Data Utilities */}
        <div className="bg-white rounded-[32px] p-6 border-3 border-slate-200 shadow-md flex flex-col gap-4">
          <h2 className="text-2xl font-black text-slate-700 mb-2 flex items-center gap-2">
            <FiSliders className="text-purple-magic" /> Data Utilities
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 bg-sky-100 hover:bg-sky-200 text-sky-700 border-2 border-sky-300 font-bold p-3 rounded-2xl transition-colors cursor-pointer"
            >
              <FiDownload /> Export JSON
            </button>

            <label className="flex items-center justify-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 border-2 border-orange-300 font-bold p-3 rounded-2xl cursor-pointer text-center">
              <FiUpload /> Import JSON
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          <button
            onClick={async () => {
              if (confirm("Reset child progress, coins, and levels? This cannot be undone.")) {
                await resetProgress();
                alert("Progress successfully reset!");
              }
            }}
            className="w-full text-center bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-300 font-bold p-3 rounded-2xl transition-colors cursor-pointer"
          >
            Reset Active Profile Progress
          </button>
        </div>
      </div>
    </div>
  );
};
