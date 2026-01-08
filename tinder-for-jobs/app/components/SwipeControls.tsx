import { motion } from "framer-motion";
import { X, RotateCcw, Check, Info } from "lucide-react";

interface SwipeControlsProps {
  onPass: () => void;
  onLike: () => void;
  onUndo: () => void;
  onInfo: () => void;
  canUndo: boolean;
  isLandscape: boolean;
}

export default function SwipeControls({
  onPass,
  onLike,
  onUndo,
  onInfo,
  canUndo,
  isLandscape,
}: SwipeControlsProps) {
  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center justify-center gap-4 mt-8"
    >
      {/* Pass button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onPass}
        className="w-14 h-14 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-red-400 hover:text-red-500 transition-colors shadow-md"
        title="Pass (Swipe Left)"
      >
        <X size={24} />
      </motion.button>

      {/* Undo button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onUndo}
        disabled={!canUndo}
        className={`w-14 h-14 rounded-full bg-white border-2 flex items-center justify-center transition-all shadow-md ${
          canUndo
            ? "border-gray-300 text-gray-600 hover:border-amber-400 hover:text-amber-500"
            : "border-gray-200 text-gray-300 cursor-not-allowed"
        }`}
        title="Undo Last Action"
      >
        <RotateCcw size={24} />
      </motion.button>

      {/* Like button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onLike}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white hover:shadow-lg transition-shadow shadow-md"
        title="Like (Swipe Right)"
      >
        <Check size={24} />
      </motion.button>

      {/* Info button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onInfo}
        className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all shadow-md ${
          isLandscape
            ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white"
            : "bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-500"
        }`}
        title="Toggle Details View"
      >
        <Info size={24} />
      </motion.button>
    </motion.div>
  );
}
