import React, { useState, useEffect, useRef } from 'react'
import { RotateCcw, ArrowRight, Play, CirclePause } from 'lucide-react';

import ProgressRing from '../components/ProgressRing';
import ProgressLine from '../components/ProgressLine';
import SessionCountGraph from '../components/SessionCountGraph';

function PomodoroTimer({
    settings,
    isRunning,
    setIsRunning,
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

    const [sessionCount, setSessionCount] = useState(0);



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

    // Counting
    useEffect(() => {
        if (sessionCount > 0) {
            setUserRecord(prev => ({...prev, sessionCount}))
        }
    }, [sessionCount])


    const timeHandler = () => {
        if (mode === 'pomodoro') {
            const newCount = sessionCount + 1;
            setSessionCount(newCount)
            setTimeLeft(pomodoroTime);
            setMode('shortBreak')
            console.log('pomodoro');
            console.log(sessionCount)
            setBackgroundColor('bgPomodoro')

            playSound('/startnotification2.mp3');
        } else if (sessionCount % longBreakInterval === 0) {
            if (!autoLongBreak) { setIsRunning(false); }

            console.log('long break')
            setMode('pomodoro')
            setTimeLeft(longBreakTime);
            setBackgroundColor('bgLongBreak')
        } else {
            if (!autoBreak) { setIsRunning(false); }

            console.log('shortbreak')
            setTimeLeft(shortBreakTime);
            setMode('pomodoro')
            setBackgroundColor('bgShortBreak')
        }
    }

    const startButton = () => {

        if (sessionCount == 0 && backgroundColor == 'bgPomodoro') {
            setSessionCount(prev => prev + 1);
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

        if (mode === 'pomodoro') {
            const newCount = sessionCount + 1;
            setTimeLeft(pomodoroTime);
            setMode('shortBreak')
            console.log('pomodoro');
            console.log(sessionCount)
            setBackgroundColor('bgPomodoro')
            setSessionCount(newCount)
            
            setIsRunning(false);
            setTimeout(() => {
                setIsRunning(true);
            }, 1000);

        } else if (sessionCount % longBreakInterval === 0 && mode == 'shortBreak') {
            console.log('long break')
            setMode('pomodoro')
            setTimeLeft(longBreakTime);
            setBackgroundColor('bgLongBreak')
            setIsRunning(false);
            setTimeout(() => {
                setIsRunning(true);
            }, 1000);
        } else {
            console.log('shortbreak')
            setTimeLeft(shortBreakTime);
            setMode('pomodoro')
            setBackgroundColor('bgShortBreak')
            setIsRunning(false);
            setTimeout(() => {
                setIsRunning(true);
            }, 1000);
        }
        console.log('clicked next')
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
                         w-[110%] h-[150%] bg-black/20 blur-2xl rounded-full -z-10"></span>
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
                        <SessionCountGraph count={sessionCount} longBreakInterval={longBreakInterval} />
                    </div>

                    {/* Start Buttons */}
                    <div className={`boxfade ${isMouseActive ? '' : 'box'}`}>
                        <div className="flex justify-center mt-10">
                            <div className="flex gap-3">
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

                        <div className='text-center mt-3 text-white'>
                            <p className='text-sm'>Session count: {sessionCount}</p>
                            <p className='text-sm'>user count: {userRecord.sessionCount}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PomodoroTimer