"use client"
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "./components/ui/hero-highlight";
import { TypewriterEffectSmooth } from "./components/ui/typewriter-effect";
import Link from "next/link";

export default function Home() {
  const words = [
    {
      text: "Eduscheduler",
      className: "text-blue-500",
    },
    {
      text: "automated",
      className: "text-white",
    },
    {
      text: "scheduling",
      className: "text-white",
    },
    {
      text: "solutions",
      className: "text-white",
    }
  ];
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        <div className="flex flex-col items-center justify-center h-[40rem]  ">
          <TypewriterEffectSmooth words={words} />
          <div className="text-xs">"Streamline your academic scheduling with our intelligent timetable generator. Effortlessly create customized, conflict-free schedules for students, faculty, and departments, designed to simplify your university's workflow."</div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
            <Link href="/forms/signin">
            <button className="w-40 h-10 hover:bg-slate-300 rounded-xl bg-white text-black border border-black  text-base">
              Signup
            </button>
            </Link>
          </div>
        </div>
        
      </motion.h1>
    </HeroHighlight>
  );
}
