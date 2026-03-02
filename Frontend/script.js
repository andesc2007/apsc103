async function calculateCarbon() {
    const product = document.getElementById("productInput").value;

    const response = await fetch("http://127.0.0.1:5000/calculate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ product: product })
    });

    const data = await response.json();

    document.getElementById("result").innerHTML =
        `<h3>${data.product}</h3>
         <p>Carbon footprint: ${data.carbon} kg CO₂</p>`;
}