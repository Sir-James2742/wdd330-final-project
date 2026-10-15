
export default class RecipeDetails {
    escape(value = "") {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    render(recipe) {
        const container = document.querySelector("#recipe-details");
        if (!container) return;

        if (!recipe) {
            container.innerHTML = "<p>Recipe not found.</p>";
            return;
        }

        const ingredients = [];

        for (let i = 1; i <= 20; i++) {
            const name = recipe[`strIngredient${i}`]?.trim();
            const measure = recipe[`strMeasure${i}`]?.trim();

            if (name) {
                ingredients.push(`
    <li>
                        <span>${this.escape(name)}</span>
                        <span>${this.escape(measure || "")}</span>
                    </li>
    `);
            }
        }

        const instructions = (recipe.strInstructions || "")
            .split(/\r?\n/)
            .map(step => step.trim())
            .filter(Boolean);

        container.innerHTML = `
    <article class="recipe-detail">
                <button id="back-to-recipes" class="back-button">
                    &larr; Back to recipes
                </button>

                <div class="detail-header">
                    <img
                        class="detail-image"
                        src="${this.escape(recipe.strMealThumb || "")}"
                        alt="${this.escape(recipe.strMeal)}"
                    >

                    <div>
                        <span class="category-label">
                            ${this.escape(recipe.strCategory || "Recipe")}
                        </span>

                        <h1>${this.escape(recipe.strMeal)}</h1>

                        <p>
                            Cuisine:
                            ${this.escape(recipe.strArea || "Not specified")}
                        </p>
                    </div>
                </div>

                <section class="detail-section">
                    <h2>Ingredients</h2>
                    <ul class="ingredient-list">
                        ${ingredients.join("")}
                    </ul>
                </section>

                <section class="detail-section">
                    <h2>Cooking Instructions</h2>
                    <ol class="instruction-list">
                        ${instructions.map(step =>
                            `<li>${this.escape(step)}</li>`
                        ).join("")}
                    </ol>
                </section>
                <section id="wikimedia-info" class="wikimedia-info">
                    <h2>Discover the Story Behind This Dish</h2>
                    <p>Loading extra information...</p>
                </section>
                
                <button
                    class="favorite-toggle"
                    type="button"
                    data-recipe-id="${recipe.idMeal}"
                    aria-pressed="false"
                >
                    ♡ Add to Favorites
                </button>


                ${
    recipe.strYoutube ? `
                    <a href="${/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(recipe.strYoutube) ? this.escape(recipe.strYoutube) : "#"}"
                       target="_blank"
                       rel="noopener noreferrer">
                        Watch cooking video
                    </a>
                ` : ""
}

            </article>
          
            
    `;

        document.querySelector("#back-to-recipes")
            ?.addEventListener("click", () => {
                window.location.hash = "recipes";
            });
    }
}
