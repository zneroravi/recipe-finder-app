const BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch'
const API_KEY = process.env.REACT_APP_SPOONACULAR_KEY

async function searchRecipes(ingredients, dietaryPreferences, page = 1, pageSize = 10) {

  // Normalize ingredients
  const ingredientsStr = Array.isArray(ingredients)
    ? ingredients.join(',')
    : ingredients

  // Normalize dietaryPreferences
  const diet = Array.isArray(dietaryPreferences)
    ? dietaryPreferences[0]
    : dietaryPreferences

  // Build URL with pagination
  const offset = (page - 1) * pageSize
  const url = `${BASE_URL}?apiKey=${API_KEY}&includeIngredients=${ingredientsStr}&diet=${diet}&number=${pageSize}&offset=${offset}`

  try {
    const response = await fetch(url)

    // Invalid API key
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your Spoonacular API key.')
    }

    // Rate limiting
    if (response.status === 402) {
      throw new Error('API rate limit reached. You have exceeded your daily quota.')
    }

    // Not found
    if (response.status === 404) {
      throw new Error('No recipes found for the given ingredients and dietary preferences.')
    }

    // Other errors
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Handle empty results
    if (!data.results || data.results.length === 0) {
      return { recipes: [], totalResults: 0 }
    }

    // Return in format the hook expects
    return {
      recipes: data.results.map(recipe => ({
        id: recipe.id,
        name: recipe.title,
        thumbnail: recipe.image
      })),
      totalResults: data.totalResults
    }

  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error. Please check your internet connection.')
    }
    throw new Error(`Something went wrong: ${error.message}`)
  }
}

export { searchRecipes }