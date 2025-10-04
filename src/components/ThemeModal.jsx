import React, { useState } from "react";
import { X, Image } from "lucide-react";

import themes from "../appdata/themes";

function ThemeModal({ isOpen, onClose, settings, setSettings }) {
  if (!isOpen) return null;

  // Theme data with 4 templates each
  

  const [activeTheme, setActiveTheme] = useState("Anime");

  return (
    <>
      <div
        
      />

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
          <h3 className="font-semibold text-xl text-gray-800">🎨 Choose Theme</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>


        {/* Theme Navigation */}
        <div className="flex gap-2 mb-5 border-b border-gray-200">
          {Object.keys(themes).map((theme) => (
            <button
              key={theme}
              onClick={() => setActiveTheme(theme)}
              className={`px-3 py-1.5 rounded-t-lg text-sm font-medium transition ${
                activeTheme === theme
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-4">
          {themes[activeTheme].map(({ src, font, subFont, theme, imageName, owner }, idx) => {
            const isSelected = settings.bgImage === src;
            return (
              <button
                key={idx}
                className={`relative rounded-xl overflow-hidden group shadow-md transition-all duration-200 ${
                  isSelected
                    ? "ring-4 ring-blue-500 scale-105"
                    : "hover:scale-105 hover:shadow-lg"
                }`}
                onClick={() =>
                  setSettings({
                    ...settings,
                    bgImage: src,
                    fontStyle: font,
                    subFont: subFont,
                  })
                }
              >
                {/* Background image */}
                <img
                  src={src}
                  alt={`${activeTheme} ${idx + 1}`}
                  className="w-full h-28 object-cover"
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 transition ${
                    isSelected
                      ? "bg-blue-500/30"
                      : "bg-black/0 group-hover:bg-black/40"
                  }`}
                />

                {/* Hover Info */}
                <div className="absolute inset-0 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity text-left">
                  <span className="text-white text-xs font-semibold">
                    {theme}
                  </span>
                  <span className="text-gray-200 text-xs">{imageName}</span>
                  <span className="text-gray-300 text-[10px] italic">
                    {owner}
                  </span>
                </div>

                {/* Selected Badge */}
                {isSelected && (
                  <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ThemeModal;
