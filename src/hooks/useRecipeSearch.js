```javascript
import { useState, useEffect, useCallback } from 'react';
import { searchRecipes } from '../api/recipeService';

/**
 * @typedef {Object} Recipe
 * @property {string} id - Unique identifier for the recipe.
 * @property {string} title - The name of the recipe.
 * @property {string} imageUrl - URL to the recipe's main image.
 * @property {string} sourceUrl - URL to the original recipe source.
 * @property {number} servings - Number of servings the recipe yields.
 * @property {number} readyInMinutes - Estimated time to prepare the recipe in minutes.
 * @property {Array<string>} ingredients - A list of key ingredients.
 * @property {Array<string>} dietaryInfo - A list of dietary tags (e.g., 'vegetarian', 'gluten-free').
 */

/**
 * Custom hook for searching recipes based on ingredients and dietary preferences.
 * It manages the state for recipes, loading status, errors, current search parameters,
 * and pagination.
 *
 * @param {string[]} initialIngredients - An array of ingredients to start the search with.
 * @param {string[]} initialDietaryPreferences - An array of dietary preferences (e.g., 'vegetarian', 'vegan').
 * @param {number} initialPage - The initial page number to fetch results from.
 * @param {number} pageSize - The number of results to fetch per page.
 * @returns {{
 *   recipes: Recipe[],
 *   loading: boolean,
 *   error: string | null,
 *   ingredients: string[],
 *   dietaryPreferences: string[],
 *   currentPage: number,
 *   totalPages: number,
 *   totalResults: number,
 *   search: (newIngredients: string[], newDietaryPreferences: string[]) => Promise<void>,
 *   goToPage: (page: number) => Promise<void>
 * }} An object containing search results, state, and control functions.
 */
const useRecipeSearch = (
  initialIngredients = [],
  initialDietaryPreferences = [],
  initialPage = 1,
  pageSize = 10 // Sensible default page size
) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // State to keep track of the *currently active* search parameters
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [dietaryPreferences, setDietaryPreferences] = useState(initialDietaryPreferences);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  /**
   * Internal function to perform the actual API call and update state.
   * This function is memoized with useCallback to prevent unnecessary re-creations.
   *
   * @param {string[]} currentIngredients - The ingredients to search for.
   * @param {string[]} currentDietaryPreferences - The dietary preferences for the search.
   * @param {number} page - The page number to fetch.
   */
  const performSearch = useCallback(async (currentIngredients, currentDietaryPreferences, page) => {
    setLoading(true);
    setError(null);
    setRecipes([]); // Clear previous recipes immediately when a new search starts

    try {
      const response = await searchRecipes(
        currentIngredients,
        currentDietaryPreferences,
        page,
        pageSize
      );

      setRecipes(response.recipes);
      setTotalResults(response.totalResults);
      // Calculate total pages, ensuring at least 1 page if there are results
      setTotalPages(Math.max(1, Math.ceil(response.totalResults / pageSize)));
      setCurrentPage(page);
      // Update the internal state to reflect the parameters of the successful search
      setIngredients(currentIngredients);
      setDietaryPreferences(currentDietaryPreferences);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      setError(err.message || 'Failed to fetch recipes. Please check your connection or try again.');
      setRecipes([]);
      setTotalResults(0);
      setTotalPages(0);
      setCurrentPage(1); // Reset page on error
    } finally {
      setLoading(false);
    }
  }, [pageSize]); // pageSize is a stable prop, so it's safe in dependencies

  // Effect hook to trigger an initial search when the component mounts
  // or when the initial parameters provided to the hook change.
  useEffect(() => {
    // Only perform an initial search if there are actual search criteria
    // to avoid an unnecessary empty search on mount if the hook is initialized empty.
    if (initialIngredients.length > 0 || initialDietaryPreferences.length > 0) {
      performSearch(initialIngredients, initialDietaryPreferences, initialPage);
    }
  }, [initialIngredients, initialDietaryPreferences, initialPage, performSearch]);

  /**
   * Public function to initiate a new recipe search with updated criteria.
   * This function will always reset the page to 1 for a new search.
   *
   * @param {string[]} newIngredients - The new array of ingredients for the search.
   * @param {string[]} newDietaryPreferences - The new array of dietary preferences for the search.
   */
  const search = useCallback((newIngredients, newDietaryPreferences) => {
    // When a new search is initiated, always start from the first page.
    performSearch(newIngredients, newDietaryPreferences, 1);
  }, [performSearch]);

  /**
   * Public function to navigate to a specific page of the *current* search results.
   * It re-uses the last successful search criteria.
   *
   * @param {number} page - The page number to navigate to.
   */
  const goToPage = useCallback((page) => {
    // Ensure the requested page is valid and different from the current page
    if (page > 0 && page <= totalPages && page !== currentPage) {
      performSearch(ingredients, dietaryPreferences, page);
    }
  }, [ingredients, dietaryPreferences, currentPage, totalPages, performSearch]);

  return {
    recipes,
    loading,
    error,
    ingredients, // Expose the ingredients that were last successfully searched
    dietaryPreferences, // Expose the dietary preferences that were last successfully searched
    currentPage,
    totalPages,
    totalResults,
    search, // Function to initiate a new search
    goToPage, // Function to navigate pages of the current search
  };
};

export default useRecipeSearch;
```