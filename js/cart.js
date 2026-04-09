    function loadCart() {
            const cart = JSON.parse(localStorage.getItem('Cart')) || [];
            const container = document.getElementById('cart-list');
            let total = 0;

            if (cart.length === 0) {
                container.innerHTML = "<p>El carrito está vacío.</p>";
                return;
            }

            container.innerHTML = '';

            cart.forEach((item, index) => {
                total += parseFloat(item.price);
                const card = document.createElement("div")
                
                card.className = 'game-card'

                card.innerHTML = `
                    <div class=>
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <h4>${item.name}</h4>
                            <p>$${item.price} USD</p>
                        </div>
                        <button onclick="removeItem(${index})" style="background:none; border:none; color:red; cursor:pointer;">Eliminar</button>
                    </div>
                `;
                container.appendChild(card);
            })

            document.getElementById('total-price').innerText = `$${total.toFixed(2)} USD`;
        }

        function removeItem(borrar) {
            let cart = JSON.parse(localStorage.getItem('Cart')) || [];
            // cart = cart.filter(item => item.id !== borrar);
            cart.splice(borrar, 1);
            localStorage.setItem('Cart', JSON.stringify(cart));
            loadCart();
        }

      function processPurchase() {
    const cart = JSON.parse(localStorage.getItem('Cart')) || [];
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
   
    window.location.href = 'tarjetaCredito.html';
}

        loadCart();