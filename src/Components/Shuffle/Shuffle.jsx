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
  isRTL = false,
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

    const splitType = isRTL ? "words" : "chars";
    splitRef.current = new GSAPSplitText(el, { type: splitType });
    const items = splitRef.current[splitType] || [];

    wrappersRef.current = [];
    const rolls = Math.max(1, Math.floor(shuffleTimes));
    const rand = (set) =>
      set.charAt(Math.floor(Math.random() * set.length)) || "";

    items.forEach((item) => {
      const parent = item.parentElement;
      if (!parent) return;
      const w = item.getBoundingClientRect().width;
      if (!w) return;

      const wrap = document.createElement("span");
      wrap.className = "inline-block overflow-hidden align-baseline";
      Object.assign(wrap.style, { width: w + "px", display: "inline-block" });

      const inner = document.createElement("span");
      const originClass = isRTL ? "origin-right" : "origin-left";
      inner.className = `inline-block whitespace-nowrap will-change-transform ${originClass} transform-gpu`;
      inner.style.minHeight = item.getBoundingClientRect().height + 10 + "px";
      inner.style.minWidth = item.getBoundingClientRect().width + "px";

      inner.style.direction = isRTL ? "rtl" : "ltr";

      parent.insertBefore(wrap, item);
      wrap.appendChild(inner);

      const firstOrig = item.cloneNode(true);
      Object.assign(firstOrig.style, { width: w + "px" });
      item.setAttribute("data-orig", "1");
      Object.assign(item.style, { width: w + "px" });

      inner.appendChild(firstOrig);

      for (let k = 0; k < rolls; k++) {
        const c = item.cloneNode(true);
        if (!isRTL && scrambleCharset) c.textContent = rand(scrambleCharset);
        inner.appendChild(c);
      }

      inner.appendChild(item);

      let startX = 0;
      let startY = 0;
      switch (shuffleDirection) {
        case "top":
          startY = -50;
          break;
        case "bottom":
          startY = 50;
          break;
        case "left":
          startX = isRTL ? 50 : -50;
          break;
        case "right":
          startX = isRTL ? -50 : 50;
          break;
      }
      gsap.set(inner, { x: startX, y: startY, opacity: 0 });
      inner.setAttribute("data-final-x", "0");
      inner.setAttribute("data-final-y", "0");
      inner.setAttribute("data-start-x", startX);
      inner.setAttribute("data-start-y", startY);

      wrappersRef.current.push(wrap);
    });

    const play = () => {
      const inners = wrappersRef.current.map((w) => w.firstElementChild);
      if (!inners.length) return;

      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(inners, {
        x: 0,
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
  }, [
    text,
    duration,
    ease,
    shuffleTimes,
    animationMode,
    stagger,
    scrambleCharset,
    colorTo,
    fontsLoaded,
    shuffleDirection,
    isRTL,
  ]);

  const baseTw =
    "inline-block whitespace-normal break-words will-change-transform uppercase text-[4rem] leading-none";
  const classes = `${baseTw} ${
    ready ? "visible" : "invisible"
  } ${className}`.trim();
  const Tag = tag || "p";
  const commonStyle = { textAlign: textAlign, ...style };

  return React.createElement(
    Tag,
    { ref: ref, className: classes, style: commonStyle },
    text
  );
};

export default Shuffle;
