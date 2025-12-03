import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

const Shuffle = ({
  text,
  className = "",
  style = {},
  shuffleDirection = "top",
  duration = 0.35,
  ease = "power3.out",
  shuffleTimes = 5,
  animationMode = "all",
  stagger = 0.03,
  scrambleCharset = "",
  colorTo,
  tag = "p",
  textAlign = "center",
}) => {
  const ref = useRef(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const splitRef = useRef(null);
  const wrappersRef = useRef([]);
  const tlRef = useRef(null);

  useEffect(() => {
    if ("fonts" in document) {
      if (document.fonts.status === "loaded") setFontsLoaded(true);
      else document.fonts.ready.then(() => setFontsLoaded(true));
    } else setFontsLoaded(true);
  }, []);

  useEffect(() => {
    if (!ref.current || !text || !fontsLoaded) return;

    const el = ref.current;

    // Build chars
    splitRef.current = new GSAPSplitText(el, { type: "chars" });
    const chars = splitRef.current.chars || [];

    wrappersRef.current = [];
    const rolls = Math.max(1, Math.floor(shuffleTimes));
    const rand = (set) =>
      set.charAt(Math.floor(Math.random() * set.length)) || "";

    chars.forEach((ch) => {
      const parent = ch.parentElement;
      if (!parent) return;
      const w = ch.getBoundingClientRect().width;
      if (!w) return;

      const wrap = document.createElement("span");
      wrap.className = "inline-block overflow-hidden align-baseline text-left";
      Object.assign(wrap.style, { width: w + "px" });

      const inner = document.createElement("span");
      inner.className =
        "inline-block whitespace-nowrap will-change-transform origin-left transform-gpu";

      parent.insertBefore(wrap, ch);
      wrap.appendChild(inner);

      const firstOrig = ch.cloneNode(true);
      Object.assign(firstOrig.style, { width: w + "px" });

      ch.setAttribute("data-orig", "1");
      Object.assign(ch.style, { width: w + "px" });

      inner.appendChild(firstOrig);

      for (let k = 0; k < rolls; k++) {
        const c = ch.cloneNode(true);
        if (scrambleCharset) c.textContent = rand(scrambleCharset);
        inner.appendChild(c);
      }

      inner.appendChild(ch);

      let startY = shuffleDirection === "top" ? -50 : 50;
      gsap.set(inner, { y: startY, opacity: 0 });
      inner.setAttribute("data-final-y", "0");
      inner.setAttribute("data-start-y", startY);

      wrappersRef.current.push(wrap);
    });

    // Play animation loop
    const play = () => {
      const inners = wrappersRef.current.map((w) => w.firstElementChild);
      if (!inners.length) return;

      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(inners, {
        y: 0,
        opacity: 1,
        color: colorTo,
        duration,
        ease,
        stagger: animationMode === "evenodd" ? stagger : 0,
      });

      tlRef.current = tl;
      setReady(true);
    };

    play();

    return () => {
      tlRef.current?.kill();
    };
  }, [text,
    duration,
    ease,
    shuffleTimes,
    animationMode,
    stagger,
    scrambleCharset,
    colorTo,
    fontsLoaded,
  ]);

  const baseTw =
    "inline-block whitespace-normal break-words will-change-transform uppercase text-[4rem] leading-none";
  const classes = `${baseTw} ${
    ready ? "visible" : "invisible"
  } ${className}`.trim();
  const Tag = tag || "p";
  const commonStyle = { textAlign, ...style };

  return React.createElement(
    Tag,
    { ref: ref, className: classes, style: commonStyle },
    text
  );
};

export default Shuffle;
