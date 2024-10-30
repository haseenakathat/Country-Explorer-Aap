const countryList = document.getElementById('country-list');
const searchInput = document.getElementById('search');
const showMoreButton = document.getElementById('show-more');
const favoritesList = document.getElementById('favorites-list');
const regionFilter = document.getElementById('region-filter');
const languageFilter = document.getElementById('language-filter');

let currentPage = 1;
const pageSize = 10; // Define your page size here
let allCountries = []; // To store all fetched countries
let favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Get favorites from local storage

// Fetch countries data from the REST Countries API
async function fetchCountries(page = 1) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/all`);
        const data = await response.json();
        allCountries = data; // Store fetched countries for future use
        displayCountries(data.slice(0, pageSize)); // Display initial countries
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

// Display countries in the country list
function displayCountries(countries) {
    countryList.innerHTML = ''; // Clear current list before displaying new countries
    countries.forEach(country => {
        const countryCard = document.createElement('div');
        countryCard.className = 'country-card';
        countryCard.innerHTML = `
            <h2>${country.name.common}</h2>
            <img src="${country.flags.png}" alt="${country.name.common} flag" />
            <button class="favorite-btn" data-country="${country.name.common}">
                ${favorites.includes(country.name.common) ? '❤️' : '🤍'}
            </button>
        `;
        // Add click event to navigate to details page
        countryCard.addEventListener('click', () => {
            window.location.href = `details.html?name=${country.name.common}`;
        });
        countryList.appendChild(countryCard);
    });
}

// Toggle favorite status
function toggleFavorite(countryName) {
    if (favorites.includes(countryName)) {
        favorites = favorites.filter(name => name !== countryName); // Remove from favorites
    } else {
        if (favorites.length < 5) {
            favorites.push(countryName); // Add to favorites
        } else {
            alert('You can only have 5 favorites!'); // Limit to 5 favorites
        }
    }
    localStorage.setItem('favorites', JSON.stringify(favorites)); // Update local storage
    updateFavoritesDisplay(); // Refresh favorites display
}

// Update favorites display
function updateFavoritesDisplay() {
    favoritesList.innerHTML = ''; // Clear current favorites
    favorites.forEach(favorite => {
        const favoriteItem = document.createElement('div');
        favoriteItem.innerText = favorite;
        favoritesList.appendChild(favoriteItem);
    });
}

// Show more countries
showMoreButton.addEventListener('click', () => {
    const nextCountries = allCountries.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    if (nextCountries.length > 0) {
        displayCountries(nextCountries);
        currentPage++;
    } else {
        showMoreButton.style.display = 'none'; // Hide button if no more countries
    }
});

// Filter countries based on search term, region, and language
function filterCountries() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedRegion = regionFilter.value;
    const selectedLanguage = languageFilter.value;

    const filteredCountries = allCountries.filter(country => {
        const matchesSearch = country.name.common.toLowerCase().includes(searchTerm);
        const matchesRegion = selectedRegion ? country.region === selectedRegion : true;
        const matchesLanguage = selectedLanguage ? country.languages && Object.values(country.languages).includes(selectedLanguage) : true;

        return matchesSearch && matchesRegion && matchesLanguage;
    });

    displayCountries(filteredCountries); // Display filtered countries
    currentPage = 1; // Reset current page for filtered results
}

// Event listeners for filters
regionFilter.addEventListener('change', filterCountries);
languageFilter.addEventListener('change', filterCountries);
searchInput.addEventListener('input', filterCountries);

// Event delegation for favorite button clicks
countryList.addEventListener('click', (event) => {
    if (event.target.classList.contains('favorite-btn')) {
        const countryName = event.target.getAttribute('data-country');
        toggleFavorite(countryName); // Toggle favorite status
        event.target.innerText = favorites.includes(countryName) ? '❤️' : '🤍'; // Update button icon
    }
});

// Initial fetch and display setup on page load
fetchCountries();
updateFavoritesDisplay(); // Update favorites display on load
