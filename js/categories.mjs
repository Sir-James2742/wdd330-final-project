
import RecipeService from "./recipeservice.mjs";

export default class Categories {
    constructor() {
        this.service = new RecipeService();
    }

    escape(value = "") {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    async init() {
        const container = document.querySelector("#recipe-categories");
        if (!container) return;

        container.textContent = "Loading categories...";

        try {
            const categories = await this.service.getCategories();

            container.innerHTML = categories.map(category => `
                <button
                    class="category-button"
                    data-category="${this.escape(category.strCategory)}"
                    type="button"
                >
                    ${this.escape(category.strCategory)}
                </button>
            `).join("");

            container.addEventListener("click", event => {
                const button = event.target.closest("[data-category]");
                if (!button) return;

                this.loadRecipes(button.dataset.category);
            });

            
            const selected = new URLSearchParams(
                window.location.hash.split("?")[1] || ""
            ).get("category");

            if (selected) {
                await this.loadRecipes(selected);
            }
        } catch (error) {
            container.textContent = "Could not load categories. Try again.";
            console.error(error);
        }
    }

    async loadRecipes(category) {
        const container = document.querySelector("#recipe-list");
        if (!container) return;

        container.textContent = "Loading recipes...";

        try {
            const recipes =
                await this.service.getRecipesByCategory(category);

            container.innerHTML = `
                <h2 class="selected-category">${ this.escape(category) } Recipes</h2>

                <div class="recipe-grid">
                    ${recipes.map(recipe => `
                        <article class="recipe-card">
                            <img
                                src="${this.escape(recipe.strMealThumb)}"
                                alt="${this.escape(recipe.strMeal)}"
                                loading="lazy"
                            >
                            <div class="recipe-card-content">
                                <h3>${this.escape(recipe.strMeal)}</h3>
                                <button
                                    class="learn-more-button"
                                    data-recipe-id="${this.escape(recipe.idMeal)}"
                                    type="button"
                                >
                                    Learn More
                                </button>
                                
                                <button
                                    class="favorite-toggle"
                                    type="button"
                                    data-recipe-id="${recipe.idMeal}"
                                    aria-pressed="false"
                                >
                                    ♡ Add to Favorites
                                </button>

                            </div>
                        </article>
                    `).join("")}
                </div>
`;

            container.querySelectorAll("[data-recipe-id]")
                .forEach(button => {
                    button.addEventListener("click", () => {
                        window.location.hash =
                            `recipe / ${ button.dataset.recipeId } `;
                    });
                });

            window.location.hash =
                `recipes ? category = ${ encodeURIComponent(category) } `;
        } catch (error) {
            container.textContent = "Could not load recipes. Try again.";
            console.error(error);
        }
    }
}
