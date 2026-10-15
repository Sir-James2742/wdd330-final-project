
import FavoritesService from "./favoriteservice.mjs";

const favoritesService = new FavoritesService();

const container = document.querySelector("#favorites-container");
const count = document.querySelector("#favorites-count");

function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function renderFavorites() {
    const favorites = favoritesService.getFavorites();

    count.textContent = `${favorites.length} saved recipe(s)`;

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <p>You haven't saved any recipes yet.</p>
                <a href="index.html">Discover recipes</a>
            </div>
        `;
        return;
    }

    container.innerHTML = favorites.map(recipe => `
        <div class="col-sm-6 col-lg-4">
            <article class="card recipe-card h-100">
                <div class="recipe-image-wrapper">
                    <img
                        src="${escapeHTML(recipe.strMealThumb || "")}"
                        class="card-img-top recipe-card-image"
                        alt="${escapeHTML(recipe.strMeal)}"
                        loading="lazy"
                    >
                </div>

                <div class="card-body">
                    <h2 class="card-title">
                        ${escapeHTML(recipe.strMeal)}
                    </h2>

                    <p>${escapeHTML(recipe.strCategory || "")}</p>
                    <p>${escapeHTML(recipe.strArea || "")}</p>

                    <a class="learn-more-button" href="index.html#recipe/${encodeURIComponent(recipe.idMeal)}">
                        View Recipe
                    </a>

                    <button
                        class="favorite-toggle"
                        type="button"
                        data-recipe-id="${escapeHTML(recipe.idMeal)}"
                        aria-pressed="true"
                    >
                        ♥ Remove from Favorites
                    </button>
                </div>
            </article>
        </div>
    `).join("");
}

container.addEventListener("click", event => {
    const button = event.target.closest(".favorite-toggle");

    if (!button) return;

    favoritesService.removeFavorite(button.dataset.recipeId);
    renderFavorites();
});

renderFavorites();
