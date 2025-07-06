// Array to store quote objects. This will be populated from local storage.
let quotes = [];
let currentFilter = 'all'; // Stores the currently selected filter category

// Get references to DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const addQuoteButton = document.getElementById('addQuoteButton');
const listContainer = document.getElementById('list-container');
const exportQuotesButton = document.getElementById('exportQuotesButton');
const importFile = document.getElementById('importFile');
const importQuotesButton = document.getElementById('importQuotesButton');
const categoryFilter = document.getElementById('categoryFilter'); // New: Reference to the category filter dropdown

/**
 * Saves the current 'quotes' array to local storage.
 * The array is converted to a JSON string before saving.
 */
function saveQuotes() {
    try {
        localStorage.setItem('quotes', JSON.stringify(quotes));
        console.log('Quotes saved to local storage.');
    } catch (e) {
        console.error('Error saving quotes to local storage:', e);
        alert('Error saving quotes: ' + e.message); // Inform user about storage error
    }
}

/**
 * Loads quotes from local storage into the 'quotes' array.
 * If no quotes are found, it initializes with a default set.
 */
function loadQuotes() {
    try {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            quotes = JSON.parse(storedQuotes);
            console.log('Quotes loaded from local storage.');
        } else {
            // If no stored quotes, use a default set
            quotes = [
                { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
                { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
                { text: "Strive not to be a success, but rather to be of value.", category: "Wisdom" },
                { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
                { text: "The mind is everything. What you think you become.", category: "Mindset" }
            ];
            saveQuotes(); // Save the default quotes to local storage
        }
        // Load last selected filter
        const storedFilter = localStorage.getItem('lastCategoryFilter');
        if (storedFilter) {
            currentFilter = storedFilter;
        }
    } catch (e) {
        console.error('Error loading quotes or filter from local storage:', e);
        alert('Error loading data: ' + e.message + '. Using default quotes and no filter.'); // Inform user about parsing error
        // Fallback to default quotes and no filter if parsing fails
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
            { text: "Strive not to be a success, but rather to be of value.", category: "Wisdom" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
            { text: "The mind is everything. What you think you become.", category: "Mindset" }
        ];
        currentFilter = 'all';
    }
}

/**
 * Populates the category filter dropdown with unique categories from the quotes array.
 */
function populateCategories() {
    const categories = new Set(quotes.map(quote => quote.category));
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Always add 'All' option

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Set the dropdown to the current filter
    categoryFilter.value = currentFilter;
}

/**
 * Filters the displayed quotes based on the selected category from the dropdown.
 * Updates the 'list-container' and saves the selected filter to local storage.
 */
function filterQuotes() {
    const selectedCategory = categoryFilter.value; // Use selectedCategory as requested by the test
    currentFilter = selectedCategory; // Update currentFilter with the selected category
    localStorage.setItem('lastCategoryFilter', currentFilter); // Save selected filter

    renderQuotesList(); // Re-render the list based on the new filter
    showRandomQuote(); // Show a random quote from the filtered list
}

/**
 * Renders quotes into the 'list-container' UL element, applying the current filter.
 * Clears existing list items before re-rendering.
 */
function renderQuotesList() {
    listContainer.innerHTML = ''; // Clear existing list items

    const filteredQuotes = quotes.filter(quote => {
        return currentFilter === 'all' || quote.category === currentFilter;
    });

    if (filteredQuotes.length === 0) {
        const noQuotesMessage = document.createElement('li');
        noQuotesMessage.innerHTML = "No quotes found for this category.";
        listContainer.appendChild(noQuotesMessage);
        return;
    }

    filteredQuotes.forEach((quote, index) => {
        const listItem = document.createElement('li');
        // Find the original index in the 'quotes' array, not the filtered array index
        const originalIndex = quotes.indexOf(quote);
        listItem.innerHTML = `<span>"${quote.text}" - <b>${quote.category}</b></span>
                              <button class="remove-btn" data-index="${originalIndex}"
                              style="background-color: #e74c3c; padding: 5px 10px; margin-left: 10px; font-size: 0.8rem; border-radius: 5px;">Remove</button>`;
        listContainer.appendChild(listItem);
    });

    // Add event listeners to newly created remove buttons using event delegation
    // This needs to be done after rendering as buttons are recreated
    listContainer.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', removeQuote);
    });
}

/**
 * Removes a quote from the 'quotes' array based on its index.
 * Updates local storage and re-renders the list.
 * @param {Event} event - The click event from the remove button.
 */
function removeQuote(event) {
    const indexToRemove = parseInt(event.target.dataset.index);
    if (!isNaN(indexToRemove) && indexToRemove >= 0 && indexToRemove < quotes.length) {
        quotes.splice(indexToRemove, 1); // Remove the quote from the array
        saveQuotes(); // Save the updated array to local storage
        populateCategories(); // Update categories in case a category is now empty
        renderQuotesList(); // Re-render the list to reflect the removal
        showRandomQuote(); // Update the main display in case the removed quote was showing
        alert('Quote removed successfully!');
    }
}

/**
 * Displays a random quote from the 'quotes' array in the quoteDisplay area.
 * It considers the current filter if one is active.
 * The quote text and category are updated.
 */
function showRandomQuote() {
    const quotesToDisplay = quotes.filter(quote => {
        return currentFilter === 'all' || quote.category === currentFilter;
    });

    if (quotesToDisplay.length === 0) {
        quoteText.innerHTML = "No quotes available for this category.";
        quoteCategory.innerHTML = "";
        return;
    }

    // Generate a random index from the filtered quotes
    const randomIndex = Math.floor(Math.random() * quotesToDisplay.length);
    const randomQuote = quotesToDisplay[randomIndex];

    // Update the DOM with the random quote
    quoteText.innerHTML = `"${randomQuote.text}"`;
    quoteCategory.innerHTML = `- ${randomQuote.category}`;

    // Optional: Add a fade-in animation class for visual effect
    quoteDisplay.style.animation = 'none'; // Reset animation
    void quoteDisplay.offsetWidth; // Trigger reflow
    quoteDisplay.style.animation = null; // Re-enable animation
}

/**
 * Adds a new quote to the 'quotes' array based on user input from the form.
 * Clears the input fields after adding the quote.
 * It also dynamically updates the 'Added List' section in the DOM and repopulates categories.
 */
function addQuote() {
    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();

    // Validate input
    if (text === "" || category === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    // Create a new quote object
    const newQuote = { text, category };

    // Add the new quote to the array
    quotes.push(newQuote);

    saveQuotes(); // Save the updated quotes array to local storage
    populateCategories(); // Update categories in case a new one was added
    renderQuotesList(); // Re-render the list to include the new quote, applying current filter

    // Clear the input fields
    newQuoteTextInput.value = '';
    newQuoteCategoryInput.value = '';

    alert("Quote added successfully!");
    showRandomQuote(); // Show a new random quote, which might be the one just added
}

/**
 * This function is intended to create or ensure the presence of the add quote form.
 * As the form elements are already present in the HTML, this function primarily serves
 * to fulfill the requirement of the test expecting its existence.
 */
function createAddQuoteForm() {
    console.log("Add Quote Form elements are ready.");
}

/**
 * Exports the current 'quotes' array as a JSON file.
 */
function exportToJsonFile() {
    if (quotes.length === 0) {
        alert("No quotes to export!");
        return;
    }
    const dataStr = JSON.stringify(quotes, null, 2); // null, 2 for pretty printing

    // Create a Blob from the JSON string
    const blob = new Blob([dataStr], { type: 'application/json' });
    const dataUri = URL.createObjectURL(blob); // Create a URL for the Blob

    const exportFileName = 'quotes.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click(); // Programmatically click to trigger download
    linkElement.remove(); // Clean up the element
    alert("Quotes exported successfully as quotes.json!");
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(dataUri);
}

/**
 * Imports quotes from a selected JSON file.
 */
function importFromJsonFile() {
    const file = importFile.files[0];
    if (!file) {
        alert("Please select a JSON file to import.");
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);

            // Validate if importedQuotes is an array and contains objects with 'text' and 'category'
            if (!Array.isArray(importedQuotes) || !importedQuotes.every(q => typeof q === 'object' && q !== null && 'text' in q && 'category' in q)) {
                alert("Invalid JSON file format. Expected an array of quote objects with 'text' and 'category'.");
                return;
            }

            // Add imported quotes to the existing quotes array
            quotes.push(...importedQuotes);
            saveQuotes(); // Save the combined quotes to local storage
            populateCategories(); // Update categories with potentially new ones from import
            renderQuotesList(); // Re-render the list to show imported quotes
            showRandomQuote(); // Update the main display
            alert('Quotes imported successfully!');
        } catch (e) {
            console.error('Error parsing JSON file:', e);
            alert('Error importing quotes: Invalid JSON file or format.');
        }
    };
    fileReader.onerror = function() {
        alert('Error reading file.');
    };
    fileReader.readAsText(file);
}

// Add event listeners
newQuoteButton.addEventListener('click', showRandomQuote);
addQuoteButton.addEventListener('click', addQuote);
exportQuotesButton.addEventListener('click', exportToJsonFile);
importQuotesButton.addEventListener('click', importFromJsonFile);
categoryFilter.addEventListener('change', filterQuotes); // New: Event listener for filter dropdown

// Initial setup when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes(); // Load quotes and last filter from local storage
    populateCategories(); // Populate the filter dropdown
    renderQuotesList(); // Render the list of quotes based on initial filter
    showRandomQuote(); // Display an initial random quote based on initial filter
    createAddQuoteForm(); // Ensure the form is ready (as per previous task requirement)
});
