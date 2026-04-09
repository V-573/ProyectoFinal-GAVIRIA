const API_KEY = "0e49558b45c9414ca3aeca304b399e5c";
const grid = document.getElementById("game-grid");
let currentPage = 1;
let cache = JSON.parse(localStorage.getItem("datosDePaginas"))||{};
let clave ;


async function fetchGames(page = 1, clave=`paginaAlmacenada_${page}`) {
  grid.innerHTML = '<p class="loading">Buscando novedades...</p>';
 

  if (cache[clave]) {
        console.log("Renderizando desde cache local...");
        renderGames(cache[clave], clave);
        //  updatePaginationUI(data.previous, data.next);
    } else {
        grid.innerHTML = '<p class="loading">Buscando novedades...</p>';
    }

  const url = `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=12`;

  updateCounters()


  try {
    const response = await fetch(url);
    const data = await response.json();
    const resultado = data.results
    cache[clave] = resultado;
    localStorage.setItem("datosDePaginas", JSON.stringify(cache))
   
   
 renderGames(resultado, clave);

    updatePaginationUI(data.previous, data.next);
  } catch (error) {
    console.error("Error cargando los videojuegos", error);
    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "problemas al cargar la api, se cargara lo que hayas visitado previamente y guardara tu proceso de seleccion de favoritos y carrito de compras!",
  });
  }
}

function renderGames(games, clave) {
  console.log("estos son los juegos de la pagina ", games);
console.log("la pagina actual es: ", clave);



grid.innerHTML = ``;
games.forEach((gamePorPagina)=>{
const card = document.createElement("div");
card.className = 'game-card'
card.innerHTML = `
<img src="${gamePorPagina.background_image}" alt="${gamePorPagina.name}">
<div class= "game-info">
    <h3>${gamePorPagina.name}</h3>
    <span class="price-tag">$ ${gamePorPagina.rating} USD</span>
    <div class="btn-group">
        
        <button class="btn-buy" onclick="addToCart('${gamePorPagina.name}', ${gamePorPagina.rating}, ${gamePorPagina.id}, '${gamePorPagina.background_image}')">Comprar</button>
        <button class="btn-fav" onclick="toggleFav(${gamePorPagina.id}, '${gamePorPagina.name}', '${gamePorPagina.background_image}')">❤</button>
                
    </div>
</div>
`;
    grid.appendChild(card);
})
}


function updatePaginationUI(prev, next) {
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const pageText = document.getElementById("page-number");
  pageText.innerText = `Página actual: ${currentPage}`;
  btnPrev.disabled = !prev;
  btnNext.disabled = !next;
}


function changePage(step) {
  currentPage += step;
 clave = `paginaAlmacenada_${currentPage}`
  fetchGames(currentPage, clave);
}


function addToCart(name, price, id, image) {
    let cart = JSON.parse(localStorage.getItem('Cart')) || [];
    cart.push({ name, price, id, image });
    localStorage.setItem('Cart', JSON.stringify(cart));
    updateCounters();
}

function toggleFav(id, name, image) {
    let favs = JSON.parse(localStorage.getItem('Favs')) || [];
    const index = favs.findIndex(f => f.id === id);
    if (index > -1) {
        favs.splice(index, 1);
    } else {
        favs.push({ id, name, image });
    }
    localStorage.setItem('Favs', JSON.stringify(favs));
    updateCounters();
}


function updateCounters() {
    const cart = JSON.parse(localStorage.getItem('Cart')) || [];
    const favs = JSON.parse(localStorage.getItem('Favs')) || [];
    if(document.getElementById('cart-count')) document.getElementById('cart-count').innerText = cart.length;
    if(document.getElementById('fav-count')) document.getElementById('fav-count').innerText = favs.length;
}



fetchGames(currentPage);
