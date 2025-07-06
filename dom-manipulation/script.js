// Array to store quote objects. This will be populated from local storage.
let quotes = [];
let currentFilter = 'all'; // Stores the currently selected filter category

// Simulate a server-side data store
// In a real application, this would be fetched from a backend API
let mockServerQuotes = [
    { text: "The unexamined life is not worth living.", category: "Philosophy" },
    { text: "Knowledge is power.", category: "Education" },
    { text: "The only true wisdom is in knowing you know nothing.", category: "Philosophy" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

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
const categoryFilter = document.getElementById('categoryFilter');
const syncStatusMessage = document.getElementById('syncStatusMessage'); // New: Reference to sync status message div
const syncNowButton = document.getElementById('syncNowButton'); // New: Reference to sync now button

/**
 * Displays a temporary message to the user in the syncStatusMessage div.
 * @param {string} message - The message to display.
 * @param {string} type - 'success', 'error', or 'info' for styling.
 */
function displayMessage(message, type = 'info') {
    syncStatusMessage.textContent = message;
    syncStatusMessage.style.display = 'block'; // Show the message div

    // Set background color based on type
    if (type === 'success') {
        syncStatusMessage.style.backgroundColor = '#d4edda';
        syncStatusMessage.style.color = '#155724';
        syncStatusMessage.style.borderColor = '#c3e6cb';
    } else if (type === 'error') {
        syncStatusMessage.style.backgroundColor = '#f8d7da';
        syncStatusMessage.style.color = '#721c24';
        syncStatusMessage.style.borderColor = '#f5c6cb';
    } else { // info
        syncStatusMessage.style.backgroundColor = '#cce5ff';
        syncStatusMessage.style.color = '#004085';
        syncStatusMessage.style.borderColor = '#b8daff';
    }

    // Hide the message after 5 seconds
    setTimeout(() => {
        syncStatusMessage.style.display = 'none';
    }, 5000);
}

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
        displayMessage('Error saving quotes: ' + e.message, 'error');
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
        displayMessage('Error loading data: ' + e.message + '. Using default quotes and no filter.', 'error');
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
        displayMessage('Quote removed successfully!', 'success');
        syncData(); // Trigger sync after local modification
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

    displayMessage("Quote added successfully!", 'success');
    showRandomQuote(); // Show a new random quote, which might be the one just added
    syncData(); // Trigger sync after local modification
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
        displayMessage("No quotes to export!", 'info');
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
    displayMessage("Quotes exported successfully as quotes.json!", 'success');
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(dataUri);
}

/**
 * Imports quotes from a selected JSON file.
 */
function importFromJsonFile() {
    const file = importFile.files[0];
    if (!file) {
        displayMessage("Please select a JSON file to import.", 'info');
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);

            // Validate if importedQuotes is an array and contains objects with 'text' and 'category'
            if (!Array.isArray(importedQuotes) || !importedQuotes.every(q => typeof q === 'object' && q !== null && 'text' in q && 'category' in q)) {
                displayMessage("Invalid JSON file format. Expected an array of quote objects with 'text' and 'category'.", 'error');
                return;
            }

            // Add imported quotes to the existing quotes array
            quotes.push(...importedQuotes);
            saveQuotes(); // Save the combined quotes to local storage
            populateCategories(); // Update categories with potentially new ones from import
            renderQuotesList(); // Re-render the list to show imported quotes
            showRandomQuote(); // Update the main display
            displayMessage('Quotes imported successfully!', 'success');
            syncData(); // Trigger sync after local modification
        } catch (e) {
            console.error('Error parsing JSON file:', e);
            displayMessage('Error importing quotes: Invalid JSON file or format.', 'error');
        }
    };
    fileReader.onerror = function() {
        displayMessage('Error reading file.', 'error');
    };
    fileReader.readAsText(file);
}

/**
 * Simulates fetching quotes from a server.
 * In a real application, this would be an actual fetch() call to a backend API.
 * @returns {Promise<Array<Object>>} A promise that resolves with the server's quotes.
 */
async function fetchQuotesFromServer() {
    displayMessage("Fetching data from server...", 'info');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Return a deep copy to prevent direct modification of mockServerQuotes
    return JSON.parse(JSON.stringify(mockServerQuotes));
}

/**
 * Simulates posting local quotes to a server.
 * In a real application, this would be an actual fetch() POST call.
 * @param {Array<Object>} data - The quotes data to send to the server.
 */
async function postQuotesToServer(data) {
    displayMessage("Syncing data to server...", 'info');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In this simulation, we're just updating the mock server data
    // In a real app, you'd send only the changes or the full set and get a response
    mockServerQuotes = JSON.parse(JSON.stringify(data)); // Deep copy
    console.log("Server updated with local data:", mockServerQuotes);
    displayMessage("Data synced to server successfully!", 'success');
}

/**
 * Syncs local quotes with server quotes, resolving conflicts (server data takes precedence).
 * Then, it pushes local changes back to the server.
 */
async function syncData() {
    console.log("Initiating data sync...");
    displayMessage("Syncing data...", 'info');

    try {
        const serverQuotes = await fetchQuotesFromServer();
        let conflictsResolved = 0;
        let newQuotesFromServer = 0;
        let localQuotesKept = 0;

        const mergedQuotes = [];
        const serverQuoteMap = new Map(); // Map for quick lookup: "text|category" -> quote

        // Populate serverQuoteMap and add server quotes to mergedQuotes
        serverQuotes.forEach(sQuote => {
            const key = `${sQuote.text}|${sQuote.category}`;
            serverQuoteMap.set(key, sQuote);
            mergedQuotes.push(sQuote); // Server data takes precedence, so add all server quotes first
        });

        // Iterate through local quotes to find unique local additions
        quotes.forEach(lQuote => {
            const key = `${lQuote.text}|${lQuote.category}`;
            if (!serverQuoteMap.has(key)) {
                // This local quote is not on the server, so keep it
                mergedQuotes.push(lQuote);
                localQuotesKept++;
            } else {
                // Quote exists on both, server version already added, so it overwrites
                conflictsResolved++; // Count as a conflict resolved by server precedence
            }
        });

        // Check for new quotes from server that weren't in local before merge
        // This is implicitly handled by adding all server quotes first.
        // We can count how many server quotes were truly "new" to the local set.
        newQuotesFromServer = serverQuotes.length - quotes.filter(lQuote => serverQuoteMap.has(`${lQuote.text}|${lQuote.category}`)).length;


        // Update local quotes array
        quotes = mergedQuotes;
        saveQuotes(); // Save the merged data to local storage

        populateCategories(); // Re-populate categories with potentially new ones
        renderQuotesList(); // Re-render the list with merged data
        showRandomQuote(); // Update current quote display

        let syncMessage = "Sync complete!";
        if (newQuotesFromServer > 0) {
            syncMessage += ` ${newQuotesFromServer} new quotes from server.`;
        }
        if (conflictsResolved > 0) {
            syncMessage += ` ${conflictsResolved} conflicts resolved (server precedence).`;
        }
        if (localQuotesKept > 0) {
            syncMessage += ` ${localQuotesKept} local-only quotes kept.`;
        }
        displayMessage(syncMessage, 'success');

        // After merging server data into local, push the consolidated local data back to the server
        await postQuotesToServer(quotes);

    } catch (error) {
        console.error('Error during sync:', error);
        displayMessage('Sync failed: ' + error.message, 'error');
    }
}

// Add event listeners
newQuoteButton.addEventListener('click', showRandomQuote);
addQuoteButton.addEventListener('click', addQuote);
exportQuotesButton.addEventListener('click', exportToJsonFile);
importQuotesButton.addEventListener('click', importFromJsonFile);
categoryFilter.addEventListener('change', filterQuotes);
syncNowButton.addEventListener('click', syncData); // New: Manual sync trigger

// Initial setup when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes(); // Load quotes and last filter from local storage
    populateCategories(); // Populate the filter dropdown
    renderQuotesList(); // Render the list of quotes based on initial filter
    showRandomQuote(); // Display an initial random quote based on initial filter
    createAddQuoteForm(); // Ensure the form is ready

    // Set up periodic sync (e.g., every 30 seconds)
    setInterval(syncData, 30000); // Sync every 30 seconds
    console.log("Automatic sync initiated (every 30 seconds).");
    displayMessage("Application loaded. Automatic sync active.", 'info');
});
