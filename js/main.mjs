import { getRandomRecipes } from './randomrecipes.mjs';
import { searchRecipes } from './search.mjs';
import RecipeService from "./recipeservice.mjs";
import RecipeDetails from "./recipedetails.mjs";
import Categories from "./categories.mjs"
import WikimediaService from "./wikimediaservice.mjs";
import FavoritesService from "./favoriteservice.mjs";

const favoritesService = new FavoritesService();


getRandomRecipes();
const discoverButton =
    document.querySelector("#discover-btn");

discoverButton.addEventListener("click", getRandomRecipes);

const searchForm = document.querySelector("#search-form");

searchForm.addEventListener("submit", searchRecipes);

const recipeService = new RecipeService();
const recipeDetails = new RecipeDetails();
const categories = new Categories();


categories.init();


async function handleRecipeRoute() {
    const match = window.location.hash.match(/^#recipe\/(\d+)$/);

    const modal = document.querySelector("#recipe-modal");
    const detailContainer = document.querySelector("#recipe-details");
    const browseSection = document.querySelector("#browse-section");

    if (!match) {
        if (modal?.open) {
            modal.close();
        }

        if (browseSection) {
            browseSection.hidden = false;
        }

        return;
    }

    if (browseSection) {
        browseSection.hidden = true;
    }

    if (modal && !modal.open) {
        modal.showModal();
    }

    if (detailContainer) {
        detailContainer.innerHTML = "<p>Loading recipe...</p>";
    }

    try {
        const recipe = await recipeService.getRecipeById(match[1]);
        const wikimediaService = new WikimediaService();
        recipeDetails.render(recipe);
        await wikimediaService.renderExtraInfo(recipe.strMeal);
    } catch (error) {
        console.error("Recipe details error:", error);

        if (detailContainer) {
            detailContainer.textContent =
                "Could not load the recipe. Please try again.";
        }
    }
}


const recipeModal = document.querySelector("#recipe-modal");
const closeButton = document.querySelector("#close-recipe-modal");

closeButton?.addEventListener("click", () => {
    if (recipeModal?.open) {
        recipeModal.close();
    }
});

recipeModal?.addEventListener("close", () => {
    if (window.location.hash.startsWith("#recipe/")) {
        window.location.hash = "#recipes";
    }
});


const recipeList = document.querySelector("#recipe-list");

recipeList.addEventListener("click", (event) => {
    const button = event.target.closest(".learn-more-button");

    if (!button) return;

    const recipeId = button.dataset.recipeId;

    if (!recipeId) {
        console.error("Recipe ID is missing!");
        return;
    }

    window.location.hash = `recipe/${recipeId}`;
});
const randomContainer = document.querySelector("#recipe-container");
randomContainer?.addEventListener("click", (event) => {
    const button = event.target.closest(".learn-more-button");

    if (!button) return;

    const recipeId = button.dataset.recipeId;

    if (recipeId) {
        window.location.hash = `recipe/${recipeId}`;
    }
});


document.addEventListener("click", async (event) => {
    const button = event.target.closest(".favorite-toggle");

    if (!button) return;

    const recipeId = button.dataset.recipeId;
    if (!recipeId) return;

    button.disabled = true;

    try {
        if (favoritesService.isFavorite(recipeId)) {
            favoritesService.removeFavorite(recipeId);
        } else {
            const recipe = await recipeService.getRecipeById(recipeId);

            if (!recipe) {
                throw new Error("Recipe could not be found.");
            }

            favoritesService.addFavorite(recipe);
        }

        updateFavoriteButtons(recipeId);
    } catch (error) {
        console.error("Unable to update favorites:", error);
        alert("Sorry, we couldn't update your favorites. Please try again.");
    } finally {
        button.disabled = false;
    }
});

function updateFavoriteButtons(recipeId) {
    const isSaved = favoritesService.isFavorite(recipeId);

    document.querySelectorAll(".favorite-toggle").forEach(button => {
        if (button.dataset.recipeId !== String(recipeId)) return;

        button.textContent = isSaved
            ? "♥ Remove from Favorites"
            : "♡ Add to Favorites";

        button.setAttribute("aria-pressed", String(isSaved));
    });
}


window.addEventListener("hashchange", handleRecipeRoute);
handleRecipeRoute();
