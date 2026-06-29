import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BouncyButton, CharacterBubble, CelebrationModal, ProgressBar } from '../../components/KidsElements';
import { useChild } from '../../providers/ChildProvider';
import { audioService } from '../../services/AudioService';
import { useNavigate } from 'react-router-dom';
import { AppleSVG } from '../../components/SVGIcons';
import { FiArrowLeft } from 'react-icons/fi';

interface TargetRange {
  start: number;
  end: number;
  label: string;
  starsReward: number;
  coinsReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const CountUp: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<TargetRange | null>(null);
  const [count, setCount] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);
  const [wrongAnswerId, setWrongAnswerId] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const { addRewards } = useChild();
  const navigate = useNavigate();

  const ranges: TargetRange[] = [
    { start: 0, end: 10, label: 'Count 1 to 10 🍎', starsReward: 10, coinsReward: 5, difficulty: 'Easy' },
    { start: 10, end: 20, label: 'Teens: 10 to 20 🍎', starsReward: 15, coinsReward: 8, difficulty: 'Easy' },
    { start: 90, end: 100, label: 'Big Tens: 90 to 100 🍎', starsReward: 30, coinsReward: 15, difficulty: 'Medium' },
    { start: 490, end: 500, label: 'Galactic: 490 to 500 🍎', starsReward: 50, coinsReward: 25, difficulty: 'Hard' },
  ];

  // Initialize count when a range is selected
  useEffect(() => {
    if (selectedRange) {
      setCount(selectedRange.start);
      setComplete(false);
    }
  }, [selectedRange]);

  // Generate options for the next number
  useEffect(() => {
    if (selectedRange && count < selectedRange.end) {
      const correct = count + 1;
      const set = new Set<number>();
      set.add(correct);
      
      while (set.size < 3) {
        const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const wrong = correct + offset;
        if (wrong >= selectedRange.start && wrong <= selectedRange.end && wrong !== correct) {
          set.add(wrong);
        } else {
          // fallback random in range
          const rangeSpan = selectedRange.end - selectedRange.start;
          const rand = selectedRange.start + Math.floor(Math.random() * (rangeSpan + 1));
          if (rand !== correct && rand >= selectedRange.start && rand <= selectedRange.end) {
            set.add(rand);
          }
        }
      }
      
      setChoices(Array.from(set).sort(() => Math.random() - 0.5));
    }
  }, [count, selectedRange]);

  const handleChoice = (num: number) => {
    if (!selectedRange) return;
    const correct = count + 1;

    if (num === correct) {
      setCount(correct);
      audioService.play('correct');
      setWrongAnswerId(null);
      
      if (correct >= selectedRange.end) {
        setComplete(true);
        addRewards(selectedRange.starsReward, selectedRange.coinsReward);
      }
    } else {
      audioService.play('wrong');
      setWrongAnswerId(num);
      setTimeout(() => setWrongAnswerId(null), 600);
    }
  };

  const getProgressVal = () => {
    if (!selectedRange) return 0;
    return count - selectedRange.start;
  };

  const getTotalSteps = () => {
    if (!selectedRange) return 10;
    return selectedRange.end - selectedRange.start;
  };

  if (!selectedRange) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center select-none">
        <div className="text-left mb-6">
          <button
            onClick={() => navigate('/kids')}
            className="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            <FiArrowLeft className="text-2xl" /> Back to Dashboard
          </button>
        </div>

        <motion.h1 
          initial={{ y: -50, scale: 0.8 }} 
          animate={{ y: 0, scale: 1 }} 
          className="text-4xl md:text-6xl font-black text-sky-blue drop-shadow-md mb-4 flex items-center justify-center gap-3"
        >
          🍎 Count Up Challenge! 🍎
        </motion.h1>

        <CharacterBubble 
          text="Welcome to the High Number Zone! Choose a bracket below to test your counting skills!" 
          expression="excited"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-8">
          {ranges.map((range) => (
            <motion.div
              key={range.label}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                audioService.play('pop');
                setSelectedRange(range);
              }}
              className="bg-white border-4 border-yellow-300 hover:border-yellow-400 p-6 rounded-[32px] shadow-lg cursor-pointer transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-5xl mb-2 flex justify-center"><AppleSVG className="w-16 h-16" /></div>
                <h3 className="text-2xl font-black text-slate-700 mb-1">{range.label}</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-bold inline-block text-white mb-4 ${
                  range.difficulty === 'Easy' ? 'bg-grass-green' : range.difficulty === 'Medium' ? 'bg-orange-play' : 'bg-coral'
                }`}>
                  {range.difficulty} Mode
                </span>
              </div>
              <div className="border-t-2 border-slate-100 pt-3 flex justify-between items-center text-sm font-black">
                <span className="text-sky-blue">Range: {range.start} - {range.end}</span>
                <span className="text-yellow-600">⭐ +{range.starsReward}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center select-none">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSelectedRange(null)}
          className="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
        >
          <FiArrowLeft className="text-2xl" /> Change Range
        </button>
        <span className="bg-sky-blue/20 text-sky-blue px-4 py-1.5 rounded-full font-black text-lg">
          Count: {count} / {selectedRange.end}
        </span>
      </div>

      <motion.h1 className="text-4xl md:text-5xl font-black text-sky-blue drop-shadow-md mb-2">
        Number: {count}
      </motion.h1>

      <ProgressBar current={getProgressVal()} total={getTotalSteps()} />

      <CharacterBubble 
        text={count === selectedRange.start 
          ? `Let's start! What comes after ${selectedRange.start}?` 
          : count >= selectedRange.end
            ? `Spectacular! We successfully counted up to ${selectedRange.end}!` 
            : `We are at ${count}! What is the next number?`
        }
        expression={count >= selectedRange.end ? 'excited' : 'happy'}
      />

      {/* Apples visual container */}
      <div className="min-h-[200px] bg-white/70 backdrop-blur-md border-4 border-yellow-300 rounded-[32px] p-6 my-6 shadow-xl flex flex-wrap gap-2 items-center justify-center max-w-2xl mx-auto max-h-[250px] overflow-y-auto">
        <AnimatePresence>
          {Array.from({ length: count - selectedRange.start }).map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [0, 1.2, 1], rotate: 0 }}
              exit={{ scale: 0 }}
              className="cursor-pointer select-none"
              onClick={() => audioService.play('tap')}
            >
              <AppleSVG className="w-12 h-12" />
            </motion.div>
          ))}
          {count === selectedRange.start && (
            <p className="text-2xl font-bold text-slate-500">Pick the first number to load apples!</p>
          )}
        </AnimatePresence>
      </div>

      {/* Quiz choice options */}
      {!complete && (
        <div className="flex flex-col gap-4 mt-6">
          <p className="text-2xl font-extrabold text-slate-600">Which number comes next?</p>
          <div className="flex justify-center gap-6">
            {choices.map((num) => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleChoice(num)}
                className={`w-28 h-20 rounded-2xl border-4 text-3xl font-black text-white shadow-lg cursor-pointer flex items-center justify-center transition-all ${
                  wrongAnswerId === num 
                    ? 'bg-coral border-red-600 animate-wobble shadow-[0_6px_0_#b71c1c] translate-y-1'
                    : 'bg-orange-play border-orange-500 hover:bg-orange-400 shadow-[0_8px_0_#f57c00]'
                }`}
              >
                {num}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={complete}
        stars={selectedRange.starsReward}
        coins={selectedRange.coinsReward}
        title={`Amazing Counting to ${selectedRange.end}! 🌟`}
        onNext={() => navigate('/kids')}
      />
    </div>
  );
};
