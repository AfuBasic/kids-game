import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChild } from '../providers/ChildProvider';
import { BouncyButton, CharacterBubble, FloatingDecorations } from '../components/KidsElements';
import { useNavigate } from 'react-router-dom';
import { audioService } from '../services/AudioService';
import { FiHome, FiLock, FiStar, FiAward, FiSettings } from 'react-icons/fi';
import { AvatarSVG, CustomStarSVG, CustomTrophySVG, AppleSVG, RocketSVG } from '../components/SVGIcons';

export const KidsDashboard: React.FC = () => {
  const { activeChild, settings } = useChild();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if no profile selected
    if (!activeChild) {
      navigate('/');
    } else {
      audioService.startBackgroundMusic();
    }
  }, [activeChild, navigate]);

  if (!activeChild) return null;

  const categories = [
    { id: 'numeracy', name: 'Numeracy', bg: 'bg-orange-play hover:shadow-[0_8px_0_#e65100]' },
    { id: 'literacy', name: 'Literacy', locked: true, bg: 'bg-purple-magic/50 cursor-not-allowed' },
    { id: 'shapes', name: 'Shapes', locked: true, bg: 'bg-sky-blue/50 cursor-not-allowed' },
    { id: 'colors', name: 'Colors', locked: true, bg: 'bg-coral/50 cursor-not-allowed' },
  ];

  const numeracyGames = [
    {
      id: 'count-up',
      title: 'Count Up!',
      desc: 'Count yummy apples from 1 to 10!',
      icon: '🍎',
      route: '/kids/count-up',
      stars: 10,
      coins: 5,
    },
    {
      id: 'count-down',
      title: 'Count Down!',
      desc: 'Help launch the rocket to outer space!',
      icon: '🚀',
      route: '/kids/count-down',
      stars: 15,
      coins: 10,
    },
  ];

  return (
    <div className="min-h-screen relative p-6 select-none pb-24">
      <FloatingDecorations />

      {/* Top Navbar */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-md border-4 border-sky-blue/30 p-4 rounded-[32px] shadow-lg z-10 relative mb-8"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioService.stopBackgroundMusic();
              navigate('/');
            }}
            className="text-4xl p-2 bg-slate-100 hover:bg-slate-200 rounded-2xl cursor-pointer text-slate-600 border-2 border-slate-200 transition-colors"
          >
            <FiHome />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-sky-blue/10 rounded-full flex items-center justify-center p-1">
              <AvatarSVG name={activeChild.avatar} className="w-full h-full" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-700 leading-none">{activeChild.name}</h2>
              <span className="text-sm font-bold text-sky-blue">Level {activeChild.level} Explorer</span>
            </div>
          </div>
        </div>

        {/* Rewards Counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-400 font-black text-yellow-700 text-xl shadow-sm">
            <CustomStarSVG className="w-6 h-6" />
            <span>{activeChild.stars}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-100 px-4 py-2 rounded-full border-2 border-orange-400 font-black text-orange-700 text-xl shadow-sm">
            <CustomTrophySVG className="w-6 h-6" />
            <span>{activeChild.coins}</span>
          </div>
        </div>
      </motion.div>

      {/* Greeting mascot bubble */}
      <CharacterBubble text={`Welcome back, ${activeChild.name}! What fun game shall we play today?`} expression="excited" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 z-10 relative mt-8">
        
        {/* Categories panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h3 className="text-2xl font-black text-slate-600 mb-2">Subject Zones</h3>
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={!cat.locked ? { scale: 1.05, x: 5 } : {}}
              onClick={() => {
                if (!cat.locked) {
                  audioService.play('pop');
                  navigate(`/kids/${cat.id}`);
                } else {
                  audioService.play('wrong');
                }
              }}
              className={`p-4 rounded-2xl text-2xl font-bold text-white shadow-md select-none relative overflow-hidden flex items-center justify-between cursor-pointer ${cat.bg}`}
            >
              <span>{cat.name}</span>
              {cat.locked && <FiLock className="text-white/60 text-2xl" />}
            </motion.div>
          ))}
        </div>

        {/* Games display list */}
        <div className="lg:col-span-3">
          <h3 className="text-2xl font-black text-slate-600 mb-4">Select Numeracy Game</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {numeracyGames.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  audioService.play('pop');
                  navigate(game.route);
                }}
                className="bg-white rounded-[40px] border-4 border-yellow-400/30 hover:border-yellow-400 p-6 shadow-xl cursor-pointer transition-colors relative flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 bg-yellow-100/50 p-3 rounded-3xl w-24 h-24 flex items-center justify-center">
                    {game.icon === '🍎' ? <AppleSVG className="w-full h-full" /> : <RocketSVG className="w-full h-full" />}
                  </div>
                  <h4 className="text-3xl font-black text-slate-700 mb-2">{game.title}</h4>
                  <p className="text-lg font-bold text-slate-500 mb-6">{game.desc}</p>
                </div>

                {/* Stars/Coins reward tags */}
                <div className="flex items-center justify-between border-t-2 border-slate-100 pt-4 mt-auto">
                  <span className="bg-sky-blue/10 text-sky-blue text-sm px-3 py-1 rounded-full font-black">
                    Easy Math
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-600 font-bold flex items-center gap-1">
                      <CustomStarSVG className="w-5 h-5" /> {game.stars}
                    </span>
                    <span className="text-orange-600 font-bold flex items-center gap-1">
                      <CustomTrophySVG className="w-5 h-5" /> {game.coins}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
