// Replace your sessionCountGraph with this component
const SessionCountGraph = ({ count, longBreakInterval }) => {
  // Calculate current progress toward long break
  const current = count === 0 ? 0 : count % longBreakInterval === 0 ? longBreakInterval : count % longBreakInterval;

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: longBreakInterval }).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index < current ? "bg-white" : "bg-white/30"
          }`}
        ></div>
      ))}
    </div>
  );
};

export default SessionCountGraph