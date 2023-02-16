import React from 'react';
import PropTypes from 'prop-types';
import RecipeCard from './RecipeCard';
import '../App.css'; // Assuming App.css contains general styles or RecipeList specific styles

/**
 * RecipeList Component
 *
 * Displays a list of recipes, handling loading, error, and empty states.
 * Each recipe is rendered using the RecipeCard component.
 *
 * @param {object[]} recipes - An array of recipe objects to display.
 * @param {boolean} loading - A boolean indicating if recipes are currently being fetched.
 * @param {string|null} error - An error message string if an error occurred, otherwise null.
 * @param {function} [onRecipeSelect] - Optional callback function when a recipe card is clicked.
 */
const RecipeList = ({ recipes, loading, error, onRecipeSelect }) => {
  // --- Render Logic ---

  if (loading) {
    return (
      <div className="recipe-list-container loading-state">
        <p className="loading-message">Searching for delicious recipes... Please wait!</p>
        <div className="spinner"></div> {/* Simple spinner for visual feedback */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-list-container error-state">
        <p className="error-message">
          Oops! Something went wrong while fetching recipes: <span className="error-detail">{error}</span>
        </p>
        <p className="error-suggestion">Please try again later or refine your search.</p>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="recipe-list-container no-results-state">
        <p className="no-results-message">No recipes found matching your criteria.</p>
        <p className="no-results-suggestion">Try adjusting your ingredients or dietary preferences.</p>
      </div>
    );
  }

  return (
    <div className="recipe-list-container">
      <h2 className="recipe-list-title">Found Recipes</h2>
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id || recipe.uri} // Use a unique ID, fallback to URI if ID isn't present
            recipe={recipe}
            onClick={() => onRecipeSelect && onRecipeSelect(recipe)}
          />
        ))}
      </div>
    </div>
  );
};

// --- Prop Types for Type Checking and Documentation ---
RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string, // Optional, depending on API response
      uri: PropTypes.string.isRequired, // Unique identifier from API
      label: PropTypes.string.isRequired,
      image: PropTypes.string,
      source: PropTypes.string,
      url: PropTypes.string,
      dietLabels: PropTypes.arrayOf(PropTypes.string),
      healthLabels: PropTypes.arrayOf(PropTypes.string),
      ingredientLines: PropTypes.arrayOf(PropTypes.string),
      calories: PropTypes.number,
      cuisineType: PropTypes.arrayOf(PropTypes.string),
      mealType: PropTypes.arrayOf(PropTypes.string),
      dishType: PropTypes.arrayOf(PropTypes.string),
      // Add other relevant recipe properties as needed
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string, // Can be null
  onRecipeSelect: PropTypes.func,
};

// --- Default Props (if any) ---
RecipeList.defaultProps = {
  error: null,
  onRecipeSelect: null,
};

export default RecipeList;