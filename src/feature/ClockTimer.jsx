import React, { useEffect, useState } from "react";

import quotes from "../appdata/quotes";


function ClockTimer({ clockSettings, username, animate }) {
    const [now, setNow] = useState(new Date());
    const [quoteOfTheDay, setQuoteOfTheDay] = useState({ quote: "", author: "" });

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const today = new Date().toDateString();
        const savedData = JSON.parse(localStorage.getItem("quoteOfTheDay"));

        if (savedData && savedData.date === today) {
            setQuoteOfTheDay(savedData.quote);
        } else {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            const data = { date: today, quote: randomQuote };
            localStorage.setItem('quoteOfTheDay', JSON.stringify(data));
            setQuoteOfTheDay(randomQuote);
        }
    }, []);

    const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes().toString().padStart(2, "0");
        let seconds = date.getSeconds().toString().padStart(2, "0");

        if (clockSettings.timeFormat === "12h") {
            //const suffix = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;
            return `${hours}:${minutes}${clockSettings.showSeconds ? `:${seconds}` : ""
                } `;
        }

        // 24-hour format
        return `${hours.toString().padStart(2, "0")}:${minutes}${clockSettings.showSeconds ? `:${seconds}` : ""
            }`;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className={`h-full flex flex-col ${animate ? 'animate-fade-in-up' : ""}`}>
            <div className="flex justify-center mt-2">
                <div className="relative inline-block px-4 py-2 text-center">
                    {/* Soft spotlight background behind quote */}
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                         w-[110%] h-[150%] bg-black/20 blur-2xl rounded-full -z-10"></span>

                    <h6 className="text-sm text-white italic">
                        "{quoteOfTheDay.quote || "Loading quote..."}"
                    </h6>
                    <p className="text-xs text-white opacity-80">
                        {quoteOfTheDay.author}
                    </p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div>

                    {clockSettings.showDate && (
                        <p className="flex justify-center items-center text-lg text-white opacity-60 mb-5">
                            {formatDate(now)}
                        </p>
                    )}
                    <div
                        className="text-9xl drop-shadow-sm text-white text-center"
                        style={{
                            fontFeatureSettings: "'tnum'",
                            fontVariantNumeric: "tabular-nums",
                            lineHeight: 0.5,
                            fontWeight: "Bold",
                        }}
                    >
                        {formatTime(now)}
                    </div>
                    <div className="mt-15">
                        <h2 className="text-5xl text-center text-white  ">Good Morning{`${username ? `, ${username}.` : ""} `}</h2>
                    </div>
                </div>
            </div>


            <div className="mt-15">
                <p className="text-lg text-white opacity-80 text-center ">  </p>
            </div>
        </div>

    );
}

export default ClockTimer;
