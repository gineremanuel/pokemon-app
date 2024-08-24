let myFavs = []
const d = document,
  $fragment = d.createDocumentFragment(),
  $searchInput = d.getElementById('search'),
  $searchBtn = d.querySelector('.searchBtn'),
  $cards = d.querySelector('.cards'),
  getAllPokemons = async() => {
    let result = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=150`)
    return result.data.results
  },
  getSelectedPokemons = async(query) => {
    let pokemons = await getAllPokemons();
    let filteredPokemons = pokemons.filter(pokemon => {
      return pokemon.name.toLowerCase().startsWith(query.toLowerCase())
    })
    return filteredPokemons
  },
  normalizePokeData = async(url) => {
    let result = await axios.get(url)
    const pokemon = {
      name: result.data.name,
      id: result.data.id,
      image: result.data.sprites.front_default,
      type: []
    }
    result.data.types.forEach(el => {
      pokemon.type.push(el.type.name)
    })
    return pokemon
    },
  createCards = async(pokemons) => {
    pokemons.forEach(async(el) => {
      let pokemon = await normalizePokeData(el.url)
      const $pokeCard = d.createElement('card'),
        $pokeImg = d.createElement('img'),
        $pokeName = d.createElement('h3'),
        $pokeTypes = d.createElement('p'),
        $addFavBtn = d.createElement('button'),
        $removeFavBtn = d.createElement('button')
      $pokeCard.classList.add('cardContent')
      $addFavBtn.classList.add(`addBtnId${pokemon.id}`, 'addFavBtn')
      $removeFavBtn.classList.add(`removeBtnId${pokemon.id}`, 'hidden', 'removeFavBtn')
      $addFavBtn.dataset.id = pokemon.id
      $removeFavBtn.dataset.id = pokemon.id
      $pokeImg.setAttribute('src', pokemon.image)
      $pokeName.innerHTML = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      $pokeTypes.innerHTML = `Type: ${pokemon.type}`
      $removeFavBtn.textContent = 'Remove of favs'
      $addFavBtn.textContent = 'Add to favs'
      $pokeCard.appendChild($pokeImg)
      $pokeCard.appendChild($pokeName)
      $pokeCard.appendChild($pokeTypes)
      $pokeCard.appendChild($addFavBtn)
      $pokeCard.appendChild($removeFavBtn)
      $fragment.appendChild($pokeCard)
    })
    setTimeout(() => {
      $cards.appendChild($fragment);;
    }, 1000);
  },
  addToFav = (pokemonId) => {
    myFavs = []
    myFavs = JSON.parse(localStorage.getItem('myFavs')) || [];
    myFavs.push(pokemonId);
    localStorage.setItem('myFavs', JSON.stringify(myFavs));
  },
  removeOfFav = (pokemonId) => {
    myFavs = [];
    myFavs = JSON.parse(localStorage.getItem('myFavs')) || [];
    let filteredFavs = myFavs.filter(id => { 
      return id !== pokemonId
    })
    localStorage.setItem('myFavs', JSON.stringify(filteredFavs))
  }


  d.addEventListener('DOMContentLoaded', async(e) => {
    const pokemons = await getAllPokemons();
    await createCards(pokemons);
  })

d.addEventListener('click', async(e) => {
  e.stopPropagation()
  if(e.target.matches('#searchBtn')) {
   $cards.innerHTML = ''
   const pokemons =  await getSelectedPokemons($searchInput.value);
   await createCards(pokemons);
  }
  if(e.target.matches(`.addBtnId${e.target.dataset.id}`)) {
    addToFav(e.target.dataset.id);
    d.querySelector(`.addBtnId${e.target.dataset.id}`).classList.toggle('hidden')
    d.querySelector(`.removeBtnId${e.target.dataset.id}`).classList.toggle('hidden')
  }
  if(e.target.matches(`.removeBtnId${e.target.dataset.id}`)) {
    removeOfFav(e.target.dataset.id);
    d.querySelector(`.removeBtnId${e.target.dataset.id}`).classList.toggle('hidden')
    d.querySelector(`.addBtnId${e.target.dataset.id}`).classList.toggle('hidden')
  }
});

d.addEventListener("search", async(e) => {
  $cards.innerHTML = ''
  const pokemons = await getAllPokemons();
  await createCards(pokemons);
}) 