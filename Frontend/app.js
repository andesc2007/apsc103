function App() {
  const [product, setProduct] = React.useState("");
  const [result, setResult] = React.useState(null);

  async function calculateCarbon() {
    const response = await fetch("http://127.0.0.1:5000/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ product })
    });

    const data = await response.json();
    setResult(data);
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Carbon Tracker</h1>

      <input
        className="border p-2 w-full mb-4"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder="Enter product"
      />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={calculateCarbon}
      >
        Calculate
      </button>

      {result && (
        <div className="mt-4">
          Carbon footprint: {result.carbon}
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);