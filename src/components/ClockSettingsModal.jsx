import React from "react";
import { X } from "lucide-react";

function ClockSettingsModal({ isOpen, onClose, clockSettings, setClockSettings }) {
  if (!isOpen) return null;

  const updateSetting = (key, value) => {
    setClockSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Reusable toggle component
  const Toggle = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${
        enabled ? "bg-blue-600" : "bg-gray-400"
      }`}
    >
      <div
        className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <>
      {/* Backdrop */}
      <div />

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
          <h3 className="font-semibold text-xl text-gray-800">🕒 Clock Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Time Format */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-medium text-gray-700">24 Hour-Clock</span>
          <div className="flex items-center gap-2">
            <Toggle
                enabled={clockSettings.timeFormat === "24h"}
                onToggle={() =>
                updateSetting("timeFormat", clockSettings.timeFormat === "24h" ? "12h" : "24h")
                }
            />

          </div>
        </div>

        {/* Show Seconds */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-medium text-gray-700">Show Seconds</span>
          <Toggle
            enabled={clockSettings.showSeconds}
            onToggle={() => updateSetting("showSeconds", !clockSettings.showSeconds)}
          />
        </div>

        {/* Show Date */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Show Date</span>
          <Toggle
            enabled={clockSettings.showDate}
            onToggle={() => updateSetting("showDate", !clockSettings.showDate)}
          />
        </div>
      </div>
    </>
  );
}

export default ClockSettingsModal;
