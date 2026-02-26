function showUpgradeModal() {
  document.getElementById("upgradeModal").classList.remove("hidden");
}

function closeUpgrade() {
  document.getElementById("upgradeModal").classList.add("hidden");
}

function handleUpgradeClick() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // Not logged in
    window.location.href = "login.html";
  } else {
    // Logged in
    showUpgradeModal();
  }
}

//upgrade function//
async function upgradePlan(planType) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  
  // Step 1: Create order
  const response = await fetch(
    "https://petal2-backend.onrender.com/create-order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ plan: planType })
    }
  );
  
  const order = await response.json();
  
  // Step 2: Open Razorpay
  const options = {
    key: "rzp_live_SKhRyte22gTj4e", // Put your TEST key here
    amount: order.amount,
    currency: order.currency,
    name: "Petal 💗",
    description: planType + " Plan",
    order_id: order.id,
    handler: async function(response) {
      
      // Step 3: Verify payment
      await fetch(
        "https://petal2-backend.onrender.com/verify-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
        }
      );
      
      alert("Payment successful 💗 Plan activated!");
      location.reload();
    }
  };
  
  const rzp = new Razorpay(options);
  rzp.open();
}
