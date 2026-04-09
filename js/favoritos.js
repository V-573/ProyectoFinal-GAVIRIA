function loadFavorites() {
            const favs = JSON.parse(localStorage.getItem('Favs')) || [];
            const container = document.getElementById('favs-grid');

            if (favs.length === 0) {
                container.innerHTML = '<div class="no-favs"><h3>No has guardado favoritos todavía.</h3></div>';
                return;
            }
 container.innerHTML = '';
             favs.forEach((game) => {
const card = document.createElement("div");
card.className = 'game-card'
    card.innerHTML = `             
                    <img src="${game.image}" alt="${game.name}">
                    <div class="game-info">
                        <h3>${game.name}</h3>
                        <button class="btn-fav" onclick="removeFav(${game.id})" style="background:#ff4b2b; color:white; width:100%; border:none;">
                            Quitar de favoritos
                        </button>
                    </div>
                    `;
             container.appendChild(card);
        })
    }

        function removeFav(id) {
            let favs = JSON.parse(localStorage.getItem('Favs')) || [];
            favs = favs.filter(f => f.id !== id);
            localStorage.setItem('Favs', JSON.stringify(favs));
            loadFavorites(); 
        }

        loadFavorites();