function calculateItemAmount(price, quantity) {
    return price * quantity;
  }
  
  function calculateDiscount(subtotal) {
    if (subtotal >= 5000) return subtotal * 0.10;
    else if (subtotal >= 3000) return subtotal * 0.07;
    else if (subtotal >= 1000) return subtotal * 0.05;
    else return 0;
  }
  
  function getDeliveryFee(option) {
    let fee = 0;
    switch (option) {
      case "1": fee = 0; break;
      case "2": fee = 80; break;
      case "3": fee = 150; break;
      default: fee = 0;
    }
    return fee;
  }
  
  const generateBtn = document.getElementById("generateBtn");
  const calculateBtn = document.getElementById("calculateBtn");
  const productsContainer = document.getElementById("productsContainer");
  const validationMessage = document.getElementById("validationMessage");
  const orderSummary = document.getElementById("orderSummary");
  
  generateBtn.addEventListener("click", function () {
    validationMessage.textContent = "";
    orderSummary.textContent = "";
  
    const productCount = Number(document.getElementById("productCount").value);
    if (!productCount || productCount <= 0 || !Number.isInteger(productCount)) {
      validationMessage.textContent = "Please enter a valid positive whole number for Number of Products.";
      productsContainer.innerHTML = "";
      return;
    }
  
    productsContainer.innerHTML = "";
    for (let i = 0; i < productCount; i++) {
      productsContainer.innerHTML += `
        <p>Product ${i + 1}</p>
        Product Name <input type="text" id="productName-${i}"><br>
        Price <input type="number" id="productPrice-${i}"><br>
        Quantity <input type="number" id="productQuantity-${i}"><br><br>
      `;
    }
  });
  
  calculateBtn.addEventListener("click", function () {
    validationMessage.textContent = "";
    orderSummary.textContent = "";
  
    const customerName = document.getElementById("customerName").value.trim();
    const productCount = Number(document.getElementById("productCount").value);
    let errors = [];
  
    if (customerName === "") errors.push("Customer Name cannot be empty.");
    if (!productCount || productCount <= 0 || !Number.isInteger(productCount)) {
      errors.push("Number of Products must be a valid positive whole number.");
      validationMessage.textContent = errors.join("\n");
      return;
    }
  
    const products = [];
    let subtotal = 0;
  
    for (let i = 0; i < productCount; i++) {
      const name = document.getElementById(`productName-${i}`).value.trim();
      const price = parseFloat(document.getElementById(`productPrice-${i}`).value);
      const quantity = parseFloat(document.getElementById(`productQuantity-${i}`).value);
  
      if (name === "") errors.push(`Product ${i + 1}: Product Name cannot be empty.`);
      if (isNaN(price) || price <= 0) errors.push(`Product ${i + 1}: Price must be a valid positive number.`);
      if (isNaN(quantity) || quantity <= 0) errors.push(`Product ${i + 1}: Quantity must be a valid positive number.`);
  
      if (name !== "" && price > 0 && quantity > 0) {
        const amount = calculateItemAmount(price, quantity);
        subtotal += amount;
        products.push({ name, price, quantity, amount });
      }
    }
  
    if (errors.length > 0) {
      validationMessage.textContent = errors.join("\n");
      return;
    }
  
    const deliveryOption = document.getElementById("deliveryOption").value;
    const discountAmount = calculateDiscount(subtotal);
    const deliveryFee = getDeliveryFee(deliveryOption);
    const finalAmount = subtotal - discountAmount + deliveryFee;
  
    let productLines = "";
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      productLines += `\n${i + 1}. ${p.name}\n   Price: ₱${p.price.toFixed(2)}\n   Quantity: ${p.quantity}\n   Amount: ₱${p.amount.toFixed(2)}\n`;
    }
  
    const summary = `MINI STORE CHECKOUT SYSTEM
  
  Customer: ${customerName}
  ${productLines}
  ORDER SUMMARY
  Subtotal: ₱${subtotal.toFixed(2)}
  Discount Amount: ₱${discountAmount.toFixed(2)}
  Delivery Fee: ₱${deliveryFee.toFixed(2)}
  Final Amount: ₱${finalAmount.toFixed(2)}`;
  
    orderSummary.textContent = summary;
    console.log(summary);
  });
