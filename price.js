function calculateTotalPrice() {
    // Retrieve cart items from localStorage
    let cartItems = getCartItems();
    
    // Initialize total price variable
    let totalPrice = 0;

    // Loop through cart items and sum up their prices
    cartItems.forEach(item => {
        totalPrice += parseFloat(item.price);
    });

    // Convert total price to ZAR and format it with two decimal places
    let totalPriceZAR = totalPrice.toFixed(2);

    // Return the total price in ZAR
    return `R${totalPriceZAR}`;
}

