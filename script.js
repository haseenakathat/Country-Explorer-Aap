// Select DOM elements
const countryList = document.getElementById('country-list');
const searchInput = document.getElementById('search');
const showMoreButton = document.getElementById('show-more');
const favoritesList = document.getElementById('favorites-list');
const regionFilter = document.getElementById('region-filter');
const languageFilter = document.getElementById('language-filter');
const suggestionsDropdown = document.getElementById('suggestions');

// Pagination variables
let currentPage = 1;
const pageSize = 10; // Number of countries to display per page
let allCountries = []; // Array to store all countries data
let favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Load favorites from local storage

// Fetches the list of countries from the API and displays the initial set
async function fetchCountries(page = 1) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/all`);
        const data = await response.json();
        allCountries = data; // Store all countries
        displayCountries(data.slice(0, pageSize)); // Display the first page of countries
    } catch (error) {
        console.error('Error fetching countries:', error); // Handle fetch errors
    }
}

// Displays a given list of countries on the page
function displayCountries(countries) {
    countryList.innerHTML = ''; // Clear previous countries
    countries.forEach(country => {
        const countryCard = document.createElement('div'); // Create a card for each country
        countryCard.className = 'country-card';
        countryCard.innerHTML = `
            <h2>${country.name.common}</h2>
            <img src="${country.flags.png}" alt="${country.name.common} flag" />
            <button class="favorite-btn" data-country="${country.name.common}">
                ${favorites.includes(country.name.common) ? '❤️' : '🤍'}
            </button>
        `;
        // Redirect to details page on card click
        countryCard.addEventListener('click', () => {
            window.location.href = `details.html?name=${country.name.common}`;
        });
        countryList.appendChild(countryCard); // Append the card to the list
    });
}

// Toggles the favorite status of a country and updates the display
function toggleFavorite(countryName) {
    if (favorites.includes(countryName)) {
        favorites = favorites.filter(name => name !== countryName); // Remove from favorites
    } else {
        if (favorites.length < 5) {
            favorites.push(countryName); // Add to favorites if under limit
        } else {
            alert('You can only have 5 favorites!'); // Alert if limit reached
        }
    }
    localStorage.setItem('favorites', JSON.stringify(favorites)); // Save favorites to local storage
    updateFavoritesDisplay(); // Update favorites display
}

// Updates the favorite countries display
function updateFavoritesDisplay() {
    favoritesList.innerHTML = ''; // Clear previous favorites
    favorites.forEach(favorite => {
        const favoriteItem = document.createElement('div'); // Create a div for each favorite
        favoriteItem.innerText = favorite;
        favoritesList.appendChild(favoriteItem); // Append to favorites list
    });
}

// Handles "Show More" button click to load more countries
showMoreButton.addEventListener('click', () => {
    const nextCountries = allCountries.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    if (nextCountries.length > 0) {
        displayCountries(nextCountries); // Display next set of countries
        currentPage++; // Increment current page
    } else {
        showMoreButton.style.display = 'none'; // Hide button if no more countries
    }
});

// Filters countries based on search input, region, and language
function filterCountries() {
    const searchTerm = searchInput.value.toLowerCase(); // Get search term
    const selectedRegion = regionFilter.value; // Get selected region
    const selectedLanguage = languageFilter.value; // Get selected language

    const filteredCountries = allCountries.filter(country => {
        const matchesSearch = country.name.common.toLowerCase().includes(searchTerm); // Check search match
        const matchesRegion = selectedRegion ? country.region === selectedRegion : true; // Check region match
        const matchesLanguage = selectedLanguage ? country.languages && Object.values(country.languages).includes(selectedLanguage) : true; // Check language match
        return matchesSearch && matchesRegion && matchesLanguage; // Return true if all conditions match
    });

    displayCountries(filteredCountries); // Display filtered countries
    currentPage = 1; // Reset current page
}

// Shows suggestions dropdown with limited matching countries below search input
function showSuggestions() {
    const searchTerm = searchInput.value.toLowerCase(); // Get search term
    const matchingCountries = allCountries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Limit suggestions to 5 countries

    suggestionsDropdown.innerHTML = ''; // Clear previous suggestions

    if (searchTerm && matchingCountries.length > 0) {
        suggestionsDropdown.style.display = 'block'; // Show dropdown below search input

        // Position dropdown directly below search input
        const searchRect = searchInput.getBoundingClientRect();
        suggestionsDropdown.style.top = `${searchRect.bottom + window.scrollY}px`;
        suggestionsDropdown.style.left = `${searchRect.left + window.scrollX}px`;
        suggestionsDropdown.style.width = `${searchRect.width}px`;

        matchingCountries.forEach(country => {
            const suggestion = document.createElement('div'); // Create suggestion for each matching country
            suggestion.textContent = country.name.common;
            suggestion.addEventListener('click', () => {
                searchInput.value = country.name.common; // Set search input to selected suggestion
                suggestionsDropdown.style.display = 'none'; // Hide dropdown
                filterCountries(); // Show only this country
            });
            suggestionsDropdown.appendChild(suggestion); // Append suggestion
        });

        // Add 'View all' option
        const viewAllOption = document.createElement('div');
        viewAllOption.textContent = 'View all';
        viewAllOption.className = 'view-all';
        viewAllOption.addEventListener('click', () => {
            suggestionsDropdown.style.display = 'none'; // Hide dropdown
            filterCountries(); // Show all matching countries
        });
        suggestionsDropdown.appendChild(viewAllOption); // Append view all option
    } else {
        suggestionsDropdown.style.display = 'none'; // Hide dropdown if no matches
    }
}

// Hide suggestions when clicking outside the search or dropdown area
document.addEventListener('click', (e) => {
    if (!e.target.closest('#search') && !e.target.closest('#suggestions')) {
        suggestionsDropdown.style.display = 'none'; // Hide suggestions
    }
});

// Event listeners for filtering
regionFilter.addEventListener('change', filterCountries); // Filter on region change
languageFilter.addEventListener('change', filterCountries); // Filter on language change
searchInput.addEventListener('input', () => {
    filterCountries(); // Filter countries on input
    showSuggestions(); // Show suggestions based on input
});

// Toggle favorite when favorite button is clicked
countryList.addEventListener('click', (event) => {
    if (event.target.classList.contains('favorite-btn')) {
        const countryName = event.target.getAttribute('data-country'); // Get country name from button data
        toggleFavorite(countryName); // Toggle favorite status
        event.target.innerText = favorites.includes(countryName) ? '❤️' : '🤍'; // Update button icon
    }
});

// Initial load of countries and favorites
fetchCountries(); // Fetch and display countries
updateFavoritesDisplay(); // Update the display of favorites
