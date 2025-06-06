interface BookErrorProps {
  onRetry: () => void;
}

const BookError = ({ onRetry }: BookErrorProps) => {
  return (
    <div
      style={{
        backgroundColor: "brown",
        color: "white",
        padding: "1rem",
        borderRadius: "0.5rem",
      }}
    >
      <h2>😔 Our deepest apologies. 😔</h2>
      <p>We seem to have some trouble finding a good book at the moment.</p>
      <button onClick={onRetry} style={{ backgroundColor: "white" }}>
        I demand literature
      </button>
    </div>
  );
};

export default BookError;
