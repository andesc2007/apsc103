function App() {
  const [product, setProduct] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [suggestions, setSuggestions] = React.useState([]);
  const [totalCarbon, setTotalCarbon] = React.useState(0);
  const [purchaseCount, setPurchaseCount] = React.useState(0);
  const searchRef = React.useRef(null);

  async function calculateCarbon() {
    const amount = parseFloat(quantity);

    if (!product.trim() || !quantity.trim() || isNaN(amount) || amount <= 0) {
      setResult({
        error: "Please enter a valid product name and quantity."
      });
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          product: product,
          amount: amount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          error: data.error || "Something went wrong."
        });
        return;
      }

      let impact = "Low Impact";
      let impactColor = "bg-green-100 text-green-700";

      if (data.total_carbon > 20) {
        impact = "High Impact";
        impactColor = "bg-red-100 text-red-700";
      } else if (data.total_carbon > 10) {
        impact = "Moderate Impact";
        impactColor = "bg-yellow-100 text-yellow-700";
      }
      const impactLevel =
  totalCarbon > 40
    ? "High Impact"
    : totalCarbon > 20
    ? "Moderate Impact"
    : "Low Impact";
    <p>
  <strong>Impact Level:</strong> {impactLevel}
</p>

      setResult({
        product: data.product,
        quantity: data.amount,
        carbon: data.total_carbon,
        impact,
        impactColor,
        suggestion: "Consider buying in bulk or choosing products with less packaging.",
        alternative: "A lower-carbon alternative may be available in the same category."
      });

      setSuggestions([]);
    } catch (error) {
      setResult({
        error: "Could not connect to backend."
      });
    }
  }
  function calculateCarbon() {
  const carbonValue = product.length;

  setResult(carbonValue);

  setTotalCarbon(totalCarbon + carbonValue);
  setPurchaseCount(purchaseCount + 1);
}

  function handleQuantityChange(e) {
    const value = e.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  }

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div className="mb-6 p-4 bg-blue-50 border rounded-lg">
  <h2 className="text-lg font-semibold mb-2">Your Carbon Score</h2>

  <p>
    <strong>Total CO₂:</strong> {totalCarbon.toFixed(1)} kg
  </p>

  <p>
    <strong>Purchases Logged:</strong> {purchaseCount}
  </p>
</div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="relative" ref={searchRef}>
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
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            placeholder="Amount (kg)"
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
              <p><span className="font-medium">Quantity (kg):</span> {result.quantity}</p>
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
