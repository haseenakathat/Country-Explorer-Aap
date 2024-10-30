// Element to display country details
const countryDetails = document.getElementById('country-details');

// Function to fetch detailed information of a country by its name
async function fetchCountryDetails(countryName) {
    try {
        // Fetch country data from the REST Countries API based on country name
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        const data = await response.json(); // Parse response data to JSON format

        // Display the details of the first matching country
        displayCountryDetails(data[0]);
    } catch (error) {
        console.error('Error fetching country details:', error); // Log error if fetch fails
    }
}

// Function to dynamically display country details in the DOM
function displayCountryDetails(country) {
    // Set the HTML content of the 'country-details' element with country information
    countryDetails.innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Top Level Domain:</strong> ${country.tld ? country.tld.join(', ') : 'N/A'}</p>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Area:</strong> ${country.area} km²</p>
        <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
    `;
    // Provides country name, top-level domain, capital, region, population, area, and languages
}

// Retrieve country name from the URL query parameters to fetch details dynamically
const urlParams = new URLSearchParams(window.location.search);
const countryName = urlParams.get('name'); // Get 'name' parameter from the URL
if (countryName) {
    fetchCountryDetails(countryName); // Fetch and display details if a country name is found
}
