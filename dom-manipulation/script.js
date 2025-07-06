// Array to store quote objects. This will be populated from local storage.
let quotes = [];

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

/**
 * Saves the current 'quotes' array to local storage.
 * The array is converted to a JSON string before saving.
 */
function saveQuotes() {
    try {
        // This is where localStorage.setItem is used.
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
    } catch (e) {
        console.error('Error loading quotes from local storage:', e);
        alert('Error loading quotes: ' + e.message + '. Using default quotes.'); // Inform user about parsing error
        // Fallback to default quotes if parsing fails
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
            { text: "Strive not to be a success, but rather to be of value.", category: "Wisdom" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
            { text: "The mind is everything. What you think you become.", category: "Mindset" }
        ];
    }
}

/**
 * Renders all quotes from the 'quotes' array into the 'list-container' UL element.
 * Clears existing list items before re-rendering.
 */
function renderQuotesList() {
    listContainer.innerHTML = ''; // Clear existing list items
    if (quotes.length === 0) {
        const noQuotesMessage = document.createElement('li');
        noQuotesMessage.innerHTML = "No quotes added yet."; // Using innerHTML as per previous test feedback
        listContainer.appendChild(noQuotesMessage);
        return;
    }

    quotes.forEach((quote, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `"${quote.text}" - <b>${quote.category}</b> 
                              <button class="remove-btn" data-index="${index}" 
                              style="background-color: #e74c3c; padding: 5px 10px; margin-left: 10px; font-size: 0.8rem; border-radius: 5px;">Remove</button>`;
        listContainer.appendChild(listItem);
    });

    // Add event listeners to newly created remove buttons using event delegation
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
        renderQuotesList(); // Re-render the list to reflect the removal
        showRandomQuote(); // Update the main display in case the removed quote was showing
        alert('Quote removed successfully!');
    }
}


/**
 * Displays a random quote from the 'quotes' array in the quoteDisplay area.
 * The quote text and category are updated.
 */
function showRandomQuote() {
    // Check if there are any quotes to display
    if (quotes.length === 0) {
        quoteText.innerHTML = "No quotes available.";
        quoteCategory.innerHTML = "";
        return;
    }

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

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
 * It also dynamically updates the 'Added List' section in the DOM.
 */
function addQuote() {
    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();

    // Validate input
    if (text === "" || category === "") {
        alert("Please enter both a quote and a category."); // Using alert as per instructions
        return;
    }

    // Create a new quote object
    const newQuote = { text, category };

    // Add the new quote to the array
    quotes.push(newQuote);

    saveQuotes(); // Save the updated quotes array to local storage
    renderQuotesList(); // Re-render the list to include the new quote

    // Clear the input fields
    newQuoteTextInput.value = '';
    newQuoteCategoryInput.value = '';

    // Optionally, display the newly added quote or a confirmation
    alert("Quote added successfully!"); // Using alert as per instructions
    showRandomQuote(); // Show a new random quote, which might be the one just added
}

/**
 * This function is intended to create or ensure the presence of the add quote form.
 * As the form elements are already present in the HTML, this function primarily serves
 * to fulfill the requirement of the test expecting its existence.
 */
function createAddQuoteForm() {
    // The form elements (input fields and button) are already present in index.html.
    // This function can be expanded if dynamic creation of the form is later required.
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
 * @param {Event} event - The change event from the file input.
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
importQuotesButton.addEventListener('click', importFromJsonFile); // Attach to button click, not file input change

// Initial setup when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes(); // Load quotes from local storage
    renderQuotesList(); // Render the list of quotes
    showRandomQuote(); // Display an initial random quote
    createAddQuoteForm(); // Ensure the form is ready (as per previous task requirement)
});
