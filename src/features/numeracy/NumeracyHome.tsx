import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useChild } from '../../providers/ChildProvider';
import { CharacterBubble, FloatingDecorations } from '../../components/KidsElements';
import { useNavigate } from 'react-router-dom';
import { db } from '../../database/db';
import { FiHome, FiLock, FiStar, FiAward, FiCheck } from 'react-icons/fi';
import { CustomStarSVG, CustomTrophySVG } from '../../components/SVGIcons';

interface GameConfig {
  id: string;
  title: string;
  desc: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  requiredStars: number;
}

export const NumeracyHome: React.FC = () => {
  const { activeChild } = useChild();
  const navigate = useNavigate();
  const [completedGames, setCompletedGames] = useState<string[]>([]);

  useEffect(() => {
    if (!activeChild) {
      navigate('/');
      return;
    }

    // Load completed games for checkmarks
    db.progress.where('childId').equals(activeChild.id!).toArray().then(records => {
      const ids = records.map(r => r.gameId);
      setCompletedGames(ids);
    });
  }, [activeChild, navigate]);

  if (!activeChild) return null;

  const gamesList: GameConfig[] = [
    // Counting Up
    { id: 'feed-monster', title: 'Feed the Monster', desc: 'Feed the hungry green monster!', icon: '👹', difficulty: 'Easy', requiredStars: 0 },
    { id: 'hatch-eggs', title: 'Hatch the Eggs', desc: 'Tap the eggs to hatch cute chicks!', icon: '🥚', difficulty: 'Easy', requiredStars: 0 },
    { id: 'number-train', title: 'Number Train', desc: 'Help boarding animals onto the train!', icon: '🚂', difficulty: 'Medium', requiredStars: 15 },
    { id: 'balloon-pop', title: 'Balloon Pop', desc: 'Pop the requested number of balloons!', icon: '🎈', difficulty: 'Easy', requiredStars: 0 },
    { id: 'aquarium', title: 'Aquarium Explorer', desc: 'Count active fish under the sea!', icon: '🐠', difficulty: 'Medium', requiredStars: 20 },
    // Counting Down
    { id: 'rocket-down', title: 'Rocket Countdown', desc: 'Count down 10-0 for launch!', icon: '🚀', difficulty: 'Easy', requiredStars: 0 },
    { id: 'balloon-down', title: 'Balloon Countdown', desc: 'Pop balloons to build a rainbow!', icon: '🌈', difficulty: 'Easy', requiredStars: 10 },
    { id: 'cookie-monster', title: 'Cookie Monster', desc: 'Eat cookies and count the rest!', icon: '🍪', difficulty: 'Easy', requiredStars: 5 },
    { id: 'frogs-log', title: 'Frogs on a Log', desc: 'Make frogs splash into the pond!', icon: '🐸', difficulty: 'Medium', requiredStars: 25 },
    // Addition
    { id: 'apple-basket', title: 'Apple Basket', desc: 'Count total apples in the basket!', icon: '🧺', difficulty: 'Medium', requiredStars: 15 },
    { id: 'ducks-pond', title: 'Ducks in the Pond', desc: 'Count all swimming duck friends!', icon: '🦆', difficulty: 'Medium', requiredStars: 30 },
    { id: 'train-passengers', title: 'Train Passengers', desc: 'Add boarding passengers together!', icon: '🚊', difficulty: 'Hard', requiredStars: 40 },
    { id: 'fish-friends', title: 'Fish Friends', desc: 'Add new fish to the school!', icon: '🐟', difficulty: 'Hard', requiredStars: 45 },
    { id: 'monkey-bananas', title: 'Monkey Bananas', desc: 'Add bananas for the excited monkey!', icon: '🍌', difficulty: 'Hard', requiredStars: 50 },
    // Subtraction
    { id: 'cookie-bear', title: 'Cookie Bear', desc: 'Bear eats cookies. Count remaining!', icon: '🐻', difficulty: 'Medium', requiredStars: 35 },
    { id: 'falling-apples', title: 'Falling Apples', desc: 'Wind blows apples. Count remaining!', icon: '🍃', difficulty: 'Medium', requiredStars: 30 },
    { id: 'birds-away', title: 'Birds Fly Away', desc: 'Birds fly off. Count remaining birds!', icon: '🐦', difficulty: 'Hard', requiredStars: 55 },
    { id: 'school-bus', title: 'School Bus', desc: 'Kids leave the bus. Count passengers!', icon: '🚌', difficulty: 'Hard', requiredStars: 60 },
  ];

  return (
    <div className="min-h-screen relative p-6 select-none pb-24">
      <FloatingDecorations />

      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto flex items-center justify-between bg-white/90 backdrop-blur-md border-4 border-sky-blue/30 p-4 rounded-[32px] shadow-lg z-10 relative mb-8"
      >
        <button
          onClick={() => navigate('/kids')}
          className="text-4xl p-2 bg-slate-100 hover:bg-slate-200 rounded-2xl cursor-pointer text-slate-600 border-2 border-slate-200 transition-colors"
        >
          <FiHome />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-4xl bg-sky-blue/10 p-1 rounded-full">{activeChild.avatar}</span>
          <div>
            <h2 className="text-2xl font-black text-slate-700 leading-none">{activeChild.name}</h2>
            <span className="text-sm font-bold text-sky-blue">Stars: {activeChild.stars}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-400 font-black text-yellow-700">
          <CustomStarSVG className="w-6 h-6" />
          <span>{activeChild.stars}</span>
        </div>
      </motion.div>

      <CharacterBubble text="Welcome to the Math Playground! Let's choose a game to play!" expression="happy" />

      {/* Games Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 z-10 relative mt-8">
        {gamesList.map((game) => {
          const isLocked = activeChild.stars < game.requiredStars;
          const isCompleted = completedGames.includes(game.id);

          return (
            <motion.div
              key={game.id}
              whileHover={!isLocked ? { scale: 1.05, y: -4 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
              onClick={() => {
                if (!isLocked) {
                  audioService.play('pop');
                  navigate(`/kids/numeracy/${game.id}`);
                } else {
                  audioService.play('wrong');
                }
              }}
              className={`rounded-[32px] p-6 shadow-xl relative border-4 flex flex-col justify-between transition-all ${
                isLocked 
                  ? 'bg-slate-100 border-slate-300 opacity-65 cursor-not-allowed'
                  : 'bg-white border-yellow-300 hover:border-yellow-400 cursor-pointer'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-5xl">{game.icon}</span>
                  {isLocked ? (
                    <span className="bg-slate-200 text-slate-500 p-2 rounded-full border border-slate-300">
                      <FiLock className="text-xl" />
                    </span>
                  ) : isCompleted ? (
                    <span className="bg-grass-green/20 text-grass-green p-2 rounded-full border border-grass-green">
                      <FiCheck className="text-xl font-bold" />
                    </span>
                  ) : null}
                </div>

                <h3 className="text-2xl font-black text-slate-700 mb-1">{game.title}</h3>
                <p className="text-slate-500 font-bold text-sm mb-4">{game.desc}</p>
              </div>

              <div className="border-t-2 border-slate-100 pt-3 flex justify-between items-center text-xs font-black">
                <span className={`px-2 py-0.5 rounded-full text-white ${
                  game.difficulty === 'Easy' ? 'bg-grass-green' : game.difficulty === 'Medium' ? 'bg-orange-play' : 'bg-coral'
                }`}>
                  {game.difficulty}
                </span>

                {isLocked && (
                  <span className="text-coral flex items-center gap-0.5">
                    <FiStar /> {game.requiredStars} Stars required
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
