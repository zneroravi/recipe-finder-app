import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import RecipeList from './components/RecipeList';
import useRecipeSearch from './hooks/useRecipeSearch';

/**
 * App Component
 *
 * This is the main application component for the Recipe Finder App.
 * It orchestrates the search functionality, displays search results,
 * and handles loading and error states.
 *
 * It utilizes the `useRecipeSearch` custom hook to manage recipe data,
 * loading status, and errors, abstracting the API interaction logic.
 */
function App() {
  // Destructure state and functions from the custom hook
  const { recipes, loading, error, searchRecipes } = useRecipeSearch();

  /**
   * Handles the search submission from the SearchBar component.
   * This function is passed down to the SearchBar and is called when
   * the user initiates a search.
   * @param {string} ingredients - Comma-separated list of ingredients.
   * @param {string} diet - Dietary preference (e.g., 'vegetarian', 'vegan').
   */
  const handleSearch = (ingredients, diet) => {
    searchRecipes(ingredients, diet);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recipe Finder</h1>
        <p className="App-description">Discover delicious recipes based on your ingredients and dietary preferences.</p>
      </header>

      <main className="App-main">
        {/* SearchBar component for user input */}
        <SearchBar onSearch={handleSearch} />

        {/* Conditional rendering based on loading, error, and recipe data */}
        {loading && (
          <div className="App-status-message loading">
            <div className="spinner"></div>
            <p>Fetching delicious recipes...</p>
          </div>
        )}

        {error && (
          <div className="App-status-message error">
            <p>Error: {error}</p>
            <p>Please try again or check your network connection.</p>
          </div>
        )}

        {!loading && !error && recipes.length === 0 && (
          <div className="App-status-message no-results">
            <p>No recipes found. Try adjusting your ingredients or dietary preferences.</p>
          </div>
        )}

        {/* Display RecipeList if recipes are available and not loading/error */}
        {!loading && !error && recipes.length > 0 && (
          <RecipeList recipes={recipes} />
        )}
      </main>

      <footer className="App-footer">
        <p>&copy; {new Date().getFullYear()} Recipe Finder App. Part of the interconnected microservice ecosystem.</p>
        <p>Explore more: Serverless Event Ticketing Platform | Task Management Dashboard</p>
      </footer>
    </div>
  );
}

export default App;