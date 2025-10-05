import { useState, useEffect } from "react";

function AnimatedBackground({ bgImage, children, zoom }) {
  const [images, setImages] = useState([{ url: bgImage, active: true }]);

  useEffect(() => {
    if (!bgImage) return;

    // deactivate old images, keep them fading out
    setImages((prev) =>
      [...prev.map((img) => ({ ...img, active: false })), { url: bgImage, active: true }]
    );

  }, [bgImage]);

  return (
    <div className={`relative w-full h-full min-h-screen overflow-hidden`}>
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center bg-scale ${
            zoom ? "scale-zoom" : "scale-default"
          } ${img.active ? "animate-fadeIn" : "animate-fadeOut"}`}
          style={{ backgroundImage: `url(${img.url})` }}
        />
      ))}

      {/* App content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default AnimatedBackground;
