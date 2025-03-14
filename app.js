class Pokemon {
    constructor(id, name, image, types) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.types = types;
    }
}

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=150';
let allPokemon = [];

// Elementos del DOM
const searchInput = document.getElementById('search');
const pokemonList = document.getElementById('pokemon-list');
const totalElement = document.getElementById('total');

// Cargar datos iniciales
const fetchPokemonData = async () => {
    try {
        // Obtener lista básica
        const response = await fetch(API_URL);
        const { results } = await response.json();
        
        // Obtener detalles completos
        const detailedPokemon = await Promise.all(
            results.map(async (pokemon) => {
                const response = await fetch(pokemon.url);
                const data = await response.json();
                return new Pokemon(
                    data.id,
                    data.name,
                    data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
                    data.types.map(type => type.type.name)
                );
            })
        );
        
        allPokemon = detailedPokemon.sort((a, b) => a.id - b.id);
        renderPokemon(allPokemon);
        updateTotal(allPokemon.length);

    } catch (error) {
        console.error('Error al cargar datos:', error);
        totalElement.textContent = 'Error al cargar los Pokémon';
    }
};

// Renderizar tarjetas
const renderPokemon = (pokemons) => {
    pokemonList.innerHTML = pokemons.map(pokemon => `
        <div class="pokemon-card">
            <img 
                src="${pokemon.image}" 
                alt="${pokemon.name}" 
                class="pokemon-image"
                loading="lazy"
                onerror="this.onerror=null;this.src='https://via.placeholder.com/150?text=Imagen+no+disponible';"
            >
            <div class="pokemon-name">${pokemon.name}</div>
            <div class="pokemon-types">
                ${pokemon.types.map(type => `
                    <span class="type-badge">${type}</span>
                `).join('')}
            </div>
        </div>
    `).join('');
};

// Actualizar contador
const updateTotal = (count) => {
    totalElement.textContent = `Mostrando ${count} Pokémon`;
};

// Filtrado
const filterPokemon = (searchTerm) => {
    const filtered = allPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm) ||
        pokemon.types.some(type => type.includes(searchTerm))
    );
    renderPokemon(filtered);
    updateTotal(filtered.length);
};

// Event listeners
searchInput.addEventListener('input', (e) => {
    filterPokemon(e.target.value.toLowerCase());
});

// Inicialización
fetchPokemonData();

  