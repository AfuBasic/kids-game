import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BouncyButton,
  CharacterBubble,
  CelebrationModal,
  ProgressBar,
} from "../../components/KidsElements";
import { useChild } from "../../providers/ChildProvider";
import { audioService } from "../../services/AudioService";
import { useNavigate } from "react-router-dom";
import { RocketSVG, FlameSVG, CustomStarSVG } from "../../components/SVGIcons";
import { FiArrowLeft } from "react-icons/fi";

interface TargetRange {
  start: number;
  end: number;
  label: string;
  starsReward: number;
  coinsReward: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const CountDown: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<TargetRange | null>(null);
  const [count, setCount] = useState(10);
  const [choices, setChoices] = useState<number[]>([]);
  const [wrongAnswerId, setWrongAnswerId] = useState<number | null>(null);
  const [isLaunched, setIsLaunched] = useState(false);
  const [complete, setComplete] = useState(false);
  const { addRewards } = useChild();
  const navigate = useNavigate();

  const ranges: TargetRange[] = [
    {
      start: 10,
      end: 0,
      label: "Standard: 10 to 0 🚀",
      starsReward: 10,
      coinsReward: 5,
      difficulty: "Easy",
    },
    {
      start: 20,
      end: 10,
      label: "Teens: 20 to 10 🚀",
      starsReward: 15,
      coinsReward: 8,
      difficulty: "Easy",
    },
    {
      start: 100,
      end: 90,
      label: "Big Tens: 100 to 90 🚀",
      starsReward: 30,
      coinsReward: 15,
      difficulty: "Medium",
    },
    {
      start: 500,
      end: 490,
      label: "Super Galactic: 500 to 490 🚀",
      starsReward: 50,
      coinsReward: 25,
      difficulty: "Hard",
    },
  ];

  // Initialize countdown value when a range is selected
  useEffect(() => {
    if (selectedRange) {
      setCount(selectedRange.start);
      setIsLaunched(false);
      setComplete(false);
    }
  }, [selectedRange]);

  // Generate options for the next countdown number
  useEffect(() => {
    if (selectedRange && count > selectedRange.end) {
      const correct = count - 1;
      const set = new Set<number>();
      set.add(correct);

      while (set.size < 3) {
        const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const wrong = correct + offset;
        if (
          wrong >= selectedRange.end &&
          wrong <= selectedRange.start &&
          wrong !== correct
        ) {
          set.add(wrong);
        } else {
          // fallback random
          const rangeSpan = selectedRange.start - selectedRange.end;
          const rand =
            selectedRange.end + Math.floor(Math.random() * (rangeSpan + 1));
          if (
            rand !== correct &&
            rand >= selectedRange.end &&
            rand <= selectedRange.start
          ) {
            set.add(rand);
          }
        }
      }

      setChoices(Array.from(set).sort(() => Math.random() - 0.5));
    }
  }, [count, selectedRange]);

  const handleChoice = (num: number) => {
    if (!selectedRange) return;
    const correct = count - 1;

    if (num === correct) {
      setCount(correct);
      audioService.play("correct");
      setWrongAnswerId(null);

      if (correct === selectedRange.end) {
        setIsLaunched(true);
        audioService.play("rocket");

        setTimeout(() => {
          setComplete(true);
          addRewards(selectedRange.starsReward, selectedRange.coinsReward);
        }, 2500);
      }
    } else {
      audioService.play("wrong");
      setWrongAnswerId(num);
      setTimeout(() => setWrongAnswerId(null), 600);
    }
  };

  const getShakeIntensity = () => {
    if (isLaunched) return 0;
    if (!selectedRange) return 0;
    const totalSteps = selectedRange.start - selectedRange.end;
    const currentSteps = selectedRange.start - count;
    return (currentSteps / totalSteps) * 8;
  };

  const getProgressVal = () => {
    if (!selectedRange) return 0;
    return selectedRange.start - count;
  };

  const getTotalSteps = () => {
    if (!selectedRange) return 10;
    return selectedRange.start - selectedRange.end;
  };

  if (!selectedRange) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center select-none">
        <div className="text-left mb-6">
          <button
            onClick={() => navigate("/kids")}
            className="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            <FiArrowLeft className="text-2xl" /> Back to Dashboard
          </button>
        </div>

        <motion.h1
          initial={{ y: -50, scale: 0.8 }}
          animate={{ y: 0, scale: 1 }}
          className="text-4xl md:text-6xl font-black text-coral drop-shadow-md mb-4 flex items-center justify-center gap-3"
        >
          🚀 Rocket Count Down! 🚀
        </motion.h1>

        <CharacterBubble
          text="Welcome to the Space Command Center! Choose a countdown range to prepare the rocket!"
          expression="happy"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-8">
          {ranges.map((range) => (
            <motion.div
              key={range.label}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                audioService.play("pop");
                setSelectedRange(range);
              }}
              className="bg-white border-4 border-sky-blue/30 hover:border-sky-blue p-6 rounded-[32px] shadow-lg cursor-pointer transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-5xl mb-2">🚀</div>
                <h3 className="text-2xl font-black text-slate-700 mb-1">
                  {range.label}
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold inline-block text-white mb-4 ${
                    range.difficulty === "Easy"
                      ? "bg-grass-green"
                      : range.difficulty === "Medium"
                        ? "bg-orange-play"
                        : "bg-coral"
                  }`}
                >
                  {range.difficulty} Mode
                </span>
              </div>
              <div className="border-t-2 border-slate-100 pt-3 flex justify-between items-center text-sm font-black">
                <span className="text-coral font-bold">
                  Range: {range.start} - {range.end}
                </span>
                <span className="text-yellow-600">⭐ +{range.starsReward}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const shake = getShakeIntensity();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center overflow-hidden select-none">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            setSelectedRange(null);
            setIsLaunched(false);
          }}
          className="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
        >
          <FiArrowLeft className="text-2xl" /> Change Range
        </button>
        <span className="bg-coral/20 text-coral px-4 py-1.5 rounded-full font-black text-lg">
          Countdown: {count} / {selectedRange.end}
        </span>
      </div>

      <motion.h1 className="text-4xl md:text-5xl font-black text-coral drop-shadow-md mb-2">
        Countdown: {count > selectedRange.end ? count : "BLAST OFF!"}
      </motion.h1>

      <ProgressBar current={getProgressVal()} total={getTotalSteps()} />

      <CharacterBubble
        text={
          count === selectedRange.start
            ? `Rocket is ready! What comes before ${selectedRange.start}?`
            : count === selectedRange.end
              ? "Engine ignition complete! Blast off!"
              : `Almost there! What comes before ${count}?`
        }
        expression={count === selectedRange.end ? "excited" : "happy"}
      />

      {/* Launchpad scene */}
      <div className="relative min-h-[300px] bg-slate-900/10 border-4 border-sky-blue rounded-[32px] p-6 my-6 shadow-xl flex flex-col items-center justify-end overflow-hidden max-w-lg mx-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-sky-blue/20 to-indigo-900/30 -z-10" />

        {/* Floating background stars */}
        <div className="absolute top-10 left-10 text-yellow-400 animate-pulse">
          <CustomStarSVG className="w-8 h-8" />
        </div>
        <div className="absolute top-25 right-12 text-yellow-400 animate-bounce">
          <CustomStarSVG className="w-10 h-10" />
        </div>

        {/* Animated shaking rocket */}
        <AnimatePresence>
          {!complete && (
            <motion.div
              animate={
                isLaunched
                  ? { y: -600, scale: 1.2 }
                  : {
                      y: [0, -4, 0],
                      x: shake > 0 ? [-shake, shake, -shake, shake, 0] : 0,
                    }
              }
              transition={
                isLaunched
                  ? { duration: 2.2, ease: "easeIn" }
                  : { repeat: Infinity, duration: 0.15 }
              }
              className="relative w-36 h-36 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => audioService.play("pop")}
            >
              <RocketSVG className="w-full h-full" />
              {(isLaunched ||
                count <= selectedRange.start - getTotalSteps() / 2) && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 0.1 }}
                  className="absolute bottom-[-32px] left-1/2 -translate-x-1/2"
                >
                  <FlameSVG className="w-14 h-14" />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating countdown overlay text */}
        {count > selectedRange.end && (
          <motion.div
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [1.6, 1], opacity: 1 }}
            className="absolute top-1/4 text-8xl font-black text-yellow-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] font-sans"
          >
            {count}
          </motion.div>
        )}
      </div>

      {/* Quiz choice options */}
      {!isLaunched && (
        <div className="flex flex-col gap-4 mt-6">
          <p className="text-2xl font-extrabold text-slate-600">
            Which number comes next?
          </p>
          <div className="flex justify-center gap-6">
            {choices.map((num) => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleChoice(num)}
                className={`w-28 h-20 rounded-2xl border-4 text-3xl font-black text-white shadow-lg cursor-pointer flex items-center justify-center transition-all ${
                  wrongAnswerId === num
                    ? "bg-coral border-red-600 animate-wobble shadow-[0_6px_0_#b71c1c] translate-y-1"
                    : "bg-sky-blue border-sky-400 hover:bg-sky-300 shadow-[0_8px_0_#0288d1]"
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
        title="Galactic Launch Accomplished! 🚀"
        onNext={() => navigate("/kids")}
      />
    </div>
  );
};
