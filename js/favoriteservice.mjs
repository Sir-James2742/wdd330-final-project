
const STORAGE_KEY = "recipeFinderFavorites";

class FavoritesService {
    getFavorites() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const favorites = saved ? JSON.parse(saved) : [];

            return Array.isArray(favorites) ? favorites : [];
        } catch (error) {
            console.error("Could not read favorites:", error);
            return [];
        }
    }

    saveFavorites(favorites) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }

    isFavorite(recipeId) {
        return this.getFavorites().some(
            recipe => String(recipe.idMeal) === String(recipeId)
        );
    }

    addFavorite(recipe) {
        if (!recipe?.idMeal) {
            throw new Error("A valid recipe is required.");
        }

        const favorites = this.getFavorites();

        if (favorites.some(
            item => String(item.idMeal) === String(recipe.idMeal)
        )) {
            return;
        }

        favorites.push(recipe);
        this.saveFavorites(favorites);
    }

    removeFavorite(recipeId) {
        const favorites = this.getFavorites().filter(
            recipe => String(recipe.idMeal) !== String(recipeId)
        );

        this.saveFavorites(favorites);
    }

    toggleFavorite(recipe) {
        if (this.isFavorite(recipe.idMeal)) {
            this.removeFavorite(recipe.idMeal);
            return false;
        }

        this.addFavorite(recipe);
        return true;
    }
}

export default FavoritesService;
