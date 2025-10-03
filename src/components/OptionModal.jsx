import React from 'react'
import { X } from "lucide-react"; // add lucide-react for nice icons

function OptionModal({ isOpen, onClose, settings, setSettings }) {
  if (!isOpen) return null;

  const defaultImages = [
    { label: "None", value: "" },
    { label: 'Mountains', value: "/images/mountains.jpg"},
    { label: 'Beach', value: "/images/beach.jpg"},
    { label: 'Forest', value: "/images/forest.jpg"},
    { label: "Space", value: "/images/space.jpg"}
  ]
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-96 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Options</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Timer Settings */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Time (minutes)</h3>
          <div className="flex gap-3">
            <div className="flex flex-col">
              <label className="text-sm">Pomodoro</label>
              <input
                type="number"
                value={settings.workTime}
                onChange={(e) =>
                  setSettings({ ...settings, workTime: Number(e.target.value) })
                }
                className="border p-2 rounded w-20"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm">Short Break</label>
              <input
                type="number"
                value={settings.shortBreak}
                onChange={(e) =>
                  setSettings({ ...settings, shortBreak: Number(e.target.value) })
                }
                className="border p-2 rounded w-20"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm">Long Break</label>
              <input
                type="number"
                value={settings.longBreak}
                onChange={(e) =>
                  setSettings({ ...settings, longBreak: Number(e.target.value) })
                }
                className="border p-2 rounded w-20"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 mt-3 text-sm">
            <input
              type="checkbox"
              checked={settings.autoBreak}
              onChange={(e) =>
                setSettings({ ...settings, autoBreak: e.target.checked })
              }
              className="w-4 h-4"
            />
            Auto Start Breaks
          </label>
          <label className="flex items-center gap-2 mt-3 text-sm">
            Long break interval
            <select 
                    value={settings.longBreakInterval}
                    onChange={(e) =>
                        setSettings({ ...settings, longBreakInterval: Number(e.target.value)})
                    }
                    className='border p-1 rounded w-20'
                >
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            
          </label>
        </div>

        {/* Background Colors */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Background Colors</h3>
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <label className="text-sm">Pomodoro</label>
              <input
                type="color"
                value={settings.bgColor}
                onChange={(e) =>
                  setSettings({ ...settings, bgColor: e.target.value })
                }
                className="w-12 h-8 cursor-pointer"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm">Short Break</label>
              <input
                type="color"
                value={settings.bgBreakColor}
                onChange={(e) =>
                  setSettings({ ...settings, bgBreakColor: e.target.value })
                }
                className="w-12 h-8 cursor-pointer"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm">Long Break</label>
              <input
                type="color"
                value={settings.bgLongBreak}
                onChange={(e) =>
                  setSettings({ ...settings, bgLongBreak: e.target.value })
                }
                className="w-12 h-8 cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        {/* Background Image */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Default Background Image</h3>
          <select 
            value={settings.bgImage}
            onChange={(e) => setSettings({ ...settings, bgImage: e.target.value})}
            className='border p-2 rounded w-full'
          >
            {defaultImages.map((img => (
              <option key={img.value} value={img.value}>
                  {img.label}
              </option>
            )))}
          </select>

          {settings.bgImage && (
            <div className="mt-3">
              <img 
                src={settings.bgImage}
                alt='preview'
                className='w-full h-24 object-cover rounded'
              />
            </div>
          )}
        </div>

        {/* Notifications */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Notifications</h3>
          <label className="flex items-center gap-2 mb-3 text-sm">
            <input
              type="checkbox"
              checked={settings.notificationOn}
              onChange={(e) =>
                setSettings({ ...settings, notificationOn: e.target.checked })
              }
              className="w-4 h-4"
            />
            Enable Notifications
          </label>
          <div className="flex flex-col">
            <label className="text-sm">Reminder Time (seconds left)</label>
            <input
              type="number"
              value={settings.notificationTime}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notificationTime: Number(e.target.value),
                })
              }
              className="border p-2 rounded w-24"
            />
          </div>
        </div>

        {/* volume */}
        <div>
            <h3 className="font-semibold text-gray-700 mb-2">Volume</h3>
            <label className="flex items-center gap-2 mb-3 text-sm">
                <input
                    type='range'
                    min='0'
                    max='1'
                    step='0.1'
                    value={settings.volume}
                    onChange={(e) => setSettings({ ...settings, volume: parseFloat(e.target.value)})}
                    className="w-full"
                />
                    <p className="text-sm text-gray-600">Current: {Math.round(settings.volume * 100)}%</p>
            </label>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default OptionModal;
