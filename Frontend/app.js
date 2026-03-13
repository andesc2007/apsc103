function App() {
  const [product, setProduct] = React.useState("");
  const [result, setResult] = React.useState("");

  function calculateCarbon() {
    const carbonValue = product.length;
    setResult(`Carbon footprint value: ${carbonValue}`);
  }

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Carbon Tracker</h1>

      <p className="text-gray-600 mb-4 text-center">
        Enter a product name and calculate a simple test value.
      </p>

      <input
        type="text"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder="Enter product name"
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
      />

      <button
        onClick={calculateCarbon}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
      >
        Calculate
      </button>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border rounded-lg">
          {result}
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);