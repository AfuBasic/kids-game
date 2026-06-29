import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BouncyButton, CharacterBubble, CelebrationModal, ProgressBar } from '@/components/KidsElements';
import { useChild } from '@/providers/ChildProvider';
import { audioService } from '@/services/AudioService';
import { db } from '@/database/db';
import { AppleSVG, RocketSVG, FlameSVG, CustomStarSVG, CustomTrophySVG, RainbowSVG } from '@/components/SVGIcons';
import { FiArrowLeft } from 'react-icons/fi';

export const GamePlayer: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { activeChild, addRewards } = useChild();
  const navigate = useNavigate();

  // Game States
  const [step, setStep] = useState(0); // Current progress/question step
  const [complete, setComplete] = useState(false);
  const [wrongAnswerId, setWrongAnswerId] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const startTime = useRef<number>(Date.now());

  // Game-specific configurations
  const [gameVars, setGameVars] = useState<any>({
    title: '',
    icon: '',
    targetVal: 5,
    additionA: 2,
    additionB: 3,
    startVal: 10,
    subVal: 3,
    customArray: [] as any[],
  });

  const [choices, setChoices] = useState<number[]>([]);

  // Setup specific game variables on load
  useEffect(() => {
    if (!gameId) return;

    let targetVal = 5;
    let title = '';
    let icon = '';
    let additionA = 2;
    let additionB = 2;
    let startVal = 10;
    let subVal = 4;
    let customArray: any[] = [];

    // Customize each game's starting values
    switch (gameId) {
      case 'feed-monster':
        title = 'Feed the Monster';
        targetVal = 4;
        icon = '👹';
        break;
      case 'hatch-eggs':
        title = 'Hatch the Eggs';
        targetVal = 5;
        icon = '🥚';
        break;
      case 'number-train':
        title = 'Number Train';
        targetVal = 6;
        icon = '🚂';
        break;
      case 'balloon-pop':
        title = 'Balloon Pop';
        targetVal = 7;
        icon = '🎈';
        break;
      case 'aquarium':
        title = 'Aquarium Explorer';
        targetVal = 5;
        icon = '🐠';
        break;
      case 'rocket-down':
        title = 'Rocket Countdown';
        targetVal = 10;
        icon = '🚀';
        break;
      case 'balloon-down':
        title = 'Balloon Countdown';
        targetVal = 8;
        icon = '🎈';
        break;
      case 'cookie-monster':
        title = 'Cookie Monster';
        targetVal = 10;
        icon = '🍪';
        break;
      case 'frogs-log':
        title = 'Frogs on a Log';
        targetVal = 10;
        icon = '🐸';
        break;
      case 'apple-basket':
        title = 'Apple Basket';
        additionA = 3;
        additionB = 2;
        targetVal = 5;
        icon = '🧺';
        break;
      case 'ducks-pond':
        title = 'Ducks in the Pond';
        additionA = 4;
        additionB = 3;
        targetVal = 7;
        icon = '🦆';
        break;
      case 'train-passengers':
        title = 'Train Passengers';
        additionA = 5;
        additionB = 4;
        targetVal = 9;
        icon = '🚊';
        break;
      case 'fish-friends':
        title = 'Fish Friends';
        additionA = 6;
        additionB = 4;
        targetVal = 10;
        icon = '🐟';
        break;
      case 'monkey-bananas':
        title = 'Monkey Bananas';
        additionA = 5;
        additionB = 5;
        targetVal = 10;
        icon = '🍌';
        break;
      case 'cookie-bear':
        title = 'Cookie Bear';
        startVal = 10;
        subVal = 4;
        targetVal = 6;
        icon = '🐻';
        break;
      case 'falling-apples':
        title = 'Falling Apples';
        startVal = 8;
        subVal = 3;
        targetVal = 5;
        icon = '🍃';
        break;
      case 'birds-away':
        title = 'Birds Fly Away';
        startVal = 9;
        subVal = 5;
        targetVal = 4;
        icon = '🐦';
        break;
      case 'school-bus':
        title = 'School Bus';
        startVal = 10;
        subVal = 6;
        targetVal = 4;
        icon = '🚌';
        break;
    }

    setGameVars({
      title,
      icon,
      targetVal,
      additionA,
      additionB,
      startVal,
      subVal,
      customArray,
    });
    setStep(0);
    setComplete(false);
    setAttempts(0);
    setCorrectAnswers(0);
    startTime.current = Date.now();
  }, [gameId]);

  // Generate bubble choices based on game types
  useEffect(() => {
    const correct = gameVars.targetVal;
    const set = new Set<number>();
    set.add(correct);

    const maxChoices = gameVars.targetVal + 4;
    while (set.size < 3) {
      const offset = Math.floor(Math.random() * 5) - 2;
      const wrong = correct + offset;
      if (wrong >= 0 && wrong <= maxChoices && wrong !== correct) {
        set.add(wrong);
      } else {
        const rand = Math.floor(Math.random() * maxChoices);
        if (rand !== correct && rand >= 0) set.add(rand);
      }
    }

    setChoices(Array.from(set).sort(() => Math.random() - 0.5));
  }, [gameVars]);

  const handleChoice = async (num: number) => {
    setAttempts(prev => prev + 1);
    if (num === gameVars.targetVal) {
      setCorrectAnswers(prev => prev + 1);
      audioService.play('correct');
      setComplete(true);

      // Save stats to database
      const accuracy = attempts === 0 ? 100 : Math.round((1 / (attempts + 1)) * 100);
      const playTime = Math.round((Date.now() - startTime.current) / 1000);

      await db.progress.add({
        childId: activeChild?.id!,
        gameId: gameId!,
        category: 'numeracy',
        starsEarned: 15,
        coinsEarned: 10,
        accuracy,
        playTime,
        completedAt: new Date(),
      });

      await addRewards(15, 10);
    } else {
      audioService.play('wrong');
      setWrongAnswerId(num);
      setTimeout(() => setWrongAnswerId(null), 600);
    }
  };

  const incrementStep = () => {
    if (step < gameVars.targetVal) {
      setStep(prev => prev + 1);
      audioService.play('pop');
    }
  };

  const decrementStep = () => {
    if (step < gameVars.targetVal) {
      setStep(prev => prev + 1);
      audioService.play('pop');
    }
  };

  // Get active instruction text based on game ID
  const getInstruction = () => {
    switch (gameId) {
      case 'feed-monster':
        return `Feed me ${gameVars.targetVal} apples! Tap to feed!`;
      case 'hatch-eggs':
        return `Tap the eggs to hatch ${gameVars.targetVal} baby chicks!`;
      case 'number-train':
        return `Load the train! Put ${gameVars.targetVal} passengers in!`;
      case 'balloon-pop':
        return `Pop the floating balloons! Pop all ${gameVars.targetVal}!`;
      case 'aquarium':
        return `How many fish are swimming in the aquarium altogether?`;
      case 'rocket-down':
        return `Vibrate the rocket and count down to zero!`;
      case 'balloon-down':
        return `Pop balloons to count down and reveal a rainbow!`;
      case 'cookie-monster':
        return `Eat cookies! Let's count how many cookies remain!`;
      case 'frogs-log':
        return `Splash frogs! Count how many remain on the log!`;
      case 'apple-basket':
        return `There are ${gameVars.additionA} red apples and ${gameVars.additionB} green apples. How many altogether?`;
      case 'ducks-pond':
        return `There are ${gameVars.additionA} ducks swimming and ${gameVars.additionB} joining. Count the total!`;
      case 'train-passengers':
        return `${gameVars.additionA} passengers are on the train, and ${gameVars.additionB} join them. How many total?`;
      case 'fish-friends':
        return `A school of ${gameVars.additionA} fish meets ${gameVars.additionB} friends. Count the total!`;
      case 'monkey-bananas':
        return `Monkey has ${gameVars.additionA} yellow bananas and ${gameVars.additionB} green ones. Count them all!`;
      case 'cookie-bear':
        return `Bear starts with ${gameVars.startVal} cookies and eats ${gameVars.subVal}. How many remain?`;
      case 'falling-apples':
        return `Tree had ${gameVars.startVal} apples, but ${gameVars.subVal} fell down. How many are left?`;
      case 'birds-away':
        return `${gameVars.startVal} birds sat on the branch. ${gameVars.subVal} flew away. Count the remaining!`;
      case 'school-bus':
        return `${gameVars.startVal} kids were on the bus. ${gameVars.subVal} got off. Count who is left!`;
      default:
        return 'Let\'s count together!';
    }
  };

  return (
    <div className="min-h-screen relative p-6 select-none pb-24 text-center">
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/kids/numeracy')}
          className="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
        >
          <FiArrowLeft className="text-2xl" /> Exit Game
        </button>
        <span className="bg-sky-blue/20 text-sky-blue px-4 py-1.5 rounded-full font-black text-lg">
          {gameVars.title}
        </span>
      </div>

      <motion.h1 
        initial={{ scale: 0.8 }} 
        animate={{ scale: 1 }} 
        className="text-4xl md:text-5xl font-black text-sky-blue drop-shadow-md mb-2 flex items-center justify-center gap-3"
      >
        <span>{gameVars.icon}</span> {gameVars.title}
      </motion.h1>

      <ProgressBar current={step} total={gameVars.targetVal} />

      <CharacterBubble text={getInstruction()} expression="happy" />

      {/* Dynamic Game Board area */}
      <div className="relative min-h-[350px] bg-white/70 backdrop-blur-md border-4 border-yellow-300 rounded-[32px] p-6 my-6 shadow-xl flex flex-wrap gap-4 items-center justify-center max-w-2xl mx-auto overflow-hidden">
        
        {/* Render Feed the Monster */}
        {gameId === 'feed-monster' && (
          <div className="flex flex-col items-center justify-between w-full">
            <motion.div
              animate={{ y: step > 0 ? [0, -10, 0] : 0 }}
              className="text-9xl mb-8 relative select-none"
            >
              {step >= gameVars.targetVal ? '🦖😋 burp!' : '🦖 hungry!'}
            </motion.div>
            <div className="flex gap-4">
              {Array.from({ length: gameVars.targetVal - step }).map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.15 }}
                  onClick={incrementStep}
                  className="cursor-pointer select-none"
                >
                  <AppleSVG className="w-16 h-16" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Render Hatch Eggs */}
        {gameId === 'hatch-eggs' && (
          <div className="flex gap-6 justify-center flex-wrap">
            {Array.from({ length: gameVars.targetVal }).map((_, i) => (
              <motion.div
                key={i}
                onClick={() => {
                  if (step <= i) {
                    incrementStep();
                  }
                }}
                className="cursor-pointer text-6xl"
              >
                {step > i ? '🐣' : '🥚'}
              </motion.div>
            ))}
          </div>
        )}

        {/* Render Number Train */}
        {gameId === 'number-train' && (
          <div className="flex flex-col items-center justify-between w-full">
            <div className="text-8xl mb-8">🚂💨</div>
            <div className="flex gap-4">
              {Array.from({ length: gameVars.targetVal - step }).map((_, i) => (
                <motion.div
                  key={i}
                  onClick={incrementStep}
                  className="text-5xl cursor-pointer"
                >
                  🐯
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2 mt-4 bg-slate-300 p-3 rounded-xl min-w-[200px]">
              {Array.from({ length: step }).map((_, i) => (
                <span key={i} className="text-4xl">🐯</span>
              ))}
            </div>
          </div>
        )}

        {/* Render Balloon Pop */}
        {gameId === 'balloon-pop' && (
          <div className="flex gap-6 justify-center flex-wrap">
            {Array.from({ length: gameVars.targetVal }).map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                onClick={() => {
                  if (step < gameVars.targetVal) {
                    const next = step + 1;
                    setStep(next);
                    audioService.play('pop');
                    if (next === gameVars.targetVal) handleChoice(gameVars.targetVal);
                  }
                }}
                className="cursor-pointer text-6xl"
              >
                {step > i ? '💥' : '🎈'}
              </motion.div>
            ))}
          </div>
        )}

        {/* Render Rocket Countdown */}
        {gameId === 'rocket-down' && (
          <div className="flex flex-col items-center w-full">
            <motion.div
              animate={step >= gameVars.targetVal ? { y: -300, scale: 1.2 } : { y: [0, -2, 0], x: [-1, 1, -1, 1, 0] }}
              transition={step >= gameVars.targetVal ? { duration: 1.8, ease: "easeIn" } : { repeat: Infinity, duration: 0.15 }}
              className="w-36 h-36 mb-6"
            >
              <RocketSVG className="w-full h-full" />
              {(step >= gameVars.targetVal / 2) && (
                <div className="absolute bottom-[-16px] left-1/2 -translate-x-1/2">
                  <FlameSVG className="w-12 h-12" />
                </div>
              )}
            </motion.div>
            {step < gameVars.targetVal ? (
              <BouncyButton
                variant="secondary"
                onClick={() => {
                  const next = step + 1;
                  setStep(next);
                  audioService.play('tap');
                  if (next === gameVars.targetVal) handleChoice(gameVars.targetVal);
                }}
              >
                Count Down: {gameVars.targetVal - step} (Tap!)
              </BouncyButton>
            ) : (
              <div className="text-3xl font-black text-coral animate-bounce">BLAST OFF! 🚀</div>
            )}
          </div>
        )}

        {/* Render Balloon Countdown */}
        {gameId === 'balloon-down' && (
          <div className="flex flex-col items-center w-full">
            {step >= gameVars.targetVal ? (
              <RainbowSVG className="w-48 h-32 animate-bounce" />
            ) : (
              <div className="flex gap-4 flex-wrap justify-center">
                {Array.from({ length: gameVars.targetVal - step }).map((_, i) => (
                  <motion.div
                    key={i}
                    onClick={() => {
                      const next = step + 1;
                      setStep(next);
                      audioService.play('pop');
                      if (next === gameVars.targetVal) handleChoice(gameVars.targetVal);
                    }}
                    className="text-5xl cursor-pointer"
                  >
                    🎈
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Render Cookie Monster countdown */}
        {gameId === 'cookie-monster' && (
          <div className="flex flex-col items-center w-full">
            <div className="text-7xl mb-4">🐻😋🍪</div>
            <div className="flex gap-3 flex-wrap justify-center">
              {Array.from({ length: gameVars.targetVal - step }).map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => {
                    const next = step + 1;
                    setStep(next);
                    audioService.play('pop');
                    if (next === gameVars.targetVal) handleChoice(gameVars.targetVal);
                  }}
                  className="text-5xl cursor-pointer select-none"
                >
                  🍪
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Render Frogs on a Log */}
        {gameId === 'frogs-log' && (
          <div className="flex flex-col items-center w-full pt-10">
            <div className="bg-amber-800/80 h-8 w-full rounded-full mb-10 relative border-4 border-amber-900">
              <div className="absolute inset-0 flex justify-center gap-6 -top-10">
                {Array.from({ length: gameVars.targetVal - step }).map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      const next = step + 1;
                      setStep(next);
                      audioService.play('pop');
                      if (next === gameVars.targetVal) handleChoice(gameVars.targetVal);
                    }}
                    className="text-4xl cursor-pointer"
                  >
                    🐸
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Render Quiz Options (Games 5, 10, 11, 12, 13, 14, 15, 16, 17, 18) */}
        {['aquarium', 'apple-basket', 'ducks-pond', 'train-passengers', 'fish-friends', 'monkey-bananas', 'cookie-bear', 'falling-apples', 'birds-away', 'school-bus'].includes(gameId!) && (
          <div className="flex flex-col items-center w-full">
            {/* Visual representations */}
            {gameId === 'aquarium' && (
              <div className="flex gap-4 flex-wrap justify-center">
                {Array.from({ length: gameVars.targetVal }).map((_, i) => (
                  <motion.span key={i} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }} className="text-5xl">🐠</motion.span>
                ))}
              </div>
            )}
            {gameId === 'apple-basket' && (
              <div className="flex flex-col items-center">
                <div className="flex gap-4">
                  {Array.from({ length: gameVars.additionA }).map((_, i) => <AppleSVG key={i} className="w-12 h-12" />)}
                  <span className="text-4xl font-bold">+</span>
                  {Array.from({ length: gameVars.additionB }).map((_, i) => <AppleSVG key={i} className="w-12 h-12" />)}
                </div>
              </div>
            )}
            {gameId === 'ducks-pond' && (
              <div className="flex gap-8">
                <div className="flex gap-2">{Array.from({ length: gameVars.additionA }).map((_, i) => <span key={i} className="text-4xl">🦆</span>)}</div>
                <div className="flex gap-2">{Array.from({ length: gameVars.additionB }).map((_, i) => <span key={i} className="text-4xl">🦆</span>)}</div>
              </div>
            )}
            {gameId === 'train-passengers' && (
              <div className="flex gap-4">
                <span className="text-4xl">🚊</span>
                <div className="flex gap-2 bg-slate-100 p-2 rounded-xl">
                  {Array.from({ length: gameVars.additionA }).map((_, i) => <span key={i} className="text-2xl">🐨</span>)}
                  <span className="font-bold">+</span>
                  {Array.from({ length: gameVars.additionB }).map((_, i) => <span key={i} className="text-2xl">🐨</span>)}
                </div>
              </div>
            )}
            {gameId === 'fish-friends' && (
              <div className="flex gap-8">
                <div className="flex gap-1">{Array.from({ length: gameVars.additionA }).map((_, i) => <span key={i} className="text-3xl">🐟</span>)}</div>
                <div className="flex gap-1">{Array.from({ length: gameVars.additionB }).map((_, i) => <span key={i} className="text-3xl">🐟</span>)}</div>
              </div>
            )}
            {gameId === 'monkey-bananas' && (
              <div className="flex flex-col items-center">
                <span className="text-6xl mb-3">🐵</span>
                <div className="flex gap-4">
                  {Array.from({ length: gameVars.additionA + gameVars.additionB }).map((_, i) => <span key={i} className="text-3xl">🍌</span>)}
                </div>
              </div>
            )}
            {gameId === 'cookie-bear' && (
              <div className="flex flex-col items-center">
                <span className="text-6xl mb-3">🐻</span>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: gameVars.targetVal }).map((_, i) => <span key={i} className="text-3xl">🍪</span>)}
                  {Array.from({ length: gameVars.subVal }).map((_, i) => <span key={i} className="text-3xl opacity-30 line-through">🍪</span>)}
                </div>
              </div>
            )}
            {gameId === 'falling-apples' && (
              <div className="flex flex-col items-center">
                <div className="flex gap-2">
                  {Array.from({ length: gameVars.targetVal }).map((_, i) => <AppleSVG key={i} className="w-10 h-10" />)}
                  {Array.from({ length: gameVars.subVal }).map((_, i) => <AppleSVG key={i} className="w-10 h-10 opacity-20" />)}
                </div>
              </div>
            )}
            {gameId === 'birds-away' && (
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: gameVars.targetVal }).map((_, i) => <span key={i} className="text-4xl">🐦</span>)}
                {Array.from({ length: gameVars.subVal }).map((_, i) => <span key={i} className="text-4xl opacity-10">🐦</span>)}
              </div>
            )}
            {gameId === 'school-bus' && (
              <div className="flex flex-col items-center">
                <span className="text-6xl mb-2">🚌</span>
                <div className="flex gap-2">
                  {Array.from({ length: gameVars.targetVal }).map((_, i) => <span key={i} className="text-3xl">🐵</span>)}
                </div>
              </div>
            )}

            {/* Bubble choices options */}
            <div className="flex flex-col gap-4 mt-8">
              <p className="text-xl font-bold text-slate-600">Choose the correct total:</p>
              <div className="flex justify-center gap-4">
                {choices.map((num) => (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChoice(num)}
                    className={`w-20 h-20 rounded-full border-4 text-3xl font-black text-white shadow-lg cursor-pointer flex items-center justify-center transition-all ${
                      wrongAnswerId === num
                        ? 'bg-coral border-red-600 animate-wobble shadow-[0_6px_0_#b71c1c]'
                        : 'bg-orange-play border-orange-500 hover:bg-orange-400 shadow-[0_8px_0_#f57c00]'
                    }`}
                  >
                    {num}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={complete}
        stars={15}
        coins={10}
        title="Spectacular Job! 🌟"
        onNext={() => navigate('/kids/numeracy')}
      />
    </div>
  );
};
