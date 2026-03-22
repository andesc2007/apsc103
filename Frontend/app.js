function App() {
  const [product, setProduct] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [suggestions, setSuggestions] = React.useState([]);

  const [transportMode, setTransportMode] = React.useState("");
  const [transportDistance, setTransportDistance] = React.useState("");
  const [transportResult, setTransportResult] = React.useState(null);

  const [energyType, setEnergyType] = React.useState("");
  const [energyAmount, setEnergyAmount] = React.useState("");
  const [energyResult, setEnergyResult] = React.useState(null);

  const [totalCarbon, setTotalCarbon] = React.useState(0);
  const [activityCount, setActivityCount] = React.useState(0);

  const searchRef = React.useRef(null);

  const [leaderboard, setLeaderboard] = React.useState([]);
  const [leaderboardError, setLeaderboardError] = React.useState("");

  const [friendName, setFriendName] = React.useState("");
  const [customFriends, setCustomFriends] = React.useState([]);
  const [selectedFriend, setSelectedFriend] = React.useState(null);

  const mockUsers = [
    {
      name: "Aisha",
      weekly_carbon: 11.2,
      last_week_carbon: 13.0,
      activities_logged: 5,
      recent_update: "Aisha reduced her footprint this week."
    },
    {
      name: "Omar",
      weekly_carbon: 15.6,
      last_week_carbon: 15.1,
      activities_logged: 6,
      recent_update: "Omar logged more transport activity this week."
    },
    {
      name: "Zara",
      weekly_carbon: 9.8,
      last_week_carbon: 11.4,
      activities_logged: 4,
      recent_update: "Zara is currently leading with the lowest weekly score."
    },
    {
      name: "Iman",
      weekly_carbon: 13.4,
      last_week_carbon: 14.7,
      activities_logged: 5,
      recent_update: "Iman made steady progress compared with last week."
    },
    {
      name: "Hana",
      weekly_carbon: 10.7,
      last_week_carbon: 12.8,
      activities_logged: 4,
      recent_update: "Hana made one of the biggest improvements this week."
    },
    {
      name: "Sara",
      weekly_carbon: 14.1,
      last_week_carbon: 13.6,
      activities_logged: 5,
      recent_update: "Sara is working toward a lower-impact week."
    }
  ];

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

        const enrichedData = data.map((user, index) => {
          const fallbackLastWeek = Number((user.weekly_carbon + 1.8).toFixed(1));
          return {
            ...user,
            activities_logged:
              user.activities_logged ?? Math.max(2, Math.round(user.weekly_carbon / 2)),
            last_week_carbon: user.last_week_carbon ?? fallbackLastWeek,
            recent_update:
              user.recent_update ??
              `${user.name} is tracking progress and staying active this week.`
          };
        });

        setLeaderboard(enrichedData);
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

  function getOverallRecommendation() {
    if (totalCarbon > 50) {
      return "Your current footprint is high. Focus on reducing major contributors such as car travel, flights, and high-impact food choices.";
    }
    if (totalCarbon > 20) {
      return "Your footprint is moderate. Small improvements in food, transport, or home energy could make a meaningful difference.";
    }
    return "Your current footprint is relatively low. Continue maintaining lower-impact habits and monitoring your activities.";
  }

  function addFriend() {
    const trimmedName = friendName.trim();

    if (!trimmedName) {
      return;
    }

    const matchedUser = mockUsers.find(
      (user) => user.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!matchedUser) {
      alert("User not found.");
      return;
    }

    setCustomFriends((prev) => {
      const alreadyExists =
        prev.some(
          (friend) => friend.name.toLowerCase() === matchedUser.name.toLowerCase()
        ) ||
        leaderboard.some(
          (friend) => friend.name.toLowerCase() === matchedUser.name.toLowerCase()
        );

      if (alreadyExists) {
        alert("Friend already added.");
        return prev;
      }

      const updated = [...prev, matchedUser];
      updated.sort((a, b) => a.weekly_carbon - b.weekly_carbon);
      return updated;
    });

    setFriendName("");
  }

  function getFriendImpactLevel(carbon) {
    if (carbon > 20) return "High Impact";
    if (carbon > 10) return "Moderate Impact";
    return "Low Impact";
  }

  function getTrendLabel(current, previous) {
    if (current < previous) return "Improved";
    if (current > previous) return "Higher than last week";
    return "No change";
  }

  function getTrendColor(current, previous) {
    if (current < previous) return "text-green-700 bg-green-100";
    if (current > previous) return "text-red-700 bg-red-100";
    return "text-gray-700 bg-gray-100";
  }

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
      setActivityCount((prev) => prev + 1);
      setSuggestions([]);
    } catch (error) {
      setResult({
        error: "Could not connect to backend."
      });
    }
  }

  function calculateTransport() {
    const distance = parseFloat(transportDistance);

    if (!transportMode || !transportDistance.trim() || isNaN(distance) || distance < 0) {
      setTransportResult({
        error: "Please select a valid transport mode and enter a valid distance."
      });
      return;
    }

    const emissionFactors = {
      car: 0.21,
      bus: 0.1,
      train: 0.04,
      bicycle: 0.0,
      walking: 0.0,
      flight: 0.25
    };

    const factor = emissionFactors[transportMode];
    const totalTransportCarbon = factor * distance;

    let impact = "Low Impact";
    let impactColor = "bg-green-100 text-green-700";
    let barColor = "bg-green-500";

    if (totalTransportCarbon > 20) {
      impact = "High Impact";
      impactColor = "bg-red-100 text-red-700";
      barColor = "bg-red-500";
    } else if (totalTransportCarbon > 10) {
      impact = "Moderate Impact";
      impactColor = "bg-yellow-100 text-yellow-700";
      barColor = "bg-yellow-500";
    }

    let suggestion = "Great choice. This transport option has a relatively low footprint.";

    if (transportMode === "car") {
      suggestion = "Consider public transit, carpooling, cycling, or walking for shorter trips.";
    } else if (transportMode === "flight") {
      suggestion = "Flights have a high carbon footprint. Consider rail travel or reducing flight frequency where possible.";
    } else if (transportMode === "bus") {
      suggestion = "Public transit reduces emissions per person compared to private vehicle travel.";
    } else if (transportMode === "train") {
      suggestion = "Rail travel is often one of the lower-carbon long-distance options.";
    }

    setTransportResult({
      mode: transportMode,
      distance,
      carbon: totalTransportCarbon,
      impact,
      impactColor,
      barColor,
      suggestion
    });

    setTotalCarbon((prev) => prev + totalTransportCarbon);
    setActivityCount((prev) => prev + 1);
  }

  function calculateEnergy() {
    const amount = parseFloat(energyAmount);

    if (!energyType || !energyAmount.trim() || isNaN(amount) || amount < 0) {
      setEnergyResult({
        error: "Please select a valid household energy source and enter a valid amount."
      });
      return;
    }

    const emissionFactors = {
      electricity: 0.12,
      natural_gas: 1.89,
      heating_oil: 2.68,
      propane: 1.51
    };

    const units = {
      electricity: "kWh",
      natural_gas: "m³",
      heating_oil: "L",
      propane: "L"
    };

    const factor = emissionFactors[energyType];
    const totalEnergyCarbon = factor * amount;

    let impact = "Low Impact";
    let impactColor = "bg-green-100 text-green-700";
    let barColor = "bg-green-500";

    if (totalEnergyCarbon > 20) {
      impact = "High Impact";
      impactColor = "bg-red-100 text-red-700";
      barColor = "bg-red-500";
    } else if (totalEnergyCarbon > 10) {
      impact = "Moderate Impact";
      impactColor = "bg-yellow-100 text-yellow-700";
      barColor = "bg-yellow-500";
    }

    let suggestion =
      "This energy source is being tracked successfully. Continue monitoring usage over time.";

    if (energyType === "electricity") {
      suggestion =
        "Reducing unnecessary lighting and appliance use can lower electricity-related emissions.";
    } else if (energyType === "natural_gas") {
      suggestion =
        "Improving insulation or lowering thermostat settings can reduce heating-related emissions.";
    } else if (energyType === "heating_oil") {
      suggestion =
        "Heating oil has a relatively high footprint. Consider more efficient heating systems where possible.";
    } else if (energyType === "propane") {
      suggestion =
        "Reducing propane consumption through efficient heating and cooking practices can lower emissions.";
    }

    setEnergyResult({
      type: energyType,
      amount,
      unit: units[energyType],
      carbon: totalEnergyCarbon,
      impact,
      impactColor,
      barColor,
      suggestion
    });

    setTotalCarbon((prev) => prev + totalEnergyCarbon);
    setActivityCount((prev) => prev + 1);
  }

  function handleQuantityChange(e) {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  }

  function handleTransportDistanceChange(e) {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setTransportDistance(value);
    }
  }

  function handleEnergyAmountChange(e) {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setEnergyAmount(value);
    }
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

  const displayedLeaderboard = [...leaderboard, ...customFriends].sort(
    (a, b) => a.weekly_carbon - b.weekly_carbon
  );

  const socialUpdates = displayedLeaderboard.slice(0, 4).map((user, index, arr) => {
    const change = Number((user.weekly_carbon - user.last_week_carbon).toFixed(1));

    let text = user.recent_update;

    if (index === 0) {
      text = `${user.name} is leading your friends leaderboard this week.`;
    } else if (change < 0) {
      text = `${user.name} lowered their footprint by ${Math.abs(change).toFixed(1)} kg CO₂e from last week.`;
    } else if (change > 0) {
      text = `${user.name} is ${change.toFixed(1)} kg CO₂e above last week and still working on improvement.`;
    } else {
      text = `${user.name} matched last week's footprint exactly.`;
    }

    return {
      name: user.name,
      text,
      change
    };
  });

  const mostImprovedFriend =
    displayedLeaderboard.length > 0
      ? [...displayedLeaderboard].sort(
          (a, b) =>
            a.weekly_carbon - a.last_week_carbon - (b.weekly_carbon - b.last_week_carbon)
        )[0]
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-700 mb-2">
            EcoTrack Carbon Footprint Calculator
          </h1>
          <p className="text-gray-600 text-lg">
            Estimate your environmental impact from food, transportation, and household energy usage.
          </p>
        </div>

        <div className="p-5 bg-white border rounded-xl card">
          <h2 className="text-xl font-semibold mb-4">🍽 Product Carbon Footprint</h2>

          <div ref={searchRef} className="mb-4 relative">
            <input
              type="text"
              value={product}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />

            {suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-200 w-full rounded-lg mt-1 shadow-md max-h-48 overflow-y-auto">
                {suggestions.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setProduct(item);
                      setSuggestions([]);
                    }}
                    className="px-4 py-2 hover:bg-green-50 cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              placeholder="Quantity (kg)"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          <button
            onClick={calculateCarbon}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Calculate Product Footprint
          </button>

          {result?.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 result-card">
              {result.error}
            </div>
          )}

          {result && !result.error && (
            <div className="mt-8 space-y-4 result-card">
              <div className="p-5 bg-green-50 border border-green-200 rounded-xl card">
                <h3 className="text-xl font-semibold mb-3">🌍 Carbon Footprint</h3>
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
        </div>

        <div className="mt-10 p-5 bg-white border rounded-xl card">
          <h2 className="text-xl font-semibold mb-4">🚗 Transportation Emissions</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <select
              value={transportMode}
              onChange={(e) => setTransportMode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            >
              <option value="">Select transport mode</option>
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="bicycle">Bicycle</option>
              <option value="walking">Walking</option>
              <option value="flight">Flight</option>
            </select>

            <input
              type="text"
              value={transportDistance}
              onChange={handleTransportDistanceChange}
              placeholder="Distance (km)"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          <button
            onClick={calculateTransport}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Calculate Transport Emissions
          </button>

          {transportResult?.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 result-card">
              {transportResult.error}
            </div>
          )}

          {transportResult && !transportResult.error && (
            <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl result-card card">
              <h3 className="text-xl font-semibold mb-3">🚌 Transport Result</h3>
              <p><span className="font-medium">Mode:</span> {transportResult.mode}</p>
              <p><span className="font-medium">Distance:</span> {transportResult.distance} km</p>
              <p><span className="font-medium">Carbon Footprint:</span> {transportResult.carbon.toFixed(2)} kg CO₂e</p>

              <div className="impact-bar mt-3">
                <div
                  className={`impact-fill ${transportResult.barColor}`}
                  style={{ width: `${Math.min(transportResult.carbon * 5, 100)}%` }}
                ></div>
              </div>

              <div className="mt-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${transportResult.impactColor}`}>
                  {transportResult.impact}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">💡 Suggestion</h4>
                <p className="text-gray-700">{transportResult.suggestion}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 p-5 bg-white border rounded-xl card">
          <h2 className="text-xl font-semibold mb-4">🏠 Household Energy Emissions</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <select
              value={energyType}
              onChange={(e) => setEnergyType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            >
              <option value="">Select energy source</option>
              <option value="electricity">Electricity</option>
              <option value="natural_gas">Natural Gas</option>
              <option value="heating_oil">Heating Oil</option>
              <option value="propane">Propane</option>
            </select>

            <input
              type="text"
              value={energyAmount}
              onChange={handleEnergyAmountChange}
              placeholder="Usage amount"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          <button
            onClick={calculateEnergy}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Calculate Household Energy Emissions
          </button>

          {energyResult?.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 result-card">
              {energyResult.error}
            </div>
          )}

          {energyResult && !energyResult.error && (
            <div className="mt-8 p-5 bg-purple-50 border border-purple-200 rounded-xl result-card card">
              <h3 className="text-xl font-semibold mb-3">⚡ Energy Result</h3>
              <p><span className="font-medium">Source:</span> {energyResult.type.replace("_", " ")}</p>
              <p><span className="font-medium">Usage:</span> {energyResult.amount} {energyResult.unit}</p>
              <p><span className="font-medium">Carbon Footprint:</span> {energyResult.carbon.toFixed(2)} kg CO₂e</p>

              <div className="impact-bar mt-3">
                <div
                  className={`impact-fill ${energyResult.barColor}`}
                  style={{ width: `${Math.min(energyResult.carbon * 5, 100)}%` }}
                ></div>
              </div>

              <div className="mt-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${energyResult.impactColor}`}>
                  {energyResult.impact}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">💡 Suggestion</h4>
                <p className="text-gray-700">{energyResult.suggestion}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl card mt-6">
          <h3 className="text-lg font-semibold mb-3">🏆 Friends Leaderboard</h3>

          <div className="mb-4">
            <input
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="Enter existing user name (e.g. Aisha)"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          <button
            onClick={addFriend}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold mb-4"
          >
            Add Friend
          </button>

          {leaderboardError && customFriends.length === 0 && (
            <p className="text-red-700">{leaderboardError}</p>
          )}

          {displayedLeaderboard.length === 0 && !leaderboardError && (
            <p className="text-gray-600">Loading leaderboard...</p>
          )}

          {displayedLeaderboard.length > 0 && (
            <ul className="space-y-2">
              {displayedLeaderboard.map((user, index) => (
                <li
                  key={`${user.name}-${index}`}
                  onClick={() => setSelectedFriend(user)}
                  className="flex justify-between items-center bg-white border border-purple-100 rounded-lg px-4 py-3 cursor-pointer hover:bg-purple-100 transition"
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

        <div className="mt-6 p-5 bg-white border border-purple-200 rounded-xl card">
          <h3 className="text-xl font-semibold text-purple-700 mb-3">📢 Friends Activity Feed</h3>

          {socialUpdates.length === 0 ? (
            <p className="text-gray-600">Add friends to see social updates.</p>
          ) : (
            <div className="space-y-3">
              {socialUpdates.map((update, index) => (
                <div
                  key={`${update.name}-${index}`}
                  className="bg-purple-50 border border-purple-100 rounded-lg p-4"
                >
                  <p className="text-gray-800">{update.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 p-5 bg-white border border-green-200 rounded-xl card">
          <h3 className="text-xl font-semibold text-green-700 mb-3">📈 Weekly Comparison</h3>

          {displayedLeaderboard.length === 0 ? (
            <p className="text-gray-600">Add friends to compare this week versus last week.</p>
          ) : (
            <div className="space-y-4">
              {mostImprovedFriend && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                  <p className="text-gray-800">
                    <strong>Most Improved:</strong> {mostImprovedFriend.name}{" "}
                    improved by{" "}
                    {Math.abs(
                      mostImprovedFriend.weekly_carbon - mostImprovedFriend.last_week_carbon
                    ).toFixed(1)}{" "}
                    kg CO₂e compared with last week.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {displayedLeaderboard.map((user, index) => {
                  const difference = Number(
                    (user.weekly_carbon - user.last_week_carbon).toFixed(1)
                  );

                  return (
                    <div
                      key={`${user.name}-comparison-${index}`}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-700">
                            This week: {user.weekly_carbon.toFixed(1)} kg CO₂e
                          </p>
                          <p className="text-sm text-gray-700">
                            Last week: {user.last_week_carbon.toFixed(1)} kg CO₂e
                          </p>
                        </div>

                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTrendColor(
                            user.weekly_carbon,
                            user.last_week_carbon
                          )}`}
                        >
                          {getTrendLabel(user.weekly_carbon, user.last_week_carbon)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mt-2">
                        Weekly change:{" "}
                        {difference > 0 ? "+" : ""}
                        {difference.toFixed(1)} kg CO₂e
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {selectedFriend && (
          <div className="mt-6 p-5 bg-white border border-purple-200 rounded-xl card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-purple-700">👤 Friend Profile</h3>
                <p className="text-gray-600">Social snapshot for {selectedFriend.name}</p>
              </div>

              <button
                onClick={() => setSelectedFriend(null)}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-gray-800">
              <p>
                <strong>Name:</strong> {selectedFriend.name}
              </p>
              <p>
                <strong>Weekly Score:</strong> {selectedFriend.weekly_carbon.toFixed(1)} kg CO₂e
              </p>
              <p>
                <strong>Impact Level:</strong> {getFriendImpactLevel(selectedFriend.weekly_carbon)}
              </p>
              <p>
                <strong>Total Activities Logged:</strong> {selectedFriend.activities_logged}
              </p>
              <p>
                <strong>Last Week:</strong> {selectedFriend.last_week_carbon.toFixed(1)} kg CO₂e
              </p>
              <p>
                <strong>Weekly Change:</strong>{" "}
                {(selectedFriend.weekly_carbon - selectedFriend.last_week_carbon).toFixed(1)} kg CO₂e
              </p>
              <p>
                <strong>Recent Update:</strong> {selectedFriend.recent_update}
              </p>
            </div>

            <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-lg">
              <p className="text-sm text-gray-700">
                Detailed product activity remains private. Only summary social stats are shown.
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 p-5 bg-green-50 border border-green-200 rounded-xl card">
          <h2 className="text-xl font-semibold mb-3">📊 Dashboard Summary</h2>
          <p className="mb-2">
            <strong>Total Estimated Footprint:</strong> {totalCarbon.toFixed(2)} kg CO₂e
          </p>
          <p className="mb-2">
            <strong>Total Logged Activities:</strong> {activityCount}
          </p>
          <p className="mb-2">
            <strong>Overall Impact Level:</strong> {impactLevel}
          </p>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">✅ Recommended Next Step</h3>
            <p className="text-gray-700">{getOverallRecommendation()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);