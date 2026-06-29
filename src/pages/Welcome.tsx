import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useChild } from '@/providers/ChildProvider';
import { BouncyButton, FloatingDecorations } from '@/components/KidsElements';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSettings, FiUser } from 'react-icons/fi';
import { RainbowSVG, AvatarSVG, CustomStarSVG } from '@/components/SVGIcons';

export const Welcome: React.FC = () => {
  const { children, selectChild, createProfile } = useChild();
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState(5);
  const [avatar, setAvatar] = useState('🐯');
  const navigate = useNavigate();

  const avatars = ['🐯', 'fox', 'lion', 'frog', 'koala', 'panda', 'monkey', 'unicorn'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createProfile(name, age, avatar);
    setName('');
    setShowAddForm(false);
    navigate('/kids');
  };

  const handleSelect = async (id: number) => {
    await selectChild(id);
    navigate('/kids');
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 text-center select-none">
      <FloatingDecorations />

      {/* App Logo/Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="mb-10 z-10 flex flex-col items-center"
      >
        <RainbowSVG className="w-28 h-28 mb-4 animate-bounce" />
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-blue via-orange-play to-coral drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] tracking-wide">
          My Kids Learning
        </h1>
        <p className="text-2xl font-bold text-purple-magic/80 mt-2">Choose your profile to start playing!</p>
      </motion.div>

      {/* Main Grid */}
      <div className="w-full max-w-4xl z-10">
        {!showAddForm ? (
          <div className="flex flex-wrap justify-center gap-8">
            {children.map((child) => (
              <motion.div
                key={child.id}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => child.id && handleSelect(child.id)}
                className="bg-white rounded-[40px] border-4 border-sky-blue/30 p-6 w-48 shadow-xl cursor-pointer hover:border-sky-blue transition-colors flex flex-col items-center"
              >
                <div className="mb-4 p-2 bg-sky-blue/10 rounded-full w-24 h-24 flex items-center justify-center">
                  <AvatarSVG name={child.avatar} className="w-full h-full" />
                </div>
                <h3 className="text-3xl font-black text-slate-700 mb-1">{child.name}</h3>
                <span className="bg-purple-magic/20 text-purple-magic text-sm px-3 py-1 rounded-full font-bold">
                  Age {child.age}
                </span>
                <div className="flex items-center gap-1 mt-3 text-yellow-600 font-bold">
                  <CustomStarSVG className="w-6 h-6" />
                  <span>{child.stars}</span>
                </div>
              </motion.div>
            ))}

            {/* Create new profile card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowAddForm(true)}
              className="bg-white/60 border-4 border-dashed border-slate-400/40 rounded-[40px] p-6 w-48 shadow-lg cursor-pointer hover:border-purple-magic transition-colors flex flex-col items-center justify-center text-slate-500"
            >
              <div className="text-6xl mb-4 bg-slate-200/50 rounded-full w-20 h-20 flex items-center justify-center">
                <FiPlus />
              </div>
              <h3 className="text-2xl font-bold">New Profile</h3>
            </motion.div>
          </div>
        ) : (
          /* Profile creation form */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-4 border-yellow-400 rounded-[40px] p-8 max-w-lg mx-auto shadow-2xl"
          >
            <h2 className="text-4xl font-black text-coral mb-6">Create Kids Profile!</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
              <div>
                <label className="block text-xl font-bold text-slate-600 mb-2">Kid's Name</label>
                <input
                  type="text"
                  required
                  placeholder="Super Kid!"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-100 border-3 border-purple-magic/30 focus:border-purple-magic outline-none px-6 py-4 rounded-2xl text-2xl font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xl font-bold text-slate-600 mb-2">Age</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="2"
                    max="12"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="flex-1 accent-sky-blue"
                  />
                  <span className="text-3xl font-black text-purple-magic w-12 text-center">{age}</span>
                </div>
              </div>

              <div>
                <label className="block text-xl font-bold text-slate-600 mb-2">Choose Avatar</label>
                <div className="flex flex-wrap gap-3">
                  {avatars.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setAvatar(av)}
                      className={`p-2 rounded-2xl transition-all w-16 h-16 flex items-center justify-center ${
                        avatar === av ? 'bg-sky-blue/30 border-3 border-sky-blue scale-110' : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      <AvatarSVG name={av} className="w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <BouncyButton
                  type="button"
                  variant="danger"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 text-xl"
                >
                  Cancel
                </BouncyButton>
                <BouncyButton type="submit" variant="success" className="flex-1 text-xl">
                  Let's Go!
                </BouncyButton>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Parent Area Entry Button */}
      <div className="mt-16 z-10">
        <BouncyButton
          variant="magic"
          onClick={() => navigate('/parent')}
          className="text-lg px-6 py-3 rounded-2xl flex items-center gap-2 border-2"
        >
          <FiSettings /> Parent Zone
        </BouncyButton>
      </div>
    </div>
  );
};
