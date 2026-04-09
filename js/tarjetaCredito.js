 document.getElementById('credit-card-form').addEventListener('submit', (e) => {
            e.preventDefault(); 

            document.getElementById('checkout-form').style.display = 'none';
            document.getElementById('payment-status').style.display = 'block';

           
            setTimeout(() => {
                document.getElementById('loading-process').style.display = 'none';
                document.getElementById('success-msg').style.display = 'block';
                localStorage.removeItem('Cart');
            }, 3000);
        });