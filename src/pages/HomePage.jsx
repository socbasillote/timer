import React, { use, useRef, lazy, Suspense } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { RotateCcw, ArrowRight, Timer, Clock } from 'lucide-react';



import WeatherAnimation from '../components/WeatherAnimation';

import ClockTimer from '../feature/ClockTimer';

import ToolbarBottom from '../components/ToolbarBottom';
import PomodoroTimer from '../feature/PomodoroTimer';


function HomePage({ settings, setSettings, uiSettings, setUiSettings, clockSettings, setClockSettings }) {

    const [viewMode, setViewMode] = useState('clock');
    const [isMuted, setIsMuted] = useState(false);



    const bgImage = settings.bgImage;



    const focusMode = settings.focusMode;



    const [isRunning, setIsRunning] = useState(false);



    const [isMouseActive, setIsMouseActive] = useState(true);
    const [activeTab, setActiveTab] = useState(null);

    const audioRefs = useRef({});


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
                        {/* <Link to="/options" className='text-white'>Options</Link>  */}
                        <div className={`fade-box ${isMouseActive ? '' : 'fade'}`}>
                            <button
                                onClick={() => {
                                    if (viewMode === "pomodoro") {
                                    const confirmSwitch = window.confirm(
                                        "Switching to Clock will pause your Pomodoro session. Continue?"
                                    );
                                    if (!confirmSwitch) return; // cancel switch
                                    }
                                    setViewMode(viewMode === "pomodoro" ? "clock" : "pomodoro");
                                    setIsRunning(false);
                                }}
                                className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition"
                                >
                                {viewMode === "pomodoro" ? (
                                    <Clock className="w-6 h-6" />
                                ) : (
                                    <Timer className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                        
                    </nav>
                </div>
            </div>    

            <div className='flex-1 p-6 flex min-h-0'>
                {viewMode === 'pomodoro' ? (
                    // Pomodoro
                    <div className='flex-1 flex items-center justify-center'>
                        <PomodoroTimer 
                            settings={settings} 
                            setSettings={setSettings} 
                            isRunning={isRunning} 
                            setIsRunning={setIsRunning}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            isMouseActive={isMouseActive}
                        />
                    </div>
                ) : (
                    <div className='flex-1'>
                        <ClockTimer clockSettings={clockSettings} />
                    </div>
                )}
            </div>
            {/* Button Navigation */}
            <div className={`mt-auto sticky bottom-0 z-50`}>
                <div className="flex justify-center items-center pb-3">
                    <ToolbarBottom 
                        settings={settings}
                        setSettings={setSettings}
                        uiSettings={uiSettings}
                        setUiSettings={setUiSettings}
                        clockSettings={clockSettings}
                        setClockSettings={setClockSettings}
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

