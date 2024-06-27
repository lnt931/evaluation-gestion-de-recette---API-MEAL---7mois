// admin.js

const menu = {
    entrees: ['Egg', 'Soup'],
    plats: ['Steak', 'Pizza'],
    desserts: ['crumble', 'pancake']
};

async function fetchRecipe(meal) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(meal)}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
}

function createRecipeItem(recipe) {
    const li = document.createElement('li');
    li.className = 'bg-white rounded-lg shadow p-4';
    li.innerHTML = `
        <h3 class="font-semibold text-lg mb-2">${recipe.strMeal}</h3>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="w-full h-48 object-cover rounded mb-2">
        <p class="text-sm text-gray-600 mb-2">${recipe.strInstructions.substring(0, 100)}...</p>
        <a href="${recipe.strSource}" target="_blank" class="text-blue-500 hover:underline text-sm">Voir la recette complète</a>
    `;
    return li;
}

async function populateRecipeList() {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = ''; // Clear previous recipes

    for (const category in menu) {
        for (const meal of menu[category]) {
            const recipe = await fetchRecipe(meal);
            if (recipe) {
                const li = createRecipeItem(recipe);
                recipeList.appendChild(li);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateRecipeList(); // Populate the recipe list on page load
});