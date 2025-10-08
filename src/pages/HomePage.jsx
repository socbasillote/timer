import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom';

import { Timer, Clock, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind } from 'lucide-react';

import AnimatedBackground from '../animation/AnimatedBackground';

import WeatherAnimation from '../components/WeatherAnimation';

import ClockTimer from '../feature/ClockTimer';

import ToolbarBottom from '../components/ToolbarBottom';
import PomodoroTimer from '../feature/PomodoroTimer';

import themes from '../appdata/themes';


function HomePage({ settings, setSettings, uiSettings, setUiSettings, clockSettings, setClockSettings }) {

    const [viewMode, setViewMode] = useState('clock');
    const [isMuted, setIsMuted] = useState(false);

    const [isRunning, setIsRunning] = useState(false);
    const [isMouseActive, setIsMouseActive] = useState(true);
    const [activeTab, setActiveTab] = useState(null);

    const audioRefs = useRef({});
    const bgImage = settings.bgImage;
    const focusMode = settings.focusMode;

    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [isAskingName, setIsAskingName] = useState(!localStorage.getItem("username"));
    const [tempName, setTempName] = useState("");
    const [isFadingOut, setIsFadingOut] = useState(false);

    const [forSignUp, setForSignUp] = useState(false);

    const [showGreeting, setShowGreeting] = useState(false);
    const [showMainContent, setShowMainContent] = useState(!isAskingName);
    const [animate, setAnimate] = useState(true);

    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState("");

    const API_KEY = import.meta.env.VITE_WEATHER_API;
    // Focus Mode
    useEffect(() => {
        if (!focusMode) {
            setIsMouseActive(true);
            return
        }
        if (activeTab) {
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


    // Weather Fetch
    useEffect(() => {
        // Fetch user's geolocation
        
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;

                try {
                    const res = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                    );
                    const data = await res.json();

                    setWeather(data);
                    
                    let place = data.name || "Unknown";

                // Remove common suffixes like "City"
                const suffixes = ["City", "Town", "Village"];
                suffixes.forEach((suff) => {
                    const regex = new RegExp(`\\s*${suff}$`, "i");
                    place = place.replace(regex, "");
                });

                setCity(place.trim());


                } catch (err) {
                    console.error("Error fetching weather:", err);
                    setCity("Unknown");
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                setCity("Unknown");
            }
        );
    }, []);


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


    const randomNatureBackground = useMemo(() => {
        const natureImages = themes.Nature;
        const randomIndex = Math.floor(Math.random() * natureImages.length);
        return natureImages[randomIndex].src
    }, []);

    const showGreetingButton = () => {
        setIsAskingName(false);
        setShowGreeting(true);
        // hide greeting after 2 seconds
        setTimeout(() => {
            // trigger fade-out animation
            const greetingEl = document.querySelector('.greeting-screen');
            if (greetingEl) greetingEl.classList.add('custom-fade-out');
            setShowMainContent(true);
            const fadeTimer = setTimeout(() => {
                setShowGreeting(false);
            }, 1000); // fade-out duration (matches CSS)



            return () => clearTimeout(fadeTimer);
        }, 2000);

    }

    const getWeatherIcon = (main) => {
        switch (main) {
            case "Clear":
                return <Sun className="w-6 h-6 text-white" />;
            case "Clouds":
                return <Cloud className="w-6 h-6 text-white" />;
            case "Rain":
                return <CloudRain className="w-6 h-6 text-white" />;
            case "Snow":
                return <CloudSnow className="w-6 h-6 text-white" />;
            case "Thunderstorm":
                return <CloudLightning className="w-6 h-6 text-white" />;
            default:
                return <Wind className="w-6 h-6 text-white" />;
        }
    };

    

    return (
        <div className='bg-black'>
            {isAskingName && (
                <div
                    className={`fixed inset-0 flex items-center justify-center bg-black backdrop-blur-sm z-[9999] px-4 ${isFadingOut ? "" : "custom-fade-in"
                        }`}
                    style={{
                        backgroundImage: `url(${randomNatureBackground})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {!forSignUp && (
                        <div
                            className={`flex flex-col items-center text-center gap-8 max-w-lg w-full transform transition-transform duration-700 ${isFadingOut ? "scale-95" : "scale-100"
                                }`}
                        >
                            {/* Heading */}
                            <h1 className="text-6xl font-semibold text-white tracking-wide">Welcome!</h1>

                            {/* Card Section */}
                            <div className="text-white w-full">
                                <p className="mb-6 opacity-90 text-2xl">
                                    What’s the name you’d like me to call you?
                                </p>

                                {/* Input field */}
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full bg-transparent border-b border-white/50 text-white text-xl text-center focus:outline-none focus:border-white placeholder-white/80 py-2 transition-all"
                                />

                                {/* Continue button */}
                                <button
                                    onClick={() => {
                                        if (tempName.trim()) {
                                            localStorage.setItem("username", tempName.trim());
                                            setUsername(tempName.trim());
                                            setForSignUp(true);
                                        }
                                    }}
                                    className="mt-8 max-w-3xs w-full bg-white/40 hover:bg-white/30 py-3 rounded-lg transition-all text-lg font-medium"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {forSignUp && (
                        <div className={`absolute inset-0 flex flex-col items-center justify-center text-white text-center transition-opacity duration-700 ${forSignUp ? "opacity-100" : "opacity-0"}`}
                            style={{
                                backgroundImage: `url(${randomNatureBackground})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                            <button
                                className="bg-white text-black py-3 rounded-lg hover:bg-gray-200 transition"
                                onClick={showGreetingButton}
                            >
                                Continue with Google
                            </button>

                            <button
                                className="bg-white/20 py-3 rounded-lg hover:bg-white/30 transition"
                                onClick={showGreetingButton}
                            >
                                Sign up manually
                            </button>
                        </div>
                    )}

                </div>



            )}

            {showGreeting && username && (
                <div className={`greeting-screen fixed inset-0 flex flex-col items-center justify-center text-center z-[9999]`}
                    style={{
                        backgroundImage: `url(${randomNatureBackground})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >

                    <h1 className="text-5xl font-bold text-white animate-fade-in-up">
                        Welcome, {username}!
                    </h1>
                    <p className="mt-4 text-xl text-white/80 animate-fade-in-up delay-200">
                        Glad to see you here.
                    </p>
                </div>
            )}

            {showMainContent && (
                <AnimatedBackground bgImage={bgImage} zoom={viewMode === "pomodoro"}>
                    <div className='min-h-screen flex flex-col'>
                        <WeatherAnimation mode={uiSettings.weather} />
                        {/* Navigation */}
                        <nav className="p-3 px-6 grid grid-cols-3 items-center">
                            {/* Left: Logo */}
                            <Link to="/" className="justify-self-start relative inline-block">
                                <h1 className="relative text-2xl font-semibold text-white z-10">Khronoflow</h1>
                                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[150%] bg-black/20 blur-2xl rounded-full -z-10"></span>
                            </Link>

                            {/* Center: Weather */}
                            <div className={`justify-self-center text-center `}>
                                {viewMode === "pomodoro" ? (
                                    ""
                                ) : (
                                    weather && (
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-2">
                                                {getWeatherIcon(weather.weather[0].main)}
                                                <p className="text-white text-sm">{Math.round(weather.main.temp)}°C</p>
                                            </div>
                                            <p className="text-xs text-white opacity-70">{city}</p>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Right: Buttons */}
                            <div className="justify-self-end flex gap-4">
                                <div className={`boxfade ${isMouseActive ? "" : "box"}`}>
                                    <button
                                        onClick={() => {
                                            if (viewMode === "pomodoro") {
                                                const confirmSwitch = window.confirm(
                                                    "Switching to Clock will pause your Pomodoro session. Continue?"
                                                );
                                                if (!confirmSwitch) return;
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
                            </div>
                        </nav>


                        <div className='flex-1 p-6 flex min-h-0'>
                            {viewMode === 'pomodoro' ? (
                                // Pomodoro
                                <div
                                    className={
                                        `flex-1 flex items-center justify-center  `
                                    }>
                                    <PomodoroTimer
                                        settings={settings}
                                        setSettings={setSettings}
                                        isRunning={isRunning}
                                        setIsRunning={setIsRunning}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        isMouseActive={isMouseActive}
                                        animate={animate}
                                    />
                                </div>
                            ) : (
                                <div className={`flex-1`}>
                                    <ClockTimer clockSettings={clockSettings} username={username} animate={animate} />
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

                </AnimatedBackground>
            )}
        </div>
    )
}

export default HomePage

