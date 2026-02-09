import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// --- 1. REUSABLE IMAGE POPUP COMPONENTS ---
const ImageModal = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-zoom-out"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <motion.img
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        src={src}
        alt="Full Screen"
        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain cursor-default"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

const ZoomableImage = ({ src, alt, onOpen, className }) => (
  <div
    className={`bg-slate-800 overflow-hidden relative cursor-zoom-in group ${className}`}
    onClick={() => onOpen(src)}
  >
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 z-10 flex items-center justify-center">
      <div className="opacity-0 group-hover:opacity-100 text-white bg-black/50 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm transition-opacity duration-300">
        Click to Expand
      </div>
    </div>
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
    />
  </div>
);

// --- 2. ANIMATED BIRD ---
const FlyingBird = () => {
  const [birdState, setBirdState] = useState("flying");

  useEffect(() => {
    let timer;
    if (birdState === "flying") {
      timer = setTimeout(() => setBirdState("waiting"), 15000);
    } else if (birdState === "waiting") {
      timer = setTimeout(() => setBirdState("flying"), 60000);
    } else if (birdState === "crashing") {
      timer = setTimeout(() => setBirdState("waiting"), 1000);
    }
    return () => clearTimeout(timer);
  }, [birdState]);

  const handleKill = () => {
    if (birdState === "flying") setBirdState("crashing");
  };

  return (
    <motion.div
      // FIX 1: Changed z-50 to z-0 so it stays behind the content but above background
      className="absolute top-[20vh] z-0 cursor-crosshair pointer-events-auto"
      onMouseDown={handleKill}
      initial={{ x: "-10vw", y: 0, rotate: 0, opacity: 1 }}
      animate={
        birdState === "flying"
          ? { x: "110vw", y: [0, -40], rotate: 0, opacity: 1 }
          : birdState === "crashing"
            ? { x: undefined, y: "80vh", rotate: 90, opacity: 1 }
            : { x: "-10vw", y: 0, rotate: 0, opacity: 0 }
      }
      transition={
        birdState === "flying"
          ? {
              x: { duration: 15, ease: "linear" },
              y: {
                duration: 0.4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "circOut",
              },
            }
          : birdState === "crashing"
            ? {
                y: { duration: 0.6, ease: "easeIn" },
                rotate: { duration: 0.2 },
              }
            : { duration: 0 }
      }
    >
      <img
        src="imgs/Bird_01.png"
        alt="Flapping Bird"
        className="w-16 h-12 md:w-20 md:h-16 pixelated drop-shadow-2xl select-none"
        style={{ imageRendering: "pixelated" }}
        draggable="false"
      />
    </motion.div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [hiddenTabs, setHiddenTabs] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  // FULL DATA
  const timelineData = [
    {
      id: 1,
      date: "Week 1 (Part 1)",
      image: "imgs/wk3_unity.png",
      reflection:
        "The Beginning: I spent the first week simply familiarizing myself with the Unity Interface, understanding the Scene view, Game view, and basic UI elements. I felt a bit overwhelmed by the complexity of the engine.",
    },
    {
      id: 2,
      date: "Week 1 (Part 2)",
      image: "imgs/wk3_unity.png",
      reflection:
        "The Decision: I didn't know what type of game to start with, but I thought 2D would be easier. I remembered the teacher mentioning 'Flappy Bird' and saw an Instagram post about a beginner dev making one. Action: I decided to follow a simple Flappy Bird tutorial just to start somewhere.",
    },
    {
      id: 3,
      date: "Week 3",
      image: "imgs/wk3_unity.png",
      reflection:
        "Learning the Basics: I followed YouTube tutorials closely. The coding logic was somewhat similar to what I'm used to (Python/C++), but I had to learn Unity-specifics like how to move, turn, and scale sprites using the Transform component.",
    },
    {
      id: 4,
      date: "Week 5",
      image: "imgs/wk5_tutorial.png",
      reflection:
        "Implementation: I gave the bird a hitbox and made the background scroll. The Logic: Following the tutorial, I learned that using Texture Offsets to move the image is much more optimal than moving the actual object, and it works perfectly for infinite scrolling.",
    },
    {
      id: 5,
      date: "Week 7",
      image: "imgs/wk7_tag.png",
      reflection:
        "Tagging System: I learned about Tags (Pipe, Ground) to tell the script when a collision should trigger Game Over. The Bug: I met a bug where the player could fly under the map. I realized this was caused by me forgetting to give the floor object the 'Obstacle' tag.",
    },
    {
      id: 6,
      date: "Week 9 (Part 1)",
      image: "imgs/wk9_gamestate.png",
      reflection:
        "The Pivot: I finished the tutorial but didn't know where to go next. Since Flappy Bird has zero replayability, I talked to a friend who suggested adding arcade elements like power-ups to make it more interesting. The Idea: Pivot from a clone to an 'Arcade' game.",
    },
    {
      id: 7,
      date: "Week 9 (Part 2)",
      image: "imgs/wk9_gamestat.png",
      reflection:
        "The Struggle: To achieve this, the tutorial code (hardcoded values) had to be changed. I had to 'freestyle' and rewrite the main GameManager. Trying new ideas was hard because I wasn't used to the syntax (e.g., C# Math) and didn't know which Object Classes to use.",
    },
    {
      id: 8,
      date: "Week 9 (Part 3)",
      image: "imgs/wk9_gamestate.png",
      reflection:
        "Modular Design: I made speed, player size, and gaps into variables that could be changed dynamically. Scriptable Objects: I learnt about Scriptable Objects that let me change variables from within the Unity Editor UI itself, making editing much easier.",
    },
    {
      id: 9,
      date: "Week 11",
      image: "imgs/items.png",
      reflection:
        "Item Logic: Added items using Scriptable Objects. I gave them images and stats they affect. The Goal: Force the player to make trade-offs (e.g., more money vs easier level) to survive the increasing difficulty. This adds randomness and makes every run unique.",
    },
    {
      id: 10,
      date: "Week 12-13",
      image: "imgs/wk11_health.png",
      reflection:
        "Balancing & Polish: I gave the player 3 Lives to help them out and added limits (clamping) to pipe gaps so they stay on screen. Feedback: Friends said it was still too hard, so I lowered the difficulty increase rate.",
    },
    {
      id: 11,
      date: "Week 13+ (Future)",
      image: "imgs/items.png",
      reflection:
        "Reflections: There were things I was too scared to try, such as shooting enemies or boss fights. However, I am proud that I moved from a basic tutorial to a fully functional, modular system.",
    },
  ];

  // Specific resource data with icons and actual URLs (Used in ResourcesPage)
  const resourceLinks = [
    {
      title: "Zigurous: How to make Flappy Bird in Unity",
      url: "https://www.youtube.com/watch?v=ihvBiJ1oC9U",
      type: "video",
    },
    {
      title: "GMTK: The Unity Tutorial For Complete Beginners",
      url: "https://www.youtube.com/watch?v=XtQMytORBmM",
      type: "video",
    },
    {
      title: "Code Monkey: Scriptable Objects Guide",
      url: "https://www.youtube.com/watch?v=7jxS8HIny3Q",
      type: "video",
    },
    {
      title: "Unity Official Documentation",
      url: "https://docs.unity3d.com/ScriptReference/",
      type: "doc",
    },
  ];

  const handleCloseTab = (e, page) => {
    e.stopPropagation();
    setHiddenTabs((prev) => [...prev, page]);
    if (currentPage === page) setCurrentPage("home");
    setTimeout(() => {
      setHiddenTabs((prev) => prev.filter((t) => t !== page));
    }, 2000);
  };

  // --- COMPONENTS ---

  const HomePage = () => (
    <div className="min-h-screen py-16 px-4 pointer-events-none">
      <div className="max-w-6xl w-full mx-auto relative z-10 space-y-24 pointer-events-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/70 backdrop-blur-md p-10 rounded-3xl border border-slate-700/50 shadow-2xl text-center"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            Simple Game Development Journey
          </h1>
          <p className="text-xl text-blue-300 font-medium uppercase tracking-widest">
            Guided Learning Project by Ahnaf Sufi
          </p>
        </motion.div>

        {/* ROW 1: Play/Download (Left) | Image (Right) */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Text/Action Side */}
          <div className="flex-1 w-full">
            <h2 className="text-3xl font-bold text-white mb-6 pl-4 border-l-4 border-blue-500">
              Play the Game
            </h2>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8"
            >
              <p className="text-slate-200 mb-8 text-lg">
                Experience the evolution of a simple Flappy Bird clone into a
                fully modular Arcade System. This Windows build features the
                final mechanics including the Shop, Currency, and Health
                systems.
              </p>

              <motion.a
                href="https://drive.google.com/file/d/1YKuYd_WipEtF2z-T0PsjJb0RDI3OQB11/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-blue-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-blue-500 hover:shadow-blue-500/20 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Build
              </motion.a>
              <p className="text-slate-500 text-sm mt-3 ml-1">
                Hosted on Google Drive (Windows .exe)
              </p>
            </motion.div>
          </div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 w-full"
          >
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex items-center justify-center">
              <ZoomableImage
                src="imgs/wk3_unity.png"
                alt="Game Screenshot 1"
                onOpen={setModalImage}
                className="w-full h-64 rounded-xl shadow-lg border border-slate-700/50"
              />
            </div>
          </motion.div>
        </div>

        {/* ROW 2: Image (Left) | Summary (Right) */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          {/* Text Side */}
          <div className="flex-1 w-full">
            <h2 className="text-3xl font-bold text-white mb-6 pl-4 border-l-4 border-blue-500">
              Quick Summary
            </h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8"
            >
              <p className="text-slate-200 leading-relaxed text-lg">
                I'm Ahnaf Sufi, a student with zero prior game development
                experience. Driven by curiosity about how my favorite games
                work, I embarked on this guided learning journey. Starting with
                a basic Flappy Bird tutorial, I challenged myself to go
                further—building a full arcade system with randomized shops, a
                currency economy, and scaling difficulty. This project
                represents my first steps into turning creative ideas into
                playable reality.
              </p>
            </motion.div>
          </div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex-1 w-full"
          >
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex items-center justify-center">
              <ZoomableImage
                src="imgs/wk9_gamestate.png"
                alt="Game Screenshot 2"
                onOpen={setModalImage}
                className="w-full h-64 rounded-xl shadow-lg border border-slate-700/50"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="min-h-screen py-16 px-4 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <motion.h1
          className="text-4xl font-bold text-center text-white mb-16 drop-shadow-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Project Documentation
        </motion.h1>

        <div className="space-y-24">
          {/* Row 1: Text Left, Circle Image Right */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 w-full">
              <h2 className="text-3xl font-bold text-white mb-6 pl-4 border-l-4 border-blue-500">
                About Me
              </h2>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8"
              >
                <p className="text-slate-200 leading-relaxed text-lg">
                  Hello! I am Ahnaf Sufi Putera Suratman (2401541D). To be
                  completely honest, before this module, I had absolutely zero
                  experience in game development. I had never touched a game
                  engine or written a single line of C# code. But like most
                  people, I grew up playing games. I was always the person with
                  a million ideas in my head—mechanics I thought would be cool,
                  themes I wanted to explore—but I never actually touched them.
                  I never thought I could make them real. This portfolio
                  documents my journey of finally taking that step: turning
                  years of curiosity into my first working game.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 w-full flex justify-center md:justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 animate-pulse"></div>
                <img
                  src="imgs/me.png"
                  alt="Profile"
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-2xl border-4 border-slate-700/50 relative z-10"
                />
              </div>
            </motion.div>
          </div>

          {/* Row 2: Image Left, Text Right */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 w-full">
              <h2 className="text-3xl font-bold text-white mb-6 pl-4 border-l-4 border-blue-500">
                About the Project
              </h2>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8"
              >
                <p className="text-slate-200 leading-relaxed text-lg">
                  If you ask me why I chose this specific project, the answer is
                  simple: Curiosity. I wanted to bridge the gap between being a
                  player and a creator. I started with a standard Flappy Bird
                  tutorial just to get my feet wet, but as I coded, I found
                  myself asking "Why?". I didn't want to just copy code; I
                  wanted to understand the logic behind it. That curiosity
                  spiraled into something bigger. I ended up pivoting completely
                  from a simple clone to a full Arcade system. I refactored the
                  entire codebase to support Game States, built a currency
                  economy, and added randomized power-ups. It wasn't just about
                  finishing an assignment anymore; it was about satisfying the
                  itch to see how far I could push a simple concept.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 w-full"
            >
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex items-center justify-center">
                <img
                  src="imgs/wk9_gamestate.png"
                  alt="Project Scope"
                  className="rounded-xl w-full object-cover max-h-[350px] shadow-lg"
                />
              </div>
            </motion.div>
          </div>

          {/* Reflections Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-10"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Reflections (PPMR)
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                {
                  label: "PLAN",
                  text: "Establish a foundation in Unity and move away from a simple clone.",
                },
                {
                  label: "PERFORM",
                  text: "The pivot from hardcoded values to modular GameManager was the biggest challenge.",
                },
                {
                  label: "MONITOR",
                  text: "Peer reviews revealed the game was too hard, leading to the 3-Heart system.",
                },
                {
                  label: "REFLECT",
                  text: "Choosing to innovate on mechanics tested my logic more than a simple clone.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 bg-slate-800/80 border border-slate-600 rounded-xl hover:border-blue-500 transition-colors"
                >
                  <strong className="text-blue-400 block mb-2 text-lg tracking-wider">
                    {item.label}
                  </strong>
                  <span className="text-slate-300 text-lg">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  const ProgressPage = () => {
    const timelineRef = useRef(null);
    const isInView = useInView(timelineRef, { once: false, amount: 0.1 });

    return (
      <div className="min-h-screen py-16 px-4 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-4xl font-bold text-center text-white mb-16 drop-shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Development Timeline
          </motion.h1>

          <div ref={timelineRef} className="relative max-w-6xl mx-auto">
            <div className="relative pb-10">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-slate-700/80 z-0 top-0 rounded-full"></div>

              {timelineData.map((item, index) => (
                <motion.div
                  id={`timeline-item-${item.id}`}
                  key={item.id}
                  className={`mb-24 flex flex-col md:flex-row relative z-10 ${
                    index % 2 === 0 ? "md:items-start" : "md:items-end"
                  }`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  // FIX 2: Reduced amount to 0.1 so first items appear easily
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-4 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20 items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>

                  <div
                    className={`w-full md:w-5/12 ${
                      index % 2 === 0 ? "md:ml-auto md:pr-12" : "md:pl-12"
                    }`}
                  >
                    <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 overflow-hidden hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 group pointer-events-auto">
                      <ZoomableImage
                        src={item.image}
                        alt={item.date}
                        onOpen={setModalImage}
                      />
                      <div className="p-8">
                        <div className="flex flex-col gap-2 mb-4 items-start text-left">
                          <span className="text-xs font-bold text-blue-200 bg-blue-900/50 border border-blue-500/30 px-4 py-1.5 rounded-full uppercase tracking-wider">
                            {item.date}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-lg text-left">
                          {item.reflection}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              className="mt-20 bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-10 relative z-20 pointer-events-auto"
            >
              <h2 className="text-3xl font-bold text-center text-white mb-12">
                Game Implementation Comparison
              </h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-semibold text-center text-blue-300 mb-6">
                    Initial Tutorial Game
                  </h3>
                  <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                    <video
                      controls
                      className="w-full aspect-video bg-black object-cover"
                      src="imgs/old.mp4"
                      type="video/mp4"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <p className="text-center text-slate-400 mt-4 text-sm">
                    Basic clone following standard tutorial.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-center text-blue-300 mb-6">
                    After New Logic
                  </h3>
                  <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                    <video
                      controls
                      className="w-full aspect-video bg-black object-cover"
                      src="imgs/new.mp4"
                      type="video/mp4"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <p className="text-center text-slate-400 mt-4 text-sm">
                    Randomized shops, heart system, and increasing difficulty.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  // --- REPLACED CONTACT PAGE WITH RESOURCES PAGE ---
  const ResourcesPage = () => (
    <div className="min-h-screen py-16 px-4 pointer-events-none">
      <div className="max-w-6xl w-full mx-auto relative z-10 pointer-events-auto">
        <motion.h1
          className="text-4xl font-bold text-center text-white mb-16 drop-shadow-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Contract & Resources
        </motion.h1>

        {/* 2-Column Grid for Contract & Resource List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Card 1: Learning Contract */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-10 border border-slate-700/50 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-blue-400 mb-6 border-b border-slate-700 pb-4">
                My Learning Contract
              </h2>
              <div className="space-y-4 text-slate-300 mb-8">
                <p>
                  <strong className="text-white">Goal:</strong> Develop "Flappy
                  Bird Evolution" — an expanded arcade version of the classic
                  game.
                </p>
                <p>
                  <strong className="text-white">Attributes:</strong>{" "}
                  Inquisitive, Critical Thinking, Innovative.
                </p>
              </div>
            </div>

            <motion.a
              href="2401541D_Ahnaf_Sufi_Learning_Contract.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              View Contract
            </motion.a>
          </motion.div>

          {/* Card 2: Resources Consulted */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-10 border border-slate-700/50 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-blue-400 mb-6 border-b border-slate-700 pb-4">
              Resources Consulted
            </h2>
            <ul className="space-y-4">
              {resourceLinks.map((link, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">
                    {link.type === "video" ? "📺" : "📘"}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-blue-300 transition-colors hover:underline"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-3 pt-2 border-t border-slate-700/50 mt-2">
                <span className="text-green-500 mt-1">👥</span>
                <span className="text-slate-400 italic">
                  Peer Consultation: <strong>Ashveen Dev Menon</strong>
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-100 bg-slate-950 relative selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background */}
      <div
        className="absolute top-0 left-0 w-full h-[120vh] z-0 pointer-events-none"
        style={{
          backgroundImage: "url('imgs/Background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/70"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-slate-950"></div>
      </div>

      <FlyingBird />

      <AnimatePresence>
        {modalImage && (
          <ImageModal src={modalImage} onClose={() => setModalImage(null)} />
        )}
      </AnimatePresence>

      {/* FIXED NAV BAR with Name */}
      <nav className="fixed top-0 w-full z-50 bg-[#1e293b]/90 backdrop-blur-xl border-b border-black/50 shadow-2xl pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-end">
            {/* NAME LABEL (Top Left) */}
            <div className="absolute left-4 top-1.5 flex items-center text-blue-400 font-mono text-xs gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-default">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <span className="font-semibold text-slate-300 ml-1">
                Ahnaf Sufi
              </span>
            </div>

            <div className="flex space-x-1 pb-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {["home", "about", "progress", "resources"].map((page) => {
                if (hiddenTabs.includes(page)) return null;
                const isActive = currentPage === page;

                // Formatting tab names
                let pageName = "";
                if (page === "home") pageName = "Overview.tsx";
                else if (page === "progress") pageName = "Timeline.tsx";
                else
                  pageName =
                    page.charAt(0).toUpperCase() + page.slice(1) + ".tsx";

                return (
                  <motion.div
                    key={page}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`group flex items-center px-3 py-2 rounded-t-md font-medium text-sm relative transition-colors cursor-pointer border-r border-slate-700/50 min-w-[120px] justify-between ${
                      isActive
                        ? "text-white bg-[#0f172a] border-t-2 border-t-blue-500"
                        : "text-slate-400 bg-[#2d3748] hover:bg-[#374151]"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    <span className="mr-2 truncate">{pageName}</span>
                    <button
                      onClick={(e) => handleCloseTab(e, page)}
                      className={`p-0.5 rounded-md hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-all ${
                        isActive ? "opacity-100" : ""
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Side Stats */}
            <div className="hidden sm:flex ml-auto items-center text-slate-500 font-mono text-xs gap-4 px-4 pb-3">
              <span>Ln 11, Col 45</span>
              <span>UTF-8</span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> React
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Padding for Fixed Header */}
      <main className="flex-grow relative z-10 pointer-events-none pb-12 pt-24">
        <AnimatePresence mode="wait">
          {hiddenTabs.length === 4 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[80vh] flex flex-col items-center justify-center text-slate-200 bg-slate-900/50 backdrop-blur-sm rounded-xl m-10 pointer-events-auto"
            >
              <div
                className="w-24 h-24 mb-4 opacity-50 bg-center bg-no-repeat rounded-full border-4 border-slate-500"
                style={{
                  backgroundImage: "url('imgs/me.png')",
                  backgroundSize: "cover",
                }}
              ></div>
              <p>No files open</p>
              <p className="text-sm mt-2 opacity-50">
                Wait for auto-recovery...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentPage === "home" && <HomePage />}
              {currentPage === "about" && <AboutPage />}
              {currentPage === "progress" && <ProgressPage />}
              {currentPage === "resources" && <ResourcesPage />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 w-full z-50 bg-[#0f172a] text-blue-500 py-1 px-4 border-t border-blue-900 flex justify-between text-xs font-mono pointer-events-auto">
        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer flex items-center gap-1">
            <span className="text-sm">⊗</span> 0
          </span>
          <span className="hover:text-white cursor-pointer flex items-center gap-1">
            <span className="text-sm">⚠</span> 0
          </span>
        </div>
        <div className="flex gap-4 text-slate-400">
          <span>Run Build Task</span>
          <span>Prettier</span>
          <span className="text-white">Go Live</span>
        </div>
      </footer>
    </div>
  );
}
