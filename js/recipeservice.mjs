
const API = "https://www.themealdb.com/api/json/v1/1";

export default class RecipeService {
    async getCategories() {
        const response = await fetch(`${ API }/categories.php`);
if (!response.ok) throw new Error("Could not load categories.");

const data = await response.json();
return data.categories || [];
    }

    async getRecipesByCategory(category) {
    const response = await fetch(
        `${API}/filter.php?c=${encodeURIComponent(category)}`
    );
    if (!response.ok) throw new Error("Could not load recipes.");

    const data = await response.json();
    return data.meals || [];
}

    async getRecipeById(id) {
    const response = await fetch(
        `${API}/lookup.php?i=${encodeURIComponent(id)}`
    );
    if (!response.ok) throw new Error("Could not load recipe details.");

    const data = await response.json();
    return data.meals?.[0] || null;
}
}
