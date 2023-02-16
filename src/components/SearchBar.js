import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} SearchBarProps
 * @property {function(string, string[]): void} onSearch - Callback function to trigger a search with ingredients and dietary preferences.
 * @property {boolean} [isLoading=false] - Indicates if a search is currently in progress, used to disable the search button.
 */

/**
 * SearchBar component allows users to input ingredients and select dietary preferences
 * to search for recipes.
 *
 * @param {SearchBarProps} props - The properties for the component.
 * @returns {JSX.Element} The SearchBar component.
 */
const SearchBar = ({ onSearch, isLoading = false }) => {
  // State for the ingredients input field
  const [ingredients, setIngredients] = useState('');
  // State for selected dietary preferences (e.g., ['vegetarian', 'gluten-free'])
  const [dietaryPreferences, setDietaryPreferences] = useState([]);

  // Define available dietary options for checkboxes
  const dietaryOptions = [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Gluten-Free', value: 'gluten-free' },
    { label: 'Keto', value: 'keto' },
    { label: 'Dairy-Free', value: 'dairy-free' },
  ];

  /**
   * Handles changes to the ingredients input field.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input.
   */
  const handleIngredientsChange = useCallback((event) => {
    setIngredients(event.target.value);
  }, []);

  /**
   * Handles changes to the dietary preference checkboxes.
   * Adds or removes a preference from the `dietaryPreferences` array.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the checkbox.
   */
  const handleDietaryChange = useCallback((event) => {
    const { value, checked } = event.target;
    setDietaryPreferences((prevPreferences) =>
      checked
        ? [...prevPreferences, value] // Add preference if checked
        : prevPreferences.filter((pref) => pref !== value) // Remove preference if unchecked
    );
  }, []);

  /**
   * Handles the form submission. Prevents default form behavior and calls the `onSearch` prop.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    // Trim ingredients input to remove leading/trailing whitespace
    const trimmedIngredients = ingredients.trim();
    if (trimmedIngredients || dietaryPreferences.length > 0) {
      onSearch(trimmedIngredients, dietaryPreferences);
    } else {
      // Optionally, provide user feedback if no search criteria are entered
      console.log('Please enter ingredients or select dietary preferences to search.');
    }
  }, [ingredients, dietaryPreferences, onSearch]);

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <label htmlFor="ingredients-input" className="sr-only">Search by Ingredients</label>
          <input
            id="ingredients-input"
            type="text"
            className="ingredients-input"
            placeholder="e.g., chicken, broccoli, rice"
            value={ingredients}
            onChange={handleIngredientsChange}
            aria-label="Enter ingredients separated by commas"
            disabled={isLoading}
          />
        </div>

        <div className="dietary-preferences-group" role="group" aria-labelledby="dietary-preferences-heading">
          <h3 id="dietary-preferences-heading" className="dietary-preferences-heading">Dietary Preferences</h3>
          <div className="checkbox-grid">
            {dietaryOptions.map((option) => (
              <div key={option.value} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`dietary-${option.value}`}
                  value={option.value}
                  checked={dietaryPreferences.includes(option.value)}
                  onChange={handleDietaryChange}
                  className="dietary-checkbox"
                  disabled={isLoading}
                />
                <label htmlFor={`dietary-${option.value}`} className="dietary-label">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="search-button"
          disabled={isLoading || (!ingredients.trim() && dietaryPreferences.length === 0)}
          aria-live="polite"
        >
          {isLoading ? 'Searching...' : 'Find Recipes'}
        </button>
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default SearchBar;