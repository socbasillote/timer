import React, { useEffect, useState } from "react";

function ClockTimer({ clockSettings, username, animate }) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
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
            <div className="">

                <div>
                    <h6 className="text-sm drop-shadow-sm text-white text-center">
                        Nothing in this world can take the place of persistence
                    </h6>
                    <p className="text-center text-xs text-white opacity-80">Calvin Coolidge</p>
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
