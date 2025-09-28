interface MusicErrorProps {
  onRetry: () => void;
}

const MusicError = ({ onRetry }: MusicErrorProps) => {
  return (
    <div
      style={{
        backgroundColor: "darkslateblue",
        color: "white",
        padding: "1rem",
        borderRadius: "0.5rem",
      }}
    >
      <h2>😔 Sorry, the DJ missed a beat. 😔</h2>
      <p>We couldn't cue up a track right now. Try again?</p>
      <button onClick={onRetry} style={{ backgroundColor: "white" }}>
        Play another song
      </button>
    </div>
  );
};

export default MusicError;


