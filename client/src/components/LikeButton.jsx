import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { useUser, useClerk } from '@clerk/react';
import { showBanner } from './AnnouncementBanner';
import {
  animate,
  AnimatePresence,
  motion,
} from "framer-motion";

const EASE_OUT = [0.23, 1, 0.32, 1];
const SQUASH = { duration: 0.1, ease: EASE_OUT };
const POP = { type: "spring", stiffness: 500, damping: 20 };
const POP_VELOCITY = 11;
const DIP = { type: "spring", stiffness: 500, damping: 30 };
const DIP_VELOCITY = -3;
const SETTLE = { type: "spring", duration: 0.3, bounce: 0 };
const PARTICLES = 7;
const BURST = { duration: 0.45, ease: EASE_OUT };
const BURST_DELAY = 0.04;

function rollBurst(id) {
  const offset = Math.random() * 360;
  return {
    id,
    particles: Array.from({ length: PARTICLES }, (_, i) => ({
      angle: offset + (i * 360) / PARTICLES + (Math.random() - 0.5) * 20,
      distance: 18 + Math.random() * 6,
      size: Math.random() < 0.5 ? 4 : 3,
    })),
  };
}

export function LikeButton({
  liked,
  count,
  onLikedChange,
  className = "",
}) {
  const reduceMotion = false;
  const heart = useRef(null);
  const scale = useRef(undefined);
  const pressed = useRef(false);
  const nextBurst = useRef(0);
  const [bursts, setBursts] = useState([]);

  useEffect(() => () => scale.current?.stop(), []);

  const scaleHeart = (to, transition) => {
    if (reduceMotion || !heart.current) return;
    scale.current = animate(heart.current, { scale: to }, transition);
  };

  const release = () => {
    if (!pressed.current) return;
    pressed.current = false;
    scaleHeart(1, SETTLE);
  };

  const toggle = () => {
    const next = !liked;
    const fromPointer = pressed.current;
    pressed.current = false;
    
    // If they already liked it, we do nothing based on user request "if I liked once it is done !!"
    // But we'll still call onLikedChange just in case we need to trigger sign in logic if not logged in.
    onLikedChange(next);

    if (reduceMotion) return;
    if (next) {
      scaleHeart(fromPointer ? 1 : [0.8, 1], {
        ...POP,
        velocity: POP_VELOCITY,
      });
      const burst = rollBurst(nextBurst.current++);
      setBursts((all) => [...all, burst]);
    } else if (fromPointer) {
      scaleHeart(1, SETTLE);
    } else {
      scaleHeart(1, { ...DIP, velocity: DIP_VELOCITY });
    }
  };

  return (
    <button
      type="button"
      aria-pressed={liked}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        pressed.current = true;
        scaleHeart(liked ? 0.9 : 0.8, SQUASH);
      }}
      onPointerLeave={release}
      onPointerCancel={release}
      onClick={toggle}
      className={`text-highlight group flex h-8 touch-manipulation items-center gap-2 rounded-full bg-bg-dark pr-4 pl-3.5 text-[14px] font-medium text-text-main shadow-lg outline-none transition-[scale] duration-150 ease-out select-none focus-visible:outline-2 focus-visible:outline-highlight active:scale-[0.96] border-2 border-border-main ${className}`}
    >
      <span className="relative flex h-[18px] w-[18px] items-center justify-center">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0">
          {bursts.map((burst) => (
            <BurstView
              key={burst.id}
              burst={burst}
              onDone={() =>
                setBursts((all) => all.filter((b) => b.id !== burst.id))
              }
            />
          ))}
        </span>
        <span ref={heart} className="relative block">
          <svg
            viewBox="0 0 24 24"
            className={`block h-[18px] w-[18px] fill-current transition-[color,fill-opacity] ease-out ${
              liked
                ? "text-purple-300 [fill-opacity:1] duration-150"
                : "text-text-dim [fill-opacity:0] duration-100 group-hover:text-text-main"
            }`}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </span>
      </span>
      <span className="text-text-dim">Likes</span>
      <Count
        value={count}
        direction={liked ? 1 : -1}
        reduceMotion={reduceMotion}
      />
    </button>
  );
}

function BurstView({ burst, onDone }) {
  return (
    <>
      <motion.span
        className="absolute inset-0 rounded-full border-[1.5px] border-red-500"
        initial={{ scale: 0.6, opacity: 0.6 }}
        animate={{ scale: 1.8, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      />
      {burst.particles.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const [cos, sin] = [Math.cos(rad), Math.sin(rad)];
        return (
          <motion.span
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full bg-red-500"
            style={{
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
            }}
            initial={{ x: cos * 6, y: sin * 6, scale: 1, opacity: 1 }}
            animate={{
              x: cos * p.distance,
              y: sin * p.distance,
              scale: 0.4,
              opacity: [1, 1, 0],
            }}
            transition={{
              ...BURST,
              delay: BURST_DELAY,
              opacity: { ...BURST, delay: BURST_DELAY, times: [0, 0.5, 1] },
            }}
            onAnimationComplete={i === 0 ? onDone : undefined}
          />
        );
      })}
    </>
  );
}

const ROLL = {
  enter: ({ direction, reduceMotion }) => ({
    y: reduceMotion ? "0%" : `${direction * 100}%`,
    opacity: 0,
  }),
  center: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
  exit: ({ direction, reduceMotion }) => ({
    y: reduceMotion ? "0%" : `${direction * -100}%`,
    opacity: 0,
    transition: { duration: 0.2, ease: EASE_OUT },
  }),
};

function Count({ value, direction, reduceMotion }) {
  const digits = String(value).split("");
  const custom = { direction, reduceMotion };
  return (
    <span aria-hidden="true" className="flex tabular-nums font-bold text-highlight">
      {digits.map((digit, i) => (
        <span
          key={digits.length - i}
          className="inline-grid overflow-hidden"
        >
          <AnimatePresence initial={false} custom={custom}>
            <motion.span
              key={digit}
              custom={custom}
              variants={ROLL}
              initial="enter"
              animate="center"
              exit="exit"
              className="col-start-1 row-start-1"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}


export default function LikeContainer() {
  const { user, isSignedIn, isLoaded } = useUser();
  const clerk = useClerk();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchLikes();
  }, [user]); // refetch when user changes

  const fetchLikes = async () => {
    try {
      const url = user ? `${API_URL}/api/likes?clerkUserId=${user.id}` : `${API_URL}/api/likes`;
      const res = await axios.get(url);
      setCount(res.data.total || 0);
      setLiked(res.data.hasLiked || false);
    } catch (err) {
      console.error("Error fetching likes", err);
    }
  };

  const handleLikeChange = async (nextLiked) => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      showBanner("Please sign in to like!", "error");
      clerk.openSignUp(); // Opens the Clerk sign-in modal
      return;
    }

    if (liked) {
      toast("You've already liked this!", { icon: '❤️' });
      return; // Already liked, do nothing based on "once liked it is done"
    }

    // Optimistic UI update
    setLiked(true);
    setCount(c => c + 1);

    try {
      await axios.post(`${API_URL}/api/likes`, { clerkUserId: user.id });
      // We could refetch to get the exact true count here if we wanted
    } catch (err) {
      console.error("Error liking", err);
      // Revert on error
      setLiked(false);
      setCount(c => c - 1);
      showBanner("Failed to save like", "error");
    }
  };

  return <LikeButton liked={liked} count={count} onLikedChange={handleLikeChange} />;
}





