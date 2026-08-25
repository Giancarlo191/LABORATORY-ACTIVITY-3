/* =======================================================
   MINI STORE CHECKOUT SYSTEM
   ======================================================= */

/* -------------------------------------------------------
   REQUIRED CALCULATION FUNCTIONS
   (pure functions only — no DOM access, no prompt/alert)
------------------------------------------------------- */

// Returns the amount for a single product line
function calculateItemAmount(price, quantity) {
  return price * quantity;
}

// Returns the DISCOUNT AMOUNT (not the rate) based on subtotal brackets
function calculateDiscount(subtotal) {
  let discount = 0;

  if (subtotal >= 5000) {
    discount = subtotal * 0.10;
  } else if (subtotal >= 3000) {
    discount = subtotal * 0.07;
  } else if (subtotal >= 1000) {
    discount = subtotal * 0.05;
  } else {
    discount = 0;
  }

  return discount;
}

// Returns the delivery fee based on the selected option using a switch statement
function getDeliveryFee(option) {
  let fee = 0;

  switch (option) {
    case "1":
      fee = 0;
      break;
    case "2":
      fee = 80;
      break;
    case "3":
      fee = 150;
      break;
    default:
      fee = 0;
  }

  return fee;
}

// Helper: returns the discount RATE (for display only) — mirrors calculateDiscount's brackets
function getDiscountRate(subtotal) {
  if (subtotal >= 5000) return 10;
  else if (subtotal >= 3000) return 7;
  else if (subtotal >= 1000) return 5;
  else return 0;
}

// Helper: returns the delivery type label for a given option (for display only)
function getDeliveryLabel(option) {
  switch (option) {
    case "1":
      return "Store Pickup";
    case "2":
      return "Standard Delivery";
    case "3":
      return "Express Delivery";
    default:
      return "Unknown";
  }
}

// Helper: formats a number as Philippine peso currency
function formatPeso(amount) {
  return "₱" + amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/* -------------------------------------------------------
   DOM / INPUT-OUTPUT HANDLING
------------------------------------------------------- */

const generateBtn = document.getElementById("generateBtn");
const calculateBtn = document.getElementById("calculateBtn");
const productsContainer = document.getElementById("productsContainer");
const validationMessage = document.getElementById("validationMessage");
const orderSummary = document.getElementById("orderSummary");

// Generates the dynamic product input fields using a for loop
generateBtn.addEventListener("click", function () {
  validationMessage.textContent = "";
  orderSummary.textContent = "";

  const productCount = Number(document.getElementById("productCount").value);

  if (!productCount || productCount <= 0 || !Number.isInteger(productCount)) {
    validationMessage.textContent = "Please enter a valid positive whole number for Number of Products.";
    productsContainer.innerHTML = "";
    return;
  }

  productsContainer.innerHTML = ""; // clear previous fields

  for (let i = 0; i < productCount; i++) {
    const block = document.createElement("div");
    block.className = "product-block";

    block.innerHTML = `
      <h3>Product ${i + 1}</h3>
      <div class="product-row">
        <div class="field">
          <label for="productName-${i}">Product Name</label>
          <input type="text" id="productName-${i}" placeholder="e.g. Keyboard">
        </div>
        <div class="field">
          <label for="productPrice-${i}">Price</label>
          <input type="number" id="productPrice-${i}" placeholder="0.00" step="0.01">
        </div>
        <div class="field">
          <label for="productQuantity-${i}">Quantity</label>
          <input type="number" id="productQuantity-${i}" placeholder="1" step="1">
        </div>
      </div>
    `;

    productsContainer.appendChild(block);
  }
});

// Main calculation and output logic
calculateBtn.addEventListener("click", function () {
  validationMessage.textContent = "";
  orderSummary.textContent = "";

  const customerName = document.getElementById("customerName").value.trim();
  const productCount = Number(document.getElementById("productCount").value);

  let errors = [];

  // --- Validation ---
  if (customerName === "") {
    errors.push("Customer Name cannot be empty.");
  }

  if (!productCount || productCount <= 0 || !Number.isInteger(productCount)) {
    errors.push("Number of Products must be a valid positive whole number.");
    validationMessage.textContent = errors.join("\n");
    return;
  }

  const products = []; // will hold { name, price, quantity, amount }
  let subtotal = 0;

  // Use a for loop to read and validate each product's inputs
  for (let i = 0; i < productCount; i++) {
    const nameField = document.getElementById(`productName-${i}`);
    const priceField = document.getElementById(`productPrice-${i}`);
    const quantityField = document.getElementById(`productQuantity-${i}`);

    if (!nameField || !priceField || !quantityField) {
      errors.push(`Product ${i + 1}: input fields not found. Click "Generate Product Fields" first.`);
      continue;
    }

    const name = nameField.value.trim();
    const price = parseFloat(priceField.value);
    const quantity = parseFloat(quantityField.value);

    if (name === "") {
      errors.push(`Product ${i + 1}: Product Name cannot be empty.`);
    }

    if (isNaN(price) || price <= 0) {
      errors.push(`Product ${i + 1}: Price must be a valid positive number.`);
    }

    if (isNaN(quantity) || quantity <= 0) {
      errors.push(`Product ${i + 1}: Quantity must be a valid positive number.`);
    }

    if (name !== "" && !isNaN(price) && price > 0 && !isNaN(quantity) && quantity > 0) {
      const amount = calculateItemAmount(price, quantity);
      subtotal += amount; // accumulator
      products.push({ name, price, quantity, amount });
    }
  }

  if (errors.length > 0) {
    validationMessage.textContent = errors.join("\n");
    return;
  }

  validationMessage.textContent = "";

  // --- Discount, delivery fee, and final amount ---
  const deliveryOption = document.getElementById("deliveryOption").value;

  const discountRate = getDiscountRate(subtotal);
  const discountAmount = calculateDiscount(subtotal);
  const deliveryFee = getDeliveryFee(deliveryOption);
  const deliveryLabel = getDeliveryLabel(deliveryOption);

  const finalAmount = subtotal - discountAmount + deliveryFee;

  // --- Build the order summary using template literals ---
  let productLines = "";
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    productLines += `
${i + 1}. ${p.name}
   Price: ${formatPeso(p.price)}
   Quantity: ${p.quantity}
   Amount: ${formatPeso(p.amount)}
`;
  }

  const summary = `MINI STORE CHECKOUT SYSTEM

Customer: ${customerName}
${productLines}
ORDER SUMMARY
Subtotal: ${formatPeso(subtotal)}
Discount Rate: ${discountRate}%
Discount Amount: ${formatPeso(discountAmount)}
Delivery Type: ${deliveryLabel}
Delivery Fee: ${formatPeso(deliveryFee)}
Final Amount: ${formatPeso(finalAmount)}`;

  orderSummary.textContent = summary;

  // Optional debugging output
  console.log(summary);
});
