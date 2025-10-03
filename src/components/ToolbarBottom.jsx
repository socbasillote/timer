import React, { useState } from "react";
import { Image, Cloud, Timer, Clock, Music } from "lucide-react";
import ThemeModal from '../components/ThemeModal';
import ModeSoundModal from '../components/ModeSoundModal';
import SettingsModal from '../components/SettingsModal';
import ClockSettingsModal from "./ClockSettingsModal";

function ToolbarBottom({
  settings,
  setSettings,
  uiSettings,
  setUiSettings,
  clockSettings,
  setClockSettings,
  isMuted,
  toggleSound,
  changeVolume,
  toggleMuteAll,
  isMouseActive,
  activeTab,
  setActiveTab
}) {
  // Single state for tab control
  

  return (
    <div className={`w-auto bg-white/10 backdrop-blur-sm rounded-2xl shadow-md fade-box ${isMouseActive ? '' : 'fade'}`}>
      <div className="flex p-2 text-white gap-3">
        {/* Theme */}
        <button
          onClick={() => setActiveTab(activeTab === "theme" ? null : "theme")}
          className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
            activeTab === "theme"
              ? "bg-white/20 text-blue-400"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          <Image className="w-6 h-6" />
        </button>

        {/* Cloud */}
        <button
          onClick={() => setActiveTab(activeTab === "cloud" ? null : "cloud")}
          className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
            activeTab === "cloud"
              ? "bg-white/20 text-blue-400"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          <Cloud className="w-6 h-6" />
        </button>

        {/* Timer */}
        <button
          onClick={() => setActiveTab(activeTab === "timer" ? null : "timer")}
          className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
            activeTab === "timer"
              ? "bg-white/20 text-blue-400"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          <Timer className="w-6 h-6" />
        </button>

        {/* Music To-do */}
        <button
          onClick={() => setActiveTab(activeTab === "clock" ? null : "clock")}
          className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
            activeTab === "clock"
              ? "bg-white/20 text-pink-400"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          <Clock className="w-6 h-6" />
        </button>
      </div>

      {/* Render the active tab */}
      {activeTab === "theme" && (
        <ThemeModal
          isOpen={true}
          onClose={() => setActiveTab(null)}
          settings={settings}
          setSettings={setSettings}
        />
      )}

      {activeTab === "cloud" && (
        <ModeSoundModal
          onClose={() => setActiveTab(null)}
          uiSettings={uiSettings}
          setUiSettings={setUiSettings}
          isMuted={isMuted}
          toggleSound={toggleSound}
          changeVolume={changeVolume}
          toggleMuteAll={toggleMuteAll}
        />
      )}

      {activeTab === "timer" && (
        <SettingsModal
          isOpen={true}
          onClose={() => setActiveTab(null)}
          settings={settings}
          setSettings={setSettings}
        />
      )}

      {activeTab === "clock" && (
        <ClockSettingsModal 
          isOpen={true}
          onClose={() => setActiveTab(null)}
          clockSettings={clockSettings}
          setClockSettings={setClockSettings}
        />
      )}
    </div>
  );
}

export default ToolbarBottom;
