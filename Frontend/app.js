// import Dashboard from "./pages/Dashboard.js";
// import Catalog from "./pages/catalog.js";
// import PurchaseLog from "./pages/purchaselog.js";


function App() {
  const [product, setProduct] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [suggestions, setSuggestions] = React.useState([]);
  const [totalCarbon, setTotalCarbon] = React.useState(0);
  const [purchaseCount, setPurchaseCount] = React.useState(0);
  const searchRef = React.useRef(null);

  const [leaderboard, setLeaderboard] = React.useState([]);
const [leaderboardError, setLeaderboardError] = React.useState("");

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

React.useEffect(() => {
  async function loadLeaderboard() {
    try {
      const response = await fetch("http://127.0.0.1:5000/social/leaderboard");
      const data = await response.json();

      if (!response.ok) {
        setLeaderboardError("Could not load leaderboard.");
        return;
      }

      setLeaderboard(data);
      setLeaderboardError("");
    } catch (error) {
      console.error("Leaderboard fetch failed:", error);
      setLeaderboardError("Could not connect to leaderboard.");
    }
  }

  loadLeaderboard();
}, []);
  
  const impactLevel =
    totalCarbon > 40
      ? "High Impact"
      : totalCarbon > 20
      ? "Moderate Impact"
      : "Low Impact";

  function getSuggestion(productName) {
    const p = productName.toLowerCase();

    if (p.includes("beef") || p.includes("burger") || p.includes("steak")) {
      return "Consider replacing beef with chicken, lentils, or tofu to significantly reduce emissions.";
    }

    if (
      p.includes("milk") ||
      p.includes("cheese") ||
      p.includes("butter") ||
      p.includes("cream")
    ) {
      return "Dairy products often have a higher carbon footprint. Consider oat, soy, or almond-based alternatives.";
    }

    if (p.includes("rice")) {
      return "Rice production can create methane emissions. Consider grains such as quinoa or barley.";
    }

    if (
      p.includes("cake") ||
      p.includes("dessert") ||
      p.includes("cookie") ||
      p.includes("biscuit")
    ) {
      return "Baked goods can have hidden emissions from eggs, dairy, and packaging. Consider lower-impact plant-based recipes.";
    }

    if (p.includes("chicken")) {
      return "Chicken has a lower footprint than beef, but plant-based proteins can reduce emissions even more.";
    }

    return "Buying seasonal, local, or minimally processed products can reduce carbon emissions.";
  }

  function getAlternative(productName, carbonValue) {
    const p = productName.toLowerCase();

    if (p.includes("beef") || p.includes("burger") || p.includes("steak")) {
      const altCarbon = Math.max(carbonValue * 0.2, 0.1);
      return {
        name: "Tofu or lentils",
        carbon: altCarbon,
        savings: carbonValue - altCarbon
      };
    }

    if (
      p.includes("milk") ||
      p.includes("cheese") ||
      p.includes("butter") ||
      p.includes("cream")
    ) {
      const altCarbon = Math.max(carbonValue * 0.45, 0.1);
      return {
        name: "Oat milk or soy-based alternative",
        carbon: altCarbon,
        savings: carbonValue - altCarbon
      };
    }

    if (p.includes("rice")) {
      const altCarbon = Math.max(carbonValue * 0.6, 0.1);
      return {
        name: "Quinoa or barley",
        carbon: altCarbon,
        savings: carbonValue - altCarbon
      };
    }

    if (
      p.includes("cake") ||
      p.includes("dessert") ||
      p.includes("cookie") ||
      p.includes("biscuit")
    ) {
      const altCarbon = Math.max(carbonValue * 0.7, 0.1);
      return {
        name: "Plant-based sponge cake",
        carbon: altCarbon,
        savings: carbonValue - altCarbon
      };
    }

    const altCarbon = Math.max(carbonValue * 0.75, 0.1);
    return {
      name: "A plant-based or minimally processed alternative",
      carbon: altCarbon,
      savings: carbonValue - altCarbon
    };
  }
<div className="p-5 bg-purple-50 border border-purple-200 rounded-xl card mt-6">
  <h3 className="text-lg font-semibold mb-3">🏆 Friends Leaderboard</h3>

  {leaderboardError && (
    <p className="text-red-700">{leaderboardError}</p>
  )}

  {!leaderboardError && leaderboard.length === 0 && (
    <p className="text-gray-600">Loading leaderboard...</p>
  )}

  {leaderboard.length > 0 && (
    <ul className="space-y-2">
      {leaderboard.map((user, index) => (
        <li
          key={user.name}
          className="flex justify-between items-center bg-white border border-purple-100 rounded-lg px-4 py-3"
        >
          <span>
            <strong>{index + 1}.</strong> {user.name}
          </span>
          <span>{user.weekly_carbon.toFixed(1)} kg CO₂e</span>
        </li>
      ))}
    </ul>
  )}
</div>
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
      let barColor = "bg-green-500";

      if (data.total_carbon > 20) {
        impact = "High Impact";
        impactColor = "bg-red-100 text-red-700";
        barColor = "bg-red-500";
      } else if (data.total_carbon > 10) {
        impact = "Moderate Impact";
        impactColor = "bg-yellow-100 text-yellow-700";
        barColor = "bg-yellow-500";
      }

      const suggestionText = getSuggestion(data.product);
      const alternativeInfo = getAlternative(data.product, data.total_carbon);

      setResult({
        product: data.product,
        quantity: data.amount,
        carbon: data.total_carbon,
        impact,
        impactColor,
        barColor,
        suggestion: suggestionText,
        alternative: alternativeInfo.name,
        alternativeCarbon: alternativeInfo.carbon,
        savings: alternativeInfo.savings
      });

      setTotalCarbon((prev) => prev + data.total_carbon);
      setPurchaseCount((prev) => prev + 1);
      setSuggestions([]);
    } catch (error) {
      setResult({
        error: "Could not connect to backend."
      });
    }
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

        <div className="mb-6 p-4 bg-blue-50 border rounded-lg card">
          <h2 className="text-lg font-semibold mb-2">Your Carbon Score</h2>

          <p>
            <strong>Total CO₂:</strong> {totalCarbon.toFixed(1)} kg
          </p>

          <p>
            <strong>Purchases Logged:</strong> {purchaseCount}
          </p>

          <p>
            <strong>Impact Level:</strong> {impactLevel}
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
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 result-card">
            {result.error}
          </div>
        )}

        {result && !result.error && (
          <div className="mt-8 space-y-4 result-card">
            <div className="p-5 bg-green-50 border border-green-200 rounded-xl card">
              <h2 className="text-xl font-semibold mb-3">🌍 Carbon Footprint</h2>
              <p><span className="font-medium">Product:</span> {result.product}</p>
              <p><span className="font-medium">Quantity (kg):</span> {result.quantity}</p>
              <p><span className="font-medium">Carbon Footprint:</span> {result.carbon.toFixed(2)} kg CO₂e</p>

              <div className="impact-bar mt-3">
                <div
                  className={`impact-fill ${result.barColor}`}
                  style={{ width: `${Math.min(result.carbon * 5, 100)}%` }}
                ></div>
              </div>

              <div className="mt-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${result.impactColor}`}>
                  {result.impact}
                </span>
              </div>
            </div>

            <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl card">
              <h3 className="text-lg font-semibold mb-2">💡 Suggestion</h3>
              <p className="text-gray-700">{result.suggestion}</p>
            </div>

            <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl card">
              <h3 className="text-lg font-semibold mb-2">♻ Lower-Carbon Alternative</h3>
              <p className="text-gray-700">
                <strong>Alternative:</strong> {result.alternative}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Estimated Alternative Footprint:</strong> {result.alternativeCarbon.toFixed(2)} kg CO₂e
              </p>
              <p className="savings-text">
                Estimated Savings: {result.savings.toFixed(2)} kg CO₂e
              </p>
              <span className="alt-badge">Lower-impact choice</span>
            </div>
          </div>
        )}
        <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl card mt-6">
  <h3 className="text-lg font-semibold mb-3">🏆 Friends Leaderboard</h3>

  {leaderboardError && (
    <p className="text-red-700">{leaderboardError}</p>
  )}

  {!leaderboardError && leaderboard.length === 0 && (
    <p className="text-gray-600">Loading leaderboard...</p>
  )}

  {leaderboard.length > 0 && (
    <ul className="space-y-2">
      {leaderboard.map((user, index) => (
        <li
          key={user.name}
          className="flex justify-between items-center bg-white border border-purple-100 rounded-lg px-4 py-3"
        >
          <span>
            <strong>{index + 1}.</strong> {user.name}
          </span>
          <span>{user.weekly_carbon.toFixed(1)} kg CO₂e</span>
        </li>
      ))}
    </ul>
  )}
</div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
