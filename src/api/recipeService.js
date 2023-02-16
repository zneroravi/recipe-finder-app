/**
 * @file src/api/recipeService.js
 * @description Service for interacting with the Edamam Recipe Search API.
 *              Handles fetching recipes based on various search criteria.
 *
 * This service encapsulates all API calls related to recipe data,
 * ensuring a clean separation of concerns and making it easier to
 * manage API keys, error handling, and data transformation.
 */

// Ensure environment variables are loaded. In a Create React App,
// these are automatically available via process.env prefixed with REACT_APP_.
const EDAMAM_API_BASE_URL = process.env.REACT_APP_EDAMAM_API_BASE_URL || 'https://api.edamam.com/api/recipes/v2';
const EDAMAM_APP_ID = process.env.REACT_APP_EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.REACT_APP_EDAMAM_APP_KEY;

/**
 * Validates that the necessary API credentials are set.
 * Throws an error if they are missing, preventing API calls from failing silently.
 */
if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
  console.error('EDAMAM_APP_ID and EDAMAM_APP_KEY must be defined in your environment variables (e.g., .env.development or .env.production).');
  // In a production environment, you might want to throw an error or disable functionality.
  // For development, a console error might suffice, but for robustness, we'll throw.
  // throw new Error('API credentials are not configured. Please check your .env files.');
}

/**
 * Fetches recipes from the Edamam API based on provided search parameters.
 *
 * @param {string} query - The main search query (e.g., ingredients like "chicken, rice").
 * @param {Object} filters - An object containing various filtering options.
 * @param {string[]} [filters.diet] - Array of diet labels (e.g., ['vegetarian', 'vegan']).
 * @param {string[]} [filters.health] - Array of health labels (e.g., ['peanut-free', 'sugar-free']).
 * @param {string[]} [filters.cuisineType] - Array of cuisine types (e.g., ['asian', 'mediterranean']).
 * @param {string[]} [filters.mealType] - Array of meal types (e.g., ['breakfast', 'lunch']).
 * @param {string[]} [filters.dishType] - Array of dish types (e.g., ['soup', 'dessert']).
 * @param {string} [filters.calories] - Calorie range (e.g., '0-500', '500+').
 * @param {string} [filters.time] - Cooking time range in minutes (e.g., '0-30', '30-60').
 * @param {number} [from=0] - Starting index for pagination.
 * @param {number} [to=10] - Ending index for pagination (number of results per page).
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws {Error} If the API call fails or credentials are missing.
 */
export const searchRecipes = async (query, filters = {}, from = 0, to = 10) => {
  if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
    throw new Error('API credentials are not configured. Cannot perform recipe search.');
  }

  const params = new URLSearchParams({
    type: 'public', // Required for Edamam Recipe Search API v2
    q: query,
    app_id: EDAMAM_APP_ID,
    app_key: EDAMAM_APP_KEY,
    from: from.toString(),
    to: to.toString(),
  });

  // Add filters dynamically
  for (const key in filters) {
    if (filters.hasOwnProperty(key) && filters[key]) {
      const value = filters[key];
      if (Array.isArray(value)) {
        value.forEach(item => params.append(key, item));
      } else {
        params.append(key, value);
      }
    }
  }

  const apiUrl = `${EDAMAM_API_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      // Log the full error response for debugging
      console.error(`API Error: ${response.status} - ${response.statusText}`, errorData);
      throw new Error(`Failed to fetch recipes: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in searchRecipes:', error);
    // Re-throw the error to be handled by the calling component/hook
    throw error;
  }
};

/**
 * Fetches a single recipe by its URI.
 * This is useful for displaying detailed information about a specific recipe.
 *
 * @param {string} recipeUri - The URI of the recipe, typically obtained from a search result.
 * @returns {Promise<Object>} A promise that resolves to the detailed recipe data.
 * @throws {Error} If the API call fails or credentials are missing.
 */
export const getRecipeByUri = async (recipeUri) => {
  if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
    throw new Error('API credentials are not configured. Cannot fetch recipe details.');
  }

  // Edamam API requires the URI to be URL-encoded and passed as a 'r' parameter.
  const encodedUri = encodeURIComponent(recipeUri);

  const params = new URLSearchParams({
    type: 'public',
    r: encodedUri,
    app_id: EDAMAM_APP_ID,
    app_key: EDAMAM_APP_KEY,
  });

  const apiUrl = `${EDAMAM_API_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error(`API Error: ${response.status} - ${response.statusText}`, errorData);
      throw new Error(`Failed to fetch recipe details: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    // The Edamam API returns an array for single recipe lookups. We expect one result.
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error in getRecipeByUri:', error);
    throw error;
  }
};

// --- Cross-Project Context / Future Integration Points ---
// While this service currently focuses solely on the Edamam API,
// in a microservice architecture, it might interact with other services.
// For example:
// - User preferences (dietary restrictions, favorite cuisines) could be fetched
//   from a 'User Profile Service' (e.g., part of the Task Management Dashboard's user system).
// - Recipe saving/bookmarking could involve calls to a 'User Data Service'
//   or 'Personalized Recommendations Service'.
// - Analytics on popular searches or viewed recipes could be sent to an
//   'Event Logging Service' (similar to the Serverless Event Ticketing Platform's event processing).
// These are considerations for future enhancements and integration.
// For now, this file remains focused on external recipe API interaction.