document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
   

    function getCartItems() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function saveCartItems(cartItems) {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    function formatCartItemDetails(cartItems) {
        return cartItems.map(item => {
            return `${item.name}${item.size ? ` - Size: ${item.size}` : ''}${item.colour ? ` - Colour: ${item.colour}` : ''} - Quantity: ${item.quantity} - Price: R${(item.price * item.quantity).toFixed(2)}`;
        }).join('<br>');
    }
    
    function formatTotalPrice(totalPrice) {
        return `Total Price: R${totalPrice.toFixed(2)}`;
    }
    
    async function renderCartItems() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;
        const cartItems = getCartItems();
    
        try {
            for (const [index, item] of cartItems.entries()) {
                const response = await fetch(`https://cdn.contentful.com/spaces/ht78ljur62hr/entries/${item.id}?access_token=7JHGTqfyep0EfTv7a33h1E4nFpqoifkRsRHJC-kfta8`);
                const product = await response.json();
                const productData = product.fields;
                const price = productData.price;
                const totalItemPrice = price * item.quantity;
                totalPrice += totalItemPrice;
    
                let imageUrl = 'default-image-url.jpg';
                if (productData.productImage && productData.productImage.length > 0) {
                    const imageAsset = productData.productImage[0];
                    if (imageAsset.sys && imageAsset.sys.id) {
                        const imageResponse = await fetch(`https://cdn.contentful.com/spaces/ht78ljur62hr/assets/${imageAsset.sys.id}?access_token=7JHGTqfyep0EfTv7a33h1E4nFpqoifkRsRHJC-kfta8`);
                        const imageData = await imageResponse.json();
                        if (imageData.fields && imageData.fields.file && imageData.fields.file.url) {
                            imageUrl = `https:${imageData.fields.file.url}`;
                        }
                    }
                }
    
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <img src="${imageUrl}" alt="${productData.name}" style="width: 100px; height: auto;">
                    <div class="cart-item-content">
                    <h3 class="name">${productData.name}</h3>
                    
                    <p>${productData.name} 
                       ${item.size ? `- Size: ${item.size}` : ''}
                       ${item.colour ? `- Colour: ${item.colour}` : ''}
                       <p>Price: R${price}</p>
                    </p></div>
                    <p class="quantity">Quantity:
                    
                    <div class="cart-item-buttons">
                    <div class="quantity-buttons">
                        <button class="decrease" data-id="${item.id}" data-size="${item.size || ''}" data-colour="${item.colour || ''}">-</button>
                        ${item.quantity}
                        <button class="increase" data-id="${item.id}" data-size="${item.size || ''}" data-colour="${item.colour || ''}">+</button>
                    </p>
                    </div>
                    <button class="remove" data-index="${index}">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            }
    
           
           
            const shippingFee = 60.00;
            const finalPrice = totalPrice + shippingFee;            

            if (totalPriceElement) {
                totalPriceElement.textContent = `Subtotal: R${totalPrice.toFixed(2)}`;
            }
            if (shippingFeeElement) {
                shippingFeeElement.textContent = `Shipping Fee: R${shippingFee.toFixed(2)}`;
            }
            if (finalPriceElement) {
                finalPriceElement.textContent = `Total: R${finalPrice.toFixed(2)}`;
            }

            // Update hidden input fields with formatted text
            document.getElementById('cart-items-hidden').value = formatCartItemDetails(cartItems);
            document.getElementById('total-price-hidden').value = finalPrice.toFixed(2);
           
        } catch (error) {
            console.error('Error rendering cart items:', error);
        }
    }

    function removeCartItem(index) {
        let cartItems = getCartItems();
        cartItems.splice(index, 1);
        saveCartItems(cartItems);
        renderCartItems();
        updateCartCount();
    }

    function updateCartCount() {
        const cartItems = getCartItems();
        const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        localStorage.setItem('cartCount', cartCount.toString());
        displayCartCount();
    }

    function displayCartCount() {
        const cartCount = localStorage.getItem('cartCount') || '0';
        const cartSpan = document.getElementById('cart-span');
        if (cartSpan) {
            cartSpan.textContent = cartCount;
        }
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            const button = event.target;
            if (button.classList.contains('increase') || button.classList.contains('decrease')) {
                const productId = button.getAttribute('data-id');
                const size = button.getAttribute('data-size');
                const colour = button.getAttribute('data-colour');
                let cartItems = getCartItems();

                if (button.classList.contains('increase')) {
                    cartItems = cartItems.map(item => 
                        (item.id === productId && item.size === size && item.colour === colour) ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else if (button.classList.contains('decrease')) {
                    cartItems = cartItems.map(item => 
                        (item.id === productId && item.size === size && item.colour === colour) ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
                    ).filter(item => item.quantity > 0);
                }

                saveCartItems(cartItems);
                renderCartItems();
                updateCartCount();
            } else if (button.classList.contains('remove')) {
                const index = parseInt(button.getAttribute('data-index'));
                removeCartItem(index);
            }
        });
    }

    renderCartItems();
    updateCartCount();
});
