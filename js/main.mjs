import { getRandomRecipes } from './randomrecipes.mjs';
import { searchRecipes } from './search.mjs';

getRandomRecipes();

const discoverButton =
    document.querySelector("#discover-btn");

discoverButton.addEventListener("click", getRandomRecipes);

const searchForm = document.querySelector("#search-form");

searchForm.addEventListener("submit", searchRecipes);
