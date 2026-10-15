const API_URL = "https://www.themealdb.com/api/json/v1/1/random.php";

async function getRandomRecipes() {

    const container =
        document.querySelector("#recipe-container");

    try {

        container.innerHTML = `
            <p>Loading recipes...</p>
        `;

        const recipes = [];

        for (let i = 0; i < 6; i++) {

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Unable to retrieve recipes.");
            }

            const data = await response.json();

            recipes.push(data.meals[0]);
        }

        displayRecipes(recipes);

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p class="text-danger">
                Sorry, we couldn't load the recipes.
                Please try again.
            </p>
        `;
    }
}


function displayRecipes(recipes) {
    const container = document.querySelector("#recipe-container");

    container.innerHTML = recipes.map(meal => `
        <div class="col-sm-6 col-lg-4">
            <article class="card recipe-card h-100">
                <div class="recipe-image-wrapper">
                    <img
                        src="${meal.strMealThumb}"
                        class="card-img-top recipe-card-image"
                        alt="${meal.strMeal}"
                        loading="lazy"
                    >
                </div>

                <div class="card-body">
                    <h3 class="card-title">${meal.strMeal}</h3>
                    <p class="card-text">${meal.strCategory ?? ""}</p>
                    <p class="card-text">${meal.strArea ?? ""}</p>

                    <button
                        class="learn-more-button"
                        type="button"
                        data-recipe-id="${meal.idMeal}"
                    >
                        Learn More
                    </button>
                    
                    <button
                        class="favorite-toggle"
                        type="button"
                        data-recipe-id="${meal.idMeal}"
                        aria-pressed="false"
                    >
                        ♡ Add to Favorites
                    </button>

                </div>
            </article>
        </div>
    `).join("");
}


export { getRandomRecipes, displayRecipes };
