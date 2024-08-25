let myFavs = []
const d = document,
  pokedexURL = "pokedex.html",
  favsURL = "favs.html",
  $fragment = d.createDocumentFragment(),
  $searchInput = d.getElementById('search'),
  $searchBtn = d.querySelector('.searchBtn'),
  $cards = d.querySelector('.cards'),
  getAllPokemons = async() => {
    try {
      let result = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=150`)
      return result.data.results
    } catch (error) {
      console.log(error)
    }
  },
  getSelectedPokemons = async(query) => {
    try {
      let pokemons = await getAllPokemons();
      let filteredPokemons = pokemons.filter(pokemon => {
      return pokemon.name.toLowerCase().startsWith(query.toLowerCase())
    })
    return filteredPokemons
    } catch (error) {
      console.log(error)
    }
  },
  normalizePokeData = async(url) => {
    try {
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
    } catch (error) {
      console.log(error)
    }
    },
  createCards = async(pokemons) => {
    try {
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
        $removeFavBtn.classList.add(`removeBtnId${pokemon.id}`, 'removeFavBtn')
        myFavs = []
        myFavs = JSON.parse(localStorage.getItem('myFavs')) || [];
  
        if(myFavs.indexOf(pokemon.id.toString()) === -1) $removeFavBtn.classList.add('hidden')
        else $addFavBtn.classList.add('hidden')
        
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
    } catch (error) {
      console.log(error)
    }
  },
  getFavs = () => {
    myFavs = [];
    myFavs = JSON.parse(localStorage.getItem('myFavs')) || [];
    let pokemonsUrls = []
    myFavs.map(id => {
      const pokemon = {
        url : `https://pokeapi.co/api/v2/pokemon/${id}`
      }
      pokemonsUrls.push(pokemon)
    })
    return pokemonsUrls
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
    location.reload();
  }


  d.addEventListener('DOMContentLoaded', async(e) => {
    console.log(location.href)
    console.log(window.location)
    if(e.target.location.pathname === pokedexURL) {
      const pokemons = await getAllPokemons();
      await createCards(pokemons);
    } else if (e.target.location.pathname === favsURL) {
      const pokemons = await getFavs();
      await createCards(pokemons)
    }
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