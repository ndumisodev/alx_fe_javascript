// Array to store quote objects
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Wisdom" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "The mind is everything. What you think you become.", category: "Mindset" }
];

// Get references to DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const addQuoteButton = document.getElementById('addQuoteButton');

/**
 * Displays a random quote from the 'quotes' array in the quoteDisplay area.
 * The quote text and category are updated.
 */
function showRandomQuote() {
    // Check if there are any quotes to display
    if (quotes.length === 0) {
        quoteText.innerHTML = "No quotes available."; // Changed to innerHTML
        quoteCategory.innerHTML = ""; // Changed to innerHTML
        return;
    }

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Update the DOM with the random quote
    quoteText.innerHTML = `"${randomQuote.text}"`; // Changed to innerHTML
    quoteCategory.innerHTML = `- ${randomQuote.category}`; // Changed to innerHTML

    // Optional: Add a fade-in animation class for visual effect
    quoteDisplay.style.animation = 'none'; // Reset animation
    void quoteDisplay.offsetWidth; // Trigger reflow
    quoteDisplay.style.animation = null; // Re-enable animation
}

/**
 * Adds a new quote to the 'quotes' array based on user input from the form.
 * Clears the input fields after adding the quote.
 */
function addQuote() {
    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();

    // Validate input
    if (text === "" || category === "") {
        alert("Please enter both a quote and a category."); // Using alert as per instructions, but a custom modal would be better.
        return;
    }

    // Create a new quote object
    const newQuote = { text, category };

    // Add the new quote to the array
    quotes.push(newQuote);

    // Clear the input fields
    newQuoteTextInput.value = '';
    newQuoteCategoryInput.value = '';

    // Optionally, display the newly added quote or a confirmation
    alert("Quote added successfully!"); // Using alert as per instructions
    showRandomQuote(); // Show a new random quote, which might be the one just added
}

// Add event listeners
// Event listener for the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// Event listener for the "Add Quote" button
// Using addEventListener instead of inline onclick for better practice
addQuoteButton.addEventListener('click', addQuote);

// Initial display of a random quote when the page loads
document.addEventListener('DOMContentLoaded', showRandomQuote);
