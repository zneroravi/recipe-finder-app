import React from 'react';
import PropTypes from 'prop-types';

/**
 * RecipeCard component displays a single recipe with its image, title, and key details.
 * It provides a link to view the full recipe on an external site.
 *
 * @param {object} props - The component props.
 * @param {object} props.recipe - The recipe object containing details like label, image, url, etc.,
 *                                 typically from an API response (e.g., Edamam's `hit.recipe` object).
 * @returns {JSX.Element} A React component displaying a recipe card.
 */
const RecipeCard = ({ recipe }) => {
  // Destructure relevant properties from the recipe object for easier access
  const {
    label,
    image,
    url,
    source,
    dietLabels,
    healthLabels, // Often useful for dietary restrictions
    cuisineType,
    mealType,
    dishType,
    calories,
    ingredientLines,
  } = recipe;

  // Format calories to a whole number for better readability
  const formattedCalories = calories ? Math.round(calories) : 'N/A';

  /**
   * Helper function to capitalize the first letter of each word in an array of strings.
   * @param {string[]} items - An array of strings (e.g., cuisine types).
   * @returns {string} A comma-separated string with capitalized words.
   */
  const formatAndJoin = (items) => {
    if (!items || items.length === 0) return null;
    return items.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(', ');
  };

  return (
    <div className="recipe-card">
      {/* Recipe image with alt text for accessibility */}
      <img src={image} alt={label} className="recipe-card__image" />

      <div className="recipe-card__content">
        {/* Recipe title */}
        <h3 className="recipe-card__title">{label}</h3>

        {/* Source of the recipe */}
        {source && <p className="recipe-card__source">By: {source}</p>}

        {/* Display diet labels if available */}
        {dietLabels && dietLabels.length > 0 && (
          <p className="recipe-card__meta">
            <strong>Diet:</strong> {formatAndJoin(dietLabels)}
          </p>
        )}

        {/* Display health labels if available */}
        {healthLabels && healthLabels.length > 0 && (
          <p className="recipe-card__meta">
            <strong>Health:</strong> {formatAndJoin(healthLabels)}
          </p>
        )}

        {/* Display cuisine type if available */}
        {cuisineType && cuisineType.length > 0 && (
          <p className="recipe-card__meta">
            <strong>Cuisine:</strong> {formatAndJoin(cuisineType)}
          </p>
        )}

        {/* Display meal type if available */}
        {mealType && mealType.length > 0 && (
          <p className="recipe-card__meta">
            <strong>Meal Type:</strong> {formatAndJoin(mealType)}
          </p>
        )}

        {/* Display dish type if available */}
        {dishType && dishType.length > 0 && (
          <p className="recipe-card__meta">
            <strong>Dish Type:</strong> {formatAndJoin(dishType)}
          </p>
        )}

        {/* Display calories if available */}
        {calories && (
          <p className="recipe-card__meta">
            <strong>Calories:</strong> {formattedCalories} kcal
          </p>
        )}

        {/* Optional: Display a summary of ingredients (first few lines) */}
        {ingredientLines && ingredientLines.length > 0 && (
          <div className="recipe-card__ingredients-summary">
            <h4>Key Ingredients:</h4>
            <ul>
              {/* Show up to the first 3 ingredients for a quick overview */}
              {ingredientLines.slice(0, 3).map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
              {/* Indicate if there are more ingredients not shown in the summary */}
              {ingredientLines.length > 3 && <li>...and more</li>}
            </ul>
          </div>
        )}

        {/* Link to view the full recipe on the external source */}
        <a
          href={url}
          target="_blank" // Open link in a new tab
          rel="noopener noreferrer" // Security measure for opening new tabs
          className="recipe-card__link button button--primary" // Assuming global button styles
        >
          View Full Recipe
        </a>
      </div>
    </div>
  );
};

/**
 * PropTypes for RecipeCard component to ensure type checking and required props.
 */
RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    label: PropTypes.string.isRequired,
    image: PropTypes.string,
    url: PropTypes.string.isRequired,
    source: PropTypes.string,
    dietLabels: PropTypes.arrayOf(PropTypes.string),
    healthLabels: PropTypes.arrayOf(PropTypes.string),
    cuisineType: PropTypes.arrayOf(PropTypes.string),
    mealType: PropTypes.arrayOf(PropTypes.string),
    dishType: PropTypes.arrayOf(PropTypes.string),
    calories: PropTypes.number,
    ingredientLines: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default RecipeCard;