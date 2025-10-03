import React, { useEffect, useState } from "react";

function ClockTimer({ clockSettings }) {
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
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="flex-1 flex flex-col justify-between items-center">
            <div>
                <h3 className="text-lg drop-shadow-sm text-white text-center">
                    Nothing in this world can take the place of persistence
                </h3>
                <p className="text-center text-sm text-white opacity-80">Calvin Coolidge</p>
            </div>

            <div>
                <div
                    className="text-8xl drop-shadow-sm text-white text-center"
                    style={{
                        fontFeatureSettings: "'tnum'",
                        fontVariantNumeric: "tabular-nums",
                        lineHeight: 1.4,
                        fontWeight: "Bold",
                    }}
                >
                    {formatTime(now)}
                </div>
                {clockSettings.showDate && (
                    <p className="flex justify-center items-center text-lg text-white opacity-80">
                        {formatDate(now)}
                    </p>
                )}
            </div>

            <div>
                <p className="text-lg text-white opacity-80">heelo</p>
            </div>
        </div>

    );
}

export default ClockTimer;
