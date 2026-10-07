import { displayRecipes } from "./randomrecipes.mjs";
const searchInput = document.querySelector("#search-input");
const recipeContainer = document.querySelector("#recipe-container");


async function searchRecipes(event) {

    event.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        return;
    }

    const url =`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`;

    try {

        recipeContainer.innerHTML = `
            <div class="col-12 text-center">
                <p>Searching for recipes...</p>
            </div>
        `;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch recipes.");
        }

        const data = await response.json();

        if (!data.meals) {

            recipeContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p class="lead">
                        No recipes found for "${searchTerm}".
                    </p>
                </div>
            `;

            return;
        }

        displayRecipes(data.meals);

    } catch (error) {

        console.error(error);

        recipeContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">
                    Something went wrong. Please try again.
                </p>
            </div>
        `;
    }
}

export {searchRecipes};