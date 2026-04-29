// ── Get references to the HTML elements we need ─────────────
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsDiv = document.getElementById('results');
const statusMsg = document.getElementById('status-msg');

// ── The main search function ─────────────────────────────────
async function searchRecipes() {

  // Step A — Read what the user typed and remove extra spaces
  const query = searchInput.value.trim();

  // Step B — If the input is empty, tell the user and stop
  if (query === '') {
    statusMsg.textContent = 'Please enter something to search for.';
    return; // stop here — do not run the rest of the function
  }

  // Step C — Disable button + show loading message
  searchBtn.disabled = true;
  searchBtn.textContent = 'Searching...';
  statusMsg.textContent = '⏳ Loading recipes...';
  resultsDiv.innerHTML = ''; // clear previous results

  // Step D — Fetch the API
  try {

    // Build the full URL by joining the base URL with what the user typed
    const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + query;
    const response = await fetch(url);

    // Check the server responded with success
    if (!response.ok) {
      throw new Error('Server error: ' + response.status);
    }

    // Parse the response body into a JavaScript object
    const data = await response.json();

    // Step E — Check if any meals were found
    // The API returns null for meals if nothing matches the search
    if (data.meals === null) {
      statusMsg.textContent = 'No recipes found for "' + query + '".';
    } else {
      // Step F — Display the results
      statusMsg.textContent = data.meals.length + ' recipes found:';
      displayMeals(data.meals); // call the display function (we write this next)
    }

  } catch (error) {
    // If anything above fails, show the error message
    statusMsg.textContent = '❌ Something went wrong: ' + error.message;
  }

  // Step G — Re-enable the button whether it succeeded or failed
  searchBtn.disabled = false;
  searchBtn.textContent = 'Search';
}

// ── Build and insert one card for each meal ──────────────────
function displayMeals(meals) {

  // Loop through every meal in the array
  for (let i = 0; i < meals.length; i++) {

    const meal = meals[i]; // current meal object

    // Build the YouTube button — but only if a YouTube link exists
    // Some meals don't have a video, so we check first
    let videoButton = '';
    if (meal.strYoutube) {
      videoButton = `<a class="watch-btn" href="${meal.strYoutube}" target="_blank">▶ Watch Recipe</a>`;
    }

    // Build the full HTML for one card using a template literal
    const card = `
      <div class="meal-card">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="card-body">
          <h3>${meal.strMeal}</h3>
          <p class="card-meta">🌍 ${meal.strArea}</p>
          <p class="card-meta">🍽️ ${meal.strCategory}</p>
          ${videoButton}
        </div>
      </div>
    `;

    // Add this card to the results container
    resultsDiv.innerHTML += card;
  }
}

// ── Connect button click to the search function ──────────────
searchBtn.addEventListener('click', searchRecipes);

// ── Also allow pressing Enter inside the input box ───────────
searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    searchRecipes();
  }
});