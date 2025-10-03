import React, { useState } from "react";
import {
  X,
  Waves,
  CloudRain,
  Trees,
  Flame,
  VolumeX,
  Volume2,
  Snowflake,
  MoonStar,
  Bubbles ,
  Sun,
} from "lucide-react";

function ModeSoundModal({
  onClose,
  uiSettings,
  setUiSettings,
  isMuted,
  toggleSound,
  changeVolume,
  toggleMuteAll,
}) {
  const [activeTab, setActiveTab] = useState("sounds");

  // ---- Ambient Sounds ----
  const sounds = [
    { label: "Waves", key: "waves", src: "/sounds/waves.mp3", icon: Waves },
    { label: "Rain", key: "rain", src: "/sounds/rain.mp3", icon: CloudRain },
    { label: "Forest", key: "forest", src: "/sounds/forest.mp3", icon: Trees },
    { label: "Fireplace", key: "fireplace", src: "/sounds/fireplace.mp3", icon: Flame },
    { label: "Bubbling", key: "bubbling", src: "/sounds/fireplace.mp3", icon: Bubbles  },
    { label: "Cricket", key: "cricket", src: "/sounds/fireplace.mp3", icon: MoonStar },
  ];

  // ---- Weather Modes ----
  const weatherModes = [
    { label: "Normal", key: "none", icon: Sun },
    { label: "Rain", key: "rainWeather", icon: CloudRain },
    { label: "Snow", key: "snow", icon: Snowflake },
  ];

  const setWeather = (mode) => {
    setUiSettings((prev) => ({ ...prev, weather: mode }));
  };

  return (
    <div>
      {/* Modal */}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 
                   bg-white/90 text-gray-900 rounded-2xl shadow-xl 
                   p-6 w-[440px] z-50 animate-slideUp 
                   max-h-[400px]  my-scroll-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-xl text-gray-800">☁️ Mode</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab("sounds")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition w-full ${
              activeTab === "sounds"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🎵 Sounds
          </button>
          <button
            onClick={() => setActiveTab("weather")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition w-full ${
              activeTab === "weather"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🌦 Weather
          </button>
        </div>

        {/* Content */}
        {activeTab === "sounds" && (
          <div>
            {/* Mute/Unmute */}
            <button
              onClick={toggleMuteAll}
              className="flex items-center gap-2 px-3 py-2 mb-4 text-sm 
                bg-gray-100 hover:bg-gray-200 text-gray-700 
                rounded-lg transition w-full justify-center"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4" /> Unmute All
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" /> Mute All
                </>
              )}
            </button>

            {/* Sounds Grid */}
            <div className="grid grid-cols-3 gap-2">
              {sounds.map((sound) => {
                const isActive = uiSettings[sound.key];
                const volumeKey = `${sound.key}Volume`;

                return (
                  <div
                    key={sound.key}
                    className={`flex flex-col items-center rounded-xl p-3 border 
                      transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 border-blue-400 shadow-md"
                          : "hover:bg-gray-50 border-gray-200"
                      }`}
                  >
                    {/* Toggle Button */}
                    <button
                      onClick={() => toggleSound(sound)}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-lg 
                        w-full h-20 transition ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      {React.createElement(sound.icon, { className: "w-6 h-6" })}
                      <span className="text-xs font-medium">{sound.label}</span>
                    </button>

                    {/* Volume Slider */}
                    {isActive && (
                      <div className="flex items-center gap-2 mt-2 w-full">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={uiSettings[volumeKey] ?? 0.5}
                          onChange={(e) =>
                            changeVolume(sound, parseFloat(e.target.value))
                          }
                          className="w-full accent-blue-500"
                          disabled={isMuted}
                        />
                        <span className="text-[10px] text-gray-600 w-8 text-right">
                          {isMuted
                            ? "0%"
                            : `${Math.round(
                                (uiSettings[volumeKey] ?? 0.5) * 100
                              )}%`}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "weather" && (
          <div className="grid grid-cols-3 gap-2">
            {weatherModes.map((mode) => {
              const isActive = uiSettings.weather === mode.key;
              return (
                <button
                  key={mode.key}
                  onClick={() => setWeather(mode.key)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition ${
                    isActive
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  {React.createElement(mode.icon, { className: "w-6 h-6" })}
                  <span className="text-xs">{mode.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModeSoundModal;
