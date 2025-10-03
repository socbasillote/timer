import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

function NumberInput({ label, keyName, min = 1, defaultValue, settings, updateSetting }) {
  // local string state for smooth editing
  const initial = String(settings[keyName] ?? defaultValue);
  const [local, setLocal] = useState(initial);

  // keep local synced when external settings change
  useEffect(() => {
    setLocal(String(settings[keyName] ?? defaultValue));
  }, [settings[keyName], defaultValue]);

  const handleChange = (e) => {
    const raw = e.target.value;
    setLocal(raw);

    // update only when raw parses to a valid integer
    const parsed = parseInt(raw, 10);
    if (!Number.isNaN(parsed)) {
      // enforce min
      const safe = Math.max(min, parsed);
      updateSetting(keyName, safe);
    }
    // if raw is empty or invalid, don't write NaN into settings while typing
  };

  const handleBlur = () => {
    // if user left empty, restore to current settings value or min
    if (local === "" || Number.isNaN(parseInt(local, 10))) {
      const fallback = settings[keyName] ?? defaultValue ?? min;
      setLocal(String(fallback));
      updateSetting(keyName, fallback);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={keyName} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={keyName}
        name={keyName}
        type="number"
        min={min}
        value={local}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 
                   text-sm focus:ring-2 focus:ring-blue-400 
                   focus:outline-none transition bg-white"
      />
    </div>
  );
}

function ColorInput({ label, keyName, settings, updateSetting, options }) {
  const value = settings[keyName] ?? options[0];

  // Ensure the first option is saved as default if missing
  useEffect(() => {
    if (!settings[keyName]) {
      updateSetting(keyName, options[0]);
    }
  }, [settings, keyName, options, updateSetting]);

  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-gray-700">{label}:</span>
      <div className="flex gap-2">
        {options.map((color) => (
          <button
            key={color}
            className={`w-7 h-7 rounded-full border-2 transition 
              ${value === color ? "border-gray-800 scale-110" : "border-gray-300 hover:border-gray-500"}`}
            style={{ backgroundColor: color }}
            onClick={() => updateSetting(keyName, color)}
            aria-label={`${label} ${color}`}
          />
        ))}
      </div>
    </div>
  );
}


function SettingsModal({ isOpen, onClose, settings, setSettings }) {
  if (!isOpen) return null;

  const tabs = ["Timer", "Design", "Notification"];
  const [activeTab, setActiveTab] = useState("Timer");

  // ✅ Correct functional updater — uses prev not the stale outer `settings`
  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
      <div  />

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
          <h3 className="font-semibold text-xl text-gray-800">⚙ Pomodoro Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 
                ${
                  activeTab === tab
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {/* Timer */}
          {activeTab === "Timer" && (
            <div className="space-y-4">
              <NumberInput
                label="Pomodoro (minutes)"
                keyName="workTime"
                defaultValue={25}
                settings={settings}
                updateSetting={updateSetting}
              />
              <NumberInput
                label="Short Break (minutes)"
                keyName="shortBreak"
                defaultValue={5}
                settings={settings}
                updateSetting={updateSetting}
              />
              <NumberInput
                label="Long Break (minutes)"
                keyName="longBreak"
                defaultValue={15}
                settings={settings}
                updateSetting={updateSetting}
              />

              <NumberInput
                label="Long Break Interval"
                keyName="longBreakInterval"
                defaultValue={4}
                settings={settings}
                updateSetting={updateSetting}
              />


              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Auto Break</span>
                <Toggle
                  enabled={settings.autoBreak}
                  onToggle={() => updateSetting("autoBreak", !settings.autoBreak)}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Auto Long Break</span>
                <Toggle
                  enabled={settings.autoLongBreak}
                  onToggle={() => updateSetting("autoLongBreak", !settings.autoLongBreak)}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Focus Mode</span>
                <Toggle
                  enabled={settings.focusMode}
                  onToggle={() => updateSetting("focusMode", !settings.focusMode)}
                />
              </div>
            </div>
          )}

          {/* Design */}
          {activeTab === "Design" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="progressStyle" className="font-medium text-gray-700">
                  Progress Style
                </label>
                <select
                  id="progressStyle"
                  name="progressStyle"
                  value={settings.progressStyle ?? "ring"}
                  onChange={(e) => updateSetting("progressStyle", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="ring">Ring</option>
                  <option value="line">Line</option>
                </select>
              </div>

              <ColorInput
                label="Pomodoro Ring Color"
                keyName="bgColor"
                options={["#ff4b4b", "#ff6b6b", "#ff2d2d"]}
                settings={settings}
                updateSetting={updateSetting}
              />
              <ColorInput
                label="Short Break Ring Color"
                keyName="bgBreakColor"
                options={["#4bff4b", "#6bff6b", "#2dff2d"]}
                settings={settings}
                updateSetting={updateSetting}
              />
              <ColorInput
                label="Long Break Ring Color"
                keyName="bgLongBreak"
                options={["#4b4bff", "#6b6bff", "#2d2dff"]}
                settings={settings}
                updateSetting={updateSetting}
              />
            </div>
          )}

          {/* Notification */}
          {activeTab === "Notification" && (
            <div className="space-y-4">
              <NumberInput
                label="Reminder Time (seconds left)"
                keyName="notificationTime"
                defaultValue={10}
                min={0}
                settings={settings}
                updateSetting={updateSetting}
              />

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="notificationVolume"
                  className="text-sm font-medium text-gray-700"
                >
                  Notification Volume
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="notificationVolume"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.notificationVolume ?? 0.5}
                    onChange={(e) =>
                      updateSetting("notificationVolume", parseFloat(e.target.value))
                    }
                    className="w-full accent-blue-500"
                  />
                  <span className="text-xs text-gray-600 w-10 text-right">
                    {Math.round((settings.notificationVolume ?? 0.5) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SettingsModal;
