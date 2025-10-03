import React, { use, useRef, lazy, Suspense } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { RotateCcw, ArrowRight } from 'lucide-react';

import ProgressRing from '../components/ProgressRing';
import ProgressLine from '../components/ProgressLine';
import SessionCountGraph from '../components/SessionCountGraph';
import WeatherAnimation from '../components/WeatherAnimation';

import Clock from '../feature/Clock';

import ToolbarBottom from '../components/ToolbarBottom';


function HomePage({ settings, setSettings, uiSettings, setUiSettings, clockSettings, setClockSettings }) {

    const [isMuted, setIsMuted] = useState(false);


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
    const bgImage = settings.bgImage;
    const subFont = settings.subFont;

    const autoLongBreak = settings.autoLongBreak;
    const focusMode = settings.focusMode;


    const [timeLeft, setTimeLeft] = useState(workTime * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState('');

    const [sessionCount, setSessionCount] = useState(0);

    const [backgroundColor, setBackgroundColor] = useState("bgPomodoro")

    const pomodoroTime = workTime * 60;
    const shortBreakTime = shortBreak * 60;
    const longBreakTime = longBreak * 60
    const timerSize = 360;

    const [isMouseActive, setIsMouseActive] = useState(true);
    const [activeTab, setActiveTab] = useState(null);

    const calledRef = useRef(false);
    const audioRefs = useRef({});

    // Calculate progress percentage
    const totalTime =
        backgroundColor === 'bgPomodoro'
            ? pomodoroTime
            : backgroundColor === 'bgShortBreak'
                ? shortBreakTime
                : longBreakTime;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

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
            }
            if (timeLeft === 0 && backgroundColor == 'bgPomodoro') {
                notify("Time's up!")
                playSound('/ding.mp3');
            }
        }

    }, [timeLeft])

    

    // Focus Mode
    useEffect(() => {
        if(!focusMode) {
            setIsMouseActive(true);
            return
        }
        if(activeTab) {
            setIsMouseActive(true);
            return
        }
        if (!isRunning) {
            setIsMouseActive(true);
            return;
        }
        setIsMouseActive(true);
        let timeout;

        const handleMouseMove = () => {
            setIsMouseActive(true);
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                setIsMouseActive(false);
            }, 3000);
        };

        window.addEventListener('mousemove', handleMouseMove);

        timeout = setTimeout(() => {
        setIsMouseActive(false);
    }, 6000);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timeout);
        }
    }, [isRunning, activeTab])


    useEffect(() => {
        
    })

    const timeHandler = () => {
        if (mode === 'pomodoro') {
            const newCount = sessionCount + 1;
            setSessionCount(newCount)
            setTimeLeft(pomodoroTime);
            setMode('shortBreak')
            console.log('pomodoro');
            console.log(sessionCount)
            setBackgroundColor('bgPomodoro')
            playSound('/startPomodoro.mp3');
        } else if (sessionCount % longBreakInterval === 0) {
            if(!autoLongBreak) { setIsRunning(false);}
            
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
        playSound('/start.mp3');
        setIsRunning(true);

    }

    const pauseButton = () => {
        setIsRunning(false);
        playSound('/pause.mp3');
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
            playSound('/startPomodoro.mp3');
            setIsRunning(false);
            setTimeout(() => {
                setIsRunning(true);
            }, 2000);
            
        } else if (sessionCount % longBreakInterval === 0 && mode == 'shortBreak') {
            console.log('long break')
            setMode('pomodoro')
            setTimeLeft(longBreakTime);
            setBackgroundColor('bgLongBreak')
            setIsRunning(false);
            setTimeout(() => {
                setIsRunning(true);
            }, 2000);
        } else {
            console.log('shortbreak')
            setTimeLeft(shortBreakTime);
            setMode('pomodoro')
            setBackgroundColor('bgShortBreak')
            setIsRunning(false);
            setTimeout(() => {
                setIsRunning(true);
            }, 2000);
        }

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


    /*  ---- Sound Control ---- */
    const toggleSound = (sound) => {
        const volumeKey = `${sound.key}Volume`;

        setUiSettings((prev) => {
            const isActive = prev[sound.key];

            if (isActive) {
                // Stop and remove audio
                const audio = audioRefs.current[sound.key];
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
                delete audioRefs.current[sound.key];

                return { ...prev, [sound.key]: false }; // mark inactive
            } else {
                // Start audio
                let audio = audioRefs.current[sound.key];
                if (!audio) {
                    audio = new Audio(sound.src);
                    audio.loop = true;
                    audioRefs.current[sound.key] = audio;
                }
                audio.volume = isMuted ? 0 : prev[volumeKey] ?? 0.5;
                audio.play();

                return { ...prev, [sound.key]: true }; // mark active
            }
        });
    };

    const changeVolume = (sound, newVolume) => {
        const volumeKey = `${sound.key}Volume`;

        setUiSettings((prev) => {
            // update volume in uiSettings
            if (audioRefs.current[sound.key] && !isMuted) {
                audioRefs.current[sound.key].volume = newVolume;
            }
            return { ...prev, [volumeKey]: newVolume };
        });
    };

    const toggleMuteAll = () => {
        setIsMuted((prevMuted) => {
            const newMuted = !prevMuted;

            Object.keys(audioRefs.current).forEach((key) => {
                const audio = audioRefs.current[key];
                if (audio) {
                    const volumeKey = `${key}Volume`;
                    audio.volume = newMuted ? 0 : uiSettings[volumeKey] ?? 0.5;
                }
            });

            return newMuted;
        });
    };




    return (
        <div className='min-h-screen flex flex-col bg-black/20' style={{ backgroundImage: `url(${bgImage}) `, backgroundSize: "cover", backgroundPosition: 'center', backgroundBlendMode: "overlay" }}>
            <WeatherAnimation mode={uiSettings.weather} />
            {/* Navigation */}
            <div className=' shadow-s   sticky top-0 z-50 w-full'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <nav className='p-3  flex gap-3 justify-between'>
                        <Link to="/" className='text-white'>Home</Link>
                        {/* <Link to="/options" className='text-white'>Options</Link> 
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600'
                        >
                            Settings
                        </button> */}
                        <div className={`fade-box ${isMouseActive ? '' : 'fade'}`}>
                            <p className='text-white'>Toggle</p>
                        </div>
                        
                    </nav>
                </div>
            </div>    

            {/* Pomodoro */}
            <div className='flex-1 p-6 flex flex-col items-center justify-center'>
                <div className={" "} >
                    {/* Set timer buttons */}
                   
                    <div className="flex justify-center gap-3 mb-10">
                        <button
                            onClick={pomodoroButton}
                            className={`${backgroundColor === 'bgPomodoro'
                                ? 'bg-white/30 shadow-md'   // active style
                                : 'bg-white/10 shadow-sm'}  // inactive style
                                             text-white text-sm rounded-lg px-4 py-2 cursor-pointer
                                            transition-all duration-300 hover:bg-white/30 hover:scale-105 active:scale-95
                                            fade-box ${isMouseActive ? '' : 'fade'}
                                            `}
                            style={{ fontFamily: subFont }}
                        >
                            Pomodoro
                        </button>

                        <button
                            onClick={shortBreakButton}
                            className={`${backgroundColor === 'bgShortBreak'
                                ? 'bg-white/30 shadow-md'
                                : 'bg-white/10 shadow-sm'} 
                                             text-white text-sm rounded-lg px-4 py-2 cursor-pointer
                                            transition-all duration-300 hover:bg-white/30 hover:scale-105 active:scale-95
                                            fade-box ${isMouseActive ? '' : 'fade'}
                                            `}
                            style={{ fontFamily: subFont }}
                        >
                            Short Break
                        </button>

                        <button
                            onClick={longBreakButton}
                            className={`${backgroundColor === 'bgLongBreak'
                                ? 'bg-white/30 shadow-md'
                                : 'bg-white/10 shadow-sm'} 
                                             text-white text-sm rounded-lg px-4 py-2 cursor-pointer
                                            transition-all duration-300 hover:bg-white/30 hover:scale-105 active:scale-95
                                            fade-box ${isMouseActive ? '' : 'fade'}
                                            `}
                            style={{ fontFamily: subFont }}
                        >
                            Long Break
                        </button>
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
                                    className="px-6 py-2 bg-white text-black rounded-lg cursor-pointer text-lg font-medium
                                                shadow-md transition-all duration-300 
                                                hover:bg-gray-100 hover:shadow-lg hover:scale-105 active:scale-95"
                                >
                                    {isRunning ? "Pause" : "Start"}
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
                            <p>Session count: {sessionCount}</p>
                        </div>
                    </div>

                </div>
            </div>
                                

            {/* Button Navigation */}
            
            <div className={``}>
                <div className="flex justify-center pb-3">
                    <ToolbarBottom 
                        settings={settings}
                        setSettings={setSettings}
                        uiSettings={uiSettings}
                        setUiSettings={setUiSettings}
                        isMuted={isMuted}
                        toggleSound={toggleSound}
                        changeVolume={changeVolume}
                        toggleMuteAll={toggleMuteAll}
                        isMouseActive={isMouseActive}
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab}
                    />
                    {/*  */}
                </div>
            </div>

            
        </div>
    )
}

export default HomePage

