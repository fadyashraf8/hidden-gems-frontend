import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./RotatingText.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const RotatingText = forwardRef(
  (
    {
      texts,
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-120%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...props
    },
    ref
  ) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    const splitIntoCharacters = (text) => {
      if (typeof text !== "string") return []; // Handle non-string inputs safely
      return text.split("");
    };

    const splitIntoWords = (text) => {
      if (typeof text !== "string") return []; // Handle non-string inputs safely
      return text.split(" ");
    };

    const elements = useMemo(() => {
      const currentText = texts[currentTextIndex];
      if (splitBy === "characters") {
        const words = splitIntoWords(currentText);
        return words.map((word, wIndex) => (
          <span
            key={wIndex}
            className={cn("text-rotate-word", splitLevelClassName)}
          >
            {splitIntoCharacters(word).map((char, cIndex) => (
              <motion.span
                key={cIndex}
                className={cn("text-rotate-element", elementLevelClassName)}
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{
                  ...transition,
                  delay: getStaggerDelay(
                    getStaggerIndex(cIndex, splitIntoCharacters(word).length),
                    splitIntoCharacters(word).length
                  ),
                }}
              >
                {char}
              </motion.span>
            ))}
            <span className="text-rotate-space">&nbsp;</span>
          </span>
        ));
      }

      // Default to words
      return splitIntoWords(currentText).map((word, wIndex) => (
        <motion.div
          key={wIndex}
          className={cn("text-rotate-element", elementLevelClassName)}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={{
            ...transition,
            delay: getStaggerDelay(
              getStaggerIndex(wIndex, splitIntoWords(currentText).length),
              splitIntoWords(currentText).length
            ),
          }}
        >
          {word}
        </motion.div>
      ));
    }, [
      texts,
      currentTextIndex,
      splitBy,
      initial,
      animate,
      exit,
      transition,
      splitLevelClassName,
      elementLevelClassName,
    ]);

    function getStaggerDelay(index, total) {
      return index * staggerDuration;
    }

    function getStaggerIndex(index, total) {
      if (staggerFrom === "first") return index;
      if (staggerFrom === "last") return total - 1 - index;
      if (staggerFrom === "center") {
        const center = Math.floor(total / 2);
        return Math.abs(center - index);
      }
      if (staggerFrom === "random") {
        const randomIndex = Math.floor(Math.random() * total);
        return randomIndex;
      }
      return index;
    }

    const next = useCallback(() => {
      const nextIndex =
        currentTextIndex === texts.length - 1
          ? loop
            ? 0
            : currentTextIndex
          : currentTextIndex + 1;
      if (nextIndex !== currentTextIndex) {
        setCurrentTextIndex(nextIndex);
        onNext?.(nextIndex);
      }
    }, [currentTextIndex, texts.length, loop, onNext]);

    const jumpTo = useCallback((index) => {
      setCurrentTextIndex(index);
    }, []);

    const reset = useCallback(() => {
      setCurrentTextIndex(0);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        next,
        jumpTo,
        reset,
      }),
      [next, jumpTo, reset]
    );

    useEffect(() => {
      if (!auto) return;
      const intervalId = setInterval(next, rotationInterval);
      return () => clearInterval(intervalId);
    }, [next, rotationInterval, auto]);

    return (
      <motion.div
        className={cn("text-rotate", mainClassName)}
        {...props}
        layout
        transition={transition}
      >
        <span className="text-rotate-sr-only">{texts[currentTextIndex]}</span>
        <AnimatePresence
          mode={animatePresenceMode}
          initial={animatePresenceInitial}
        >
          <motion.div
            key={currentTextIndex}
            className={cn(
              splitBy === "lines"
                ? "text-rotate-lines"
                : "text-rotate-flex-wrap flex"
            )}
            layout
          >
            {elements}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }
);

RotatingText.displayName = "RotatingText";

export default RotatingText;
