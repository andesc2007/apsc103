function App() {
  const [product, setProduct] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);
  const [result, setResult] = React.useState(null);
  const [suggestions, setSuggestions] = React.useState([]);

  function calculateCarbon() {
    if (!product.trim() || quantity <= 0) {
      setResult({
        error: "Please enter a valid product name and quantity."
      });
      return;
    }

    const carbonValue = product.length * quantity;

    let impact = "Low Impact";
    let impactColor = "bg-green-100 text-green-700";

    if (carbonValue > 20) {
      impact = "High Impact";
      impactColor = "bg-red-100 text-red-700";
    } else if (carbonValue > 10) {
      impact = "Moderate Impact";
      impactColor = "bg-yellow-100 text-yellow-700";
    }

    setResult({
      product,
      quantity,
      carbon: carbonValue,
      impact,
      impactColor,
      suggestion: "Consider buying in bulk or choosing products with less packaging.",
      alternative: "A lower-carbon alternative may be available in the same category."
    });
  }

  async function handleInputChange(e) {
    const value = e.target.value;
    setProduct(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/search?q=${encodeURIComponent(value)}`
      );

      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Search failed:", error);
      setSuggestions([]);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-green-700">
          Carbon Footprint Tracker
        </h1>

        <p className="text-gray-600 mb-6 text-center">
          Log a purchase to estimate its carbon footprint and explore lower-impact choices.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <input
              type="text"
              value={product}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />

            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full border border-gray-300 rounded-lg bg-white max-h-48 overflow-y-auto shadow-md mt-1">
                {suggestions.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setProduct(item);
                      setSuggestions([]);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Quantity"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />
        </div>

        <button
          onClick={calculateCarbon}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          Calculate Footprint
        </button>

        {result?.error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {result.error}
          </div>
        )}

        {result && !result.error && (
          <div className="mt-8 space-y-4">
            <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
              <h2 className="text-xl font-semibold mb-3">Estimated Result</h2>
              <p><span className="font-medium">Product:</span> {result.product}</p>
              <p><span className="font-medium">Quantity:</span> {result.quantity}</p>
              <p><span className="font-medium">Carbon Footprint:</span> {result.carbon} kg CO₂e</p>

              <div className="mt-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${result.impactColor}`}>
                  {result.impact}
                </span>
              </div>
            </div>

            <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Suggestion</h3>
              <p className="text-gray-700">{result.suggestion}</p>
            </div>

            <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Lower-Carbon Alternative</h3>
              <p className="text-gray-700">{result.alternative}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
