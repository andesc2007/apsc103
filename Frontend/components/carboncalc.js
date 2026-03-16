function CarbonCalculator() {

  const [product, setProduct] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);
  const [result, setResult] = React.useState(null);

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

  return (
    <div>
      <h2>Carbon Calculator</h2>

      <input
        type="text"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder="Enter product name"
      />

      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <button onClick={calculateCarbon}>
        Calculate Footprint
      </button>

      {result && (
        <div>
          <p>Carbon Footprint: {result.carbon}</p>
          <p>{result.impact}</p>
        </div>
      )}

    </div>
  );
}

window.CarbonCalculator = CarbonCalculator;