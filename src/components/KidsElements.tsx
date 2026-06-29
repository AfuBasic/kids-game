import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { audioService } from "@/services/AudioService";
import { speechService } from "@/services/SpeechService";
import { FiVolume2 } from "react-icons/fi";
import { MascotSVG, CustomStarSVG, CustomTrophySVG } from "@/components/SVGIcons";

// Bouncy Interactive Button
interface BouncyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  scaleOnHover?: number;
  tapScale?: number;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "magic";
}

export const BouncyButton: React.FC<BouncyButtonProps> = ({
  children,
  scaleOnHover = 1.08,
  tapScale = 0.9,
  variant = "primary",
  className = "",
  onClick,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-sky-blue text-white shadow-[0_6px_0_#0288d1] active:translate-y-[4px] active:shadow-[0_2px_0_#0288d1] border-2 border-white";
      case "secondary":
        return "bg-orange-play text-white shadow-[0_6px_0_#f57c00] active:translate-y-[4px] active:shadow-[0_2px_0_#f57c00] border-2 border-white";
      case "success":
        return "bg-grass-green text-white shadow-[0_6px_0_#388e3c] active:translate-y-[4px] active:shadow-[0_2px_0_#388e3c] border-2 border-white";
      case "danger":
        return "bg-coral text-white shadow-[0_6px_0_#d84315] active:translate-y-[4px] active:shadow-[0_2px_0_#d84315] border-2 border-white";
      case "warning":
        return "bg-sunshine-yellow text-slate-800 shadow-[0_6px_0_#fbc02d] active:translate-y-[4px] active:shadow-[0_2px_0_#fbc02d] border-2 border-white";
      case "magic":
        return "bg-purple-magic text-white shadow-[0_6px_0_#7e57c2] active:translate-y-[4px] active:shadow-[0_2px_0_#7e57c2] border-2 border-white";
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    audioService.play("tap");
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={{ scale: scaleOnHover }}
      whileTap={{ scale: tapScale }}
      className={`px-8 py-4 font-bold text-2xl rounded-3xl transition-transform cursor-pointer outline-none ${getVariantStyles()} ${className}`}
      onClick={handleClick}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

// Animated Mascot Speech Bubble
interface CharacterBubbleProps {
  text: string;
  expression?: "happy" | "thinking" | "excited";
}

export const CharacterBubble: React.FC<CharacterBubbleProps> = ({
  text,
  expression = "happy",
}) => {
  useEffect(() => {
    speechService.speak(text);
  }, [text]);

  const getMascotEmoji = () => {
    switch (expression) {
      case "excited":
        return "🦖✨";
      case "thinking":
        return "🦖🤔";
      default:
        return "🦖👋";
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 my-6 max-w-2xl mx-auto p-4">
      {/* Mascot */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
        onClick={() => {
          audioService.play("pop");
          speechService.speak("Hello there! I'm Kiko. Let's learn together!");
        }}
        className="cursor-pointer select-none bg-white p-2 rounded-full shadow-lg border-4 border-sky-blue relative flex items-center justify-center w-28 h-28"
      >
        <MascotSVG expression={expression} className="w-full h-full" />
        <span className="absolute -bottom-2 -right-2 bg-yellow-400 text-xs px-2 py-0.5 rounded-full font-bold shadow-md">
          Kiko
        </span>
      </motion.div>

      {/* Bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white text-slate-700 text-2xl p-6 rounded-3xl shadow-xl border-4 border-purple-magic flex-1"
      >
        {/* Triangle arrow for bubble */}
        <div className="absolute left-1/2 -top-4 -translate-x-1/2 md:left-[-16px] md:top-1/2 md:-translate-y-1/2 w-0 h-0 border-y-[12px] border-y-transparent border-r-[16px] border-r-white hidden md:block" />

        <p className="font-semibold pr-10">{text}</p>

        {/* Read aloud button */}
        <button
          onClick={() => speechService.speak(text)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-magic hover:text-sky-blue text-3xl transition-colors cursor-pointer"
          title="Read Aloud"
        >
          <FiVolume2 />
        </button>
      </motion.div>
    </div>
  );
};

// Playful Progress Bar
interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="w-full bg-slate-200/50 rounded-full h-8 p-1 shadow-inner relative max-w-xl mx-auto border-2 border-white">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: "spring", stiffness: 60 }}
        className="h-full bg-gradient-to-r from-sky-blue to-grass-green rounded-full shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]"
      />
      <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-700">
        {current} / {total}
      </div>
    </div>
  );
};

// Celebration & Reward Modal
interface CelebrationModalProps {
  isOpen: boolean;
  stars: number;
  coins: number;
  title?: string;
  onNext: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  stars,
  coins,
  title = "You Did It! 🌟",
  onNext,
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (isOpen) {
      audioService.play("victory");
      speechService.speak(
        `${title} You earned ${stars} stars and ${coins} coins!`,
      );
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Confetti */}
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={300}
          />

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.3, y: 100, rotate: -10 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.3, y: 100, rotate: 10 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative bg-white rounded-[40px] border-8 border-yellow-400 p-8 max-w-md w-full shadow-2xl text-center z-10 overflow-hidden"
          >
            {/* Rainbow background decoration */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-sky-blue/20 blur-2xl" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-coral/20 blur-2xl" />

            <h2 className="text-4xl md:text-5xl font-black text-coral mb-6 tracking-wide drop-shadow-sm">
              {title}
            </h2>

            {/* Sparkle graphics */}
            <div className="flex justify-center gap-6 my-8">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="bg-yellow-100 p-4 rounded-full border-4 border-yellow-400 flex flex-col items-center justify-center w-24 h-24 text-yellow-500"
              >
                <CustomStarSVG className="w-10 h-10" />
                <span className="block text-xl font-bold mt-1">+{stars}</span>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.2, 1], y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                className="bg-orange-100 p-4 rounded-full border-4 border-orange-400 flex flex-col items-center justify-center w-24 h-24 text-orange-500"
              >
                <CustomTrophySVG className="w-10 h-10" />
                <span className="block text-xl font-bold mt-1">+{coins}</span>
              </motion.div>
            </div>

            <p className="text-2xl font-bold text-slate-600 mb-8">
              Fantastic Job! You are super smart!
            </p>

            <BouncyButton
              variant="success"
              className="w-full text-3xl py-5"
              onClick={onNext}
            >
              Keep Playing! 🚀
            </BouncyButton>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Beautiful cartoon clouds and decorations
export const FloatingDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Cloud 1 */}
      <div className="absolute top-[10%] animate-cloud-slow opacity-60">
        <div className="w-32 h-10 bg-white rounded-full relative">
          <div className="w-16 h-16 bg-white rounded-full absolute -top-8 left-4" />
          <div className="w-16 h-16 bg-white rounded-full absolute -top-6 left-12" />
        </div>
      </div>

      {/* Cloud 2 */}
      <div
        className="absolute top-[25%] animate-cloud-fast opacity-40"
        style={{ animationDelay: "-10s" }}
      >
        <div className="w-40 h-12 bg-white rounded-full relative">
          <div className="w-20 h-20 bg-white rounded-full absolute -top-10 left-6" />
          <div className="w-16 h-16 bg-white rounded-full absolute -top-8 left-16" />
        </div>
      </div>

      {/* Cloud 3 */}
      <div
        className="absolute top-[60%] animate-cloud-slow opacity-50"
        style={{ animationDelay: "-20s" }}
      >
        <div className="w-28 h-8 bg-white rounded-full relative">
          <div className="w-12 h-12 bg-white rounded-full absolute -top-6 left-4" />
          <div className="w-12 h-12 bg-white rounded-full absolute -top-4 left-10" />
        </div>
      </div>
    </div>
  );
};
