import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, ArrowRight, Play, CirclePause } from 'lucide-react';

import ProgressRing from '../components/ProgressRing';
import ProgressLine from '../components/ProgressLine';
import SessionCountGraph from '../components/SessionCountGraph';

function PomodoroTimer({
    settings,
    setSettings,
    isRunning,
    setIsRunning,
    activeTab,
    setActiveTab,
    isMouseActive,
    animate,
    userRecord, setUserRecord
}) {

    const calledRef = useRef(false);
    const [backgroundColor, setBackgroundColor] = useState("bgPomodoro")



    const bgColor = settings.bgColor;
    const bgBreakColor = settings.bgBreakColor;
    const bgLongBreak = settings.bgLongBreak;
    const workTime = settings.workTime;
    const shortBreak = settings.shortBreak;
    const longBreak = settings.longBreak;
    const longBreakInterval = settings.longBreakInterval;
    const autoBreak = settings.autoBreak;
    const notificationOn = settings.notificationOn;
    const notificationTime = settings.notificationTime;
    const subFont = settings.subFont;

    const autoLongBreak = settings.autoLongBreak;
    const focusMode = settings.focusMode;


    const [timeLeft, setTimeLeft] = useState(workTime * 60);
    const [mode, setMode] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);
    const [sessionCount, setSessionCount] = useState(() => {
        const storedRecord = JSON.parse(localStorage.getItem("userRecord"));
        const today = new Date().toDateString();

        if (storedRecord && storedRecord.date === today) {
            return storedRecord.sessionCount;  // ✅ keep today's count
        } else {
            // reset for a new day
            const newRecord = { sessionCount: 0, date: today };
            localStorage.setItem("userRecord", JSON.stringify(newRecord));
            return 0;
        }
    });

    const [shouldStop, setShouldStop] = useState(false);
    
    const pomodoroTime = workTime * 60;
    const shortBreakTime = shortBreak * 60;
    const longBreakTime = longBreak * 60
    const timerSize = 360;

    // Calculate progress percentage
    const totalTime =
        backgroundColor === 'bgPomodoro'
            ? pomodoroTime
            : backgroundColor === 'bgShortBreak'
                ? shortBreakTime
                : longBreakTime;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    // Sound Button
    const playSound = (src) => {
        const audio = new Audio(src);
        audio.volume = settings.notificationVolume;
        audio.play();
    }

    // Counting
    useEffect(() => {
    const today = new Date().toDateString();

    // Check if we already have a record
    const storedRecord = JSON.parse(localStorage.getItem("userRecord"));

    if (storedRecord) {
        // If the date is different from today, reset session count
        if (storedRecord.date !== today) {
            const newRecord = { sessionCount: 0, date: today };
            setUserRecord(newRecord);
            localStorage.setItem("userRecord", JSON.stringify(newRecord));
        } else {
            // Otherwise, keep today's record
            setUserRecord(storedRecord);
        }
    } else {
        // Initialize if no record exists
        const newRecord = { sessionCount: 0, date: today };
        setUserRecord(newRecord);
        localStorage.setItem("userRecord", JSON.stringify(newRecord));
    }
}, []);

// Save session count whenever it changes
useEffect(() => {
    if (sessionCount > 0) {
        const today = new Date().toDateString();
        const updatedRecord = { sessionCount, date: today };
        setUserRecord(updatedRecord);
        localStorage.setItem("userRecord", JSON.stringify(updatedRecord));
    }
}, [sessionCount]);


    // timer states handler
    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev === 0 && !calledRef.current) {
                        timeHandler();
                        calledRef.current = true;
                        return prev
                    }
                    return prev - 1;
                })
            }, 1000)
        }


        return () => {
            clearInterval(timer)
            calledRef.current = false;
        };

    }, [isRunning, mode])

    useEffect(() => {
        const timeMap = {
            bgPomodoro: workTime * 60,
            bgShortBreak: shortBreak * 60,
            bgLongBreak: longBreak * 60,
        };

        if (timeMap[backgroundColor] !== undefined) {
            setTimeLeft(timeMap[backgroundColor]);
        }
    }, [workTime, shortBreak, longBreak, backgroundColor]);

    // Notification
    useEffect(() => {
        if (notificationOn) {
            if (timeLeft === notificationTime && backgroundColor == 'bgPomodoro') {
                notify(`${notificationTime} seconds left!`)
                playSound('/remindernotification2.mp3');
            }
            if (timeLeft === 0 && backgroundColor == 'bgPomodoro') {
                notify("Time's up!")
                playSound('/finishtime.mp3');
            }
        }

    }, [timeLeft])

// Update document title dynamically
useEffect(() => {
  if (backgroundColor === "bgPomodoro") {
    document.title = isRunning
      ? `⏱ Focus Time - ${formatTime(timeLeft)}`
      : "Pomodoro - Paused";
  } else if (backgroundColor === "bgShortBreak") {
    document.title = `☕ Short Break - ${formatTime(timeLeft)}`;
  } else if (backgroundColor === "bgLongBreak") {
    document.title = `🌴 Long Break - ${formatTime(timeLeft)}`;
  }
}, [backgroundColor, timeLeft, isRunning]);



const timeHandler = () => {
  if (mode === "pomodoro") {
    // Pomodoro finished → increase counts
    const newSessionCount = sessionCount + 1;
    const newCycleCount = cycleCount + 1;

    setSessionCount(newSessionCount);
    setCycleCount(newCycleCount);

    playSound("/startnotification2.mp3");

    

    // Determine next mode
    if (newCycleCount % longBreakInterval === 0) {
      // Time for long break
      setMode("longBreak");
      setTimeLeft(longBreakTime);
      setBackgroundColor("bgLongBreak");
      if (!autoLongBreak) setShouldStop(true);
      console.log(cycleCount)
    } else {
      // Time for short break
      setMode("shortBreak");
      setTimeLeft(shortBreakTime);
      setBackgroundColor("bgShortBreak");
      if (!autoBreak) setShouldStop(true);
      console.log("short break");
    }
  } else if (mode === 'longBreak') {
    setCycleCount(0);
    setMode("pomodoro");
    setTimeLeft(pomodoroTime);
    setBackgroundColor("bgPomodoro");
    playSound("/startnotification2.mp3");
    console.log("long break ended → reset cycle");
  } else {
    // A break just ended → go back to pomodoro
    setMode("pomodoro");
    setTimeLeft(pomodoroTime);
    setBackgroundColor("bgPomodoro");
    if(cycleCount !== 0) {
      playSound("/startnotification2.mp3");
    }
    if (!settings.autoStartPomodoro) setShouldStop(true);
    console.log("back to pomodoro");
  }
};

  useEffect(() => {
    if (shouldStop) {
      setIsRunning(false);
      setShouldStop(false); // reset the flag
    }
  }, [shouldStop, setIsRunning]);

    const startButton = () => {

        if (cycleCount == 0 && backgroundColor == 'bgPomodoro') {
            timeHandler();
        }
        playSound('/start22.mp3');
        setIsRunning(true);

    }

    const pauseButton = () => {
        setIsRunning(false);
        playSound('/pause22.mp3');
    }

    const resetButton = () => {
        setIsRunning(false)
        if (backgroundColor == 'bgPomodoro') {
            setTimeLeft(pomodoroTime);
        } else if (backgroundColor == 'bgShortBreak') {
            setTimeLeft(shortBreakTime);
        } else {
            setTimeLeft(longBreakTime);
        }
    }

    const pomodoroButton = () => {
        setTimeLeft(pomodoroTime);
        setBackgroundColor('bgPomodoro')
    }
    const shortBreakButton = () => {
        setTimeLeft(shortBreakTime)
        setBackgroundColor('bgShortBreak')

        setMode('pomodoro')
        console.log('shortbreak')
    }

    const longBreakButton = () => {
        setTimeLeft(longBreakTime);
        setBackgroundColor('bgLongBreak')
        setMode('pomodoro')
    }

    const nextButton = () => {

        timeHandler();

    }

    const notify = (message) => {
        if (Notification.permission === 'granted') {
            new Notification("Pomodoro Timer", { body: message });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    new Notification("Pomodoro Timer", { body: message });
                }
            })
        }
    }

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }
    return (
        <div>
            <div className={`${animate ? 'animate-fade-in-up delay-1000' : ""}`}>
                <div className="" >
                    {/* Set timer buttons */}
                    
                    <div className="flex justify-center gap-3 mb-10">
                        {/* Pomodoro Button */}
                        <button
                            onClick={pomodoroButton}
                            className={`fade-box ${isMouseActive ? '' : 'fade'} z-10 relative
      ${backgroundColor === 'bgPomodoro' ? 'bg-white/30 shadow-md' : 'bg-white/20 shadow-sm'}
      text-white text-sm rounded-lg px-4 py-2 cursor-pointer
      transition-all duration-300 hover:bg-white/30 hover:scale-105 active:scale-95
      backdrop-blur-sm`}
                            style={{ fontFamily: subFont }}
                        >
                            Pomodoro
                        </button>

                        {/* Short Break Button */}
                        <button
                            onClick={shortBreakButton}
                            className={`fade-box ${isMouseActive ? '' : 'fade'} z-10 relative
      ${backgroundColor === 'bgShortBreak' ? 'bg-white/30 shadow-md' : 'bg-white/20 shadow-sm'}
      text-white text-sm rounded-lg px-4 py-2 cursor-pointer
      transition-all duration-300 hover:bg-white/30 hover:scale-105 active:scale-95
      backdrop-blur-sm`}
                            style={{ fontFamily: subFont }}
                        >
                            Short Break
                        </button>

                        {/* Long Break Button */}
                        <button
                            onClick={longBreakButton}
                            className={`fade-box ${isMouseActive ? '' : 'fade'} z-10 relative
      ${backgroundColor === 'bgLongBreak' ? 'bg-white/50 shadow-md' : 'bg-white/20 shadow-sm'}
      text-white text-sm rounded-lg px-4 py-2 cursor-pointer
      transition-all duration-300 hover:bg-white/30 hover:scale-105 active:scale-95
      backdrop-blur-sm`}
                            style={{ fontFamily: subFont }}
                        >
                            Long Break
                        </button>
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                         w-[100%] h-[120%] bg-black/10 blur-2xl rounded-full -z-10"></span>
                    </div>


                    {/* Progress Ring */}
                    <div className="flex justify-center items-center relative">
                        {settings.progressStyle === "ring" ? (
                            // === RING MODE ===
                            <div className="relative">
                                <ProgressRing
                                    progress={progress}
                                    size={timerSize}
                                    strokeWidth={12}
                                    color={
                                        backgroundColor === "bgPomodoro"
                                            ? bgColor
                                            : backgroundColor === "bgShortBreak"
                                                ? bgBreakColor
                                                : bgLongBreak
                                    }
                                    className="mx-auto drop-shadow-2xl"
                                />

                                {/* Overlay text centered inside ring */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="mb-2 flex justify-center text-white" style={{ fontFamily: subFont }}>
                                        {backgroundColor === "bgPomodoro"
                                            ? "Focus Time"
                                            : backgroundColor === "bgShortBreak"
                                                ? "Break Time"
                                                : "Long Break"}
                                    </p>

                                    <div
                                        className="text-8xl mb-3 drop-shadow-sm text-white"
                                        style={{
                                            fontFamily: settings.fontStyle,
                                            fontFeatureSettings: "'tnum'",
                                            fontVariantNumeric: "tabular-nums",
                                            lineHeight: 1.4,
                                            fontWeight: "Bold",
                                        }}
                                    >
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // === LINE MODE ===
                            <div className="flex flex-col items-center ">
                                {/* Text + Timer ABOVE line */}
                                <div className="text-center">
                                    <p className="mb-2 text-white" style={{ fontFamily: subFont }}>
                                        {backgroundColor === "bgPomodoro"
                                            ? "Focus Time"
                                            : backgroundColor === "bgShortBreak"
                                                ? "Break Time"
                                                : "Take your Long Break"}
                                    </p>

                                    <div
                                        className="text-8xl mb-1 drop-shadow-sm text-white"
                                        style={{
                                            fontFamily: settings.fontStyle,
                                            fontFeatureSettings: "'tnum'",
                                            fontVariantNumeric: "tabular-nums",
                                            lineHeight: 1.4,
                                            fontWeight: "Bold",
                                        }}
                                    >
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>

                                {/* Line progress BELOW text */}
                                <ProgressLine
                                    progress={progress}
                                    width={timerSize}  // 🔑 same as ring size
                                    height={4}
                                    color={
                                        backgroundColor === "bgPomodoro"
                                            ? bgColor
                                            : backgroundColor === "bgShortBreak"
                                                ? bgBreakColor
                                                : bgLongBreak
                                    }
                                    className="rounded-lg shadow-lg"
                                />
                            </div>
                        )}
                    </div>


                    {/* Long Break count */}
                    <div className='mt-3 flex justify-center'>
                        <SessionCountGraph count={cycleCount} longBreakInterval={longBreakInterval} />
                    </div>

                    {/* Start Buttons */}
                    <div className={`boxfade ${isMouseActive ? '' : 'box'}`}>
                        <div className="flex justify-center mt-10">
                            <div className="flex gap-3">
                              {/* Reset button */}
                                {isRunning && (
                                    <div className="bg-white/20 flex justify-center px-4 py-2 rounded-lg shadow-md 
                                                            transition-all duration-300 hover:bg-white/30 hover:scale-110 active:scale-95">
                                        <button
                                            onClick={resetButton}
                                            className="text-white cursor-pointer"
                                        >
                                            <RotateCcw />
                                        </button>
                                    </div>
                                )}

                                {/* Start / Pause button */}
                                <button
                                    onClick={isRunning ? pauseButton : startButton}
                                    className="relative px-5 py-3 rounded-2xl cursor-pointer font-medium
    text-white transition-all duration-300 ease-in-out
    bg-white/30 border border-white/25 backdrop-blur-2xl
    shadow-[0_4px_30px_rgba(255,255,255,0.1)]
    hover:bg-white/25 hover:shadow-[0_6px_40px_rgba(255,255,255,0.15)]
    hover:scale-105 active:scale-95
                                                "
                                >
                                    {isRunning ? <CirclePause size={32} /> : <Play size={32} />}
                                </button>

                                {/* Next button */}
                                {isRunning && (
                                    <div className="bg-white/20 flex justify-center px-4 py-2 rounded-lg shadow-md
                                                            transition-all duration-300 hover:bg-white/30 hover:scale-110 active:scale-95">
                                        <button
                                            onClick={nextButton}
                                            className="text-white cursor-pointer"
                                        >
                                            <ArrowRight />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* <div className='text-center mt-3 text-white'>
                            <p className='text-sm'>Session count: {sessionCount}</p>
                        </div> */}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PomodoroTimer