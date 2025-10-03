import React, { useEffect, useRef } from "react";

function WeatherAnimation({ mode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // If weather mode is none, skip everything
    if (mode === "none") return;

    const canvas = canvasRef.current;
    if (!canvas) return; // safety check
    const ctx = canvas.getContext("2d");

    let particles = [];
    let animationFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor(x, y, speed, size) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = size;
      }
      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.y = -this.size;
          this.x = Math.random() * canvas.width;
        }
      }
      drawRain() {
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.size * 1);
        ctx.stroke();
      }
      drawSnow() {
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const createParticles = () => {
      particles = [];
      const count = mode === "snow" ? 150 : 200;
      for (let i = 0; i < count; i++) {
        particles.push(
          new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            mode === "snow"
              ? 1 + Math.random() * 1.5
              : 4 + Math.random() * 4,
            mode === "snow"
              ? 2 + Math.random() * 3
              : 8 + Math.random() * 10
          )
        );
      }
    };

    createParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        if (mode === "rainWeather") p.drawRain();
        if (mode === "snow") p.drawSnow();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [mode]);

  if (mode === "none") return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
    />
  );
}

export default WeatherAnimation;
