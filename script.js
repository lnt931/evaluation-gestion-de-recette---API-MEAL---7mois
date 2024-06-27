const apiKey = '1'; // recette en anglais
const baseUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const menu = { entrees: ['salad', 'egg'], plats: ['carbonara', 'Pizza'], desserts: ['apple', 'chocolat'] };

async function fetchRecipe(meal) {
    const response = await fetch(`${baseUrl}${encodeURIComponent(meal)}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
}

function createRecipeItem(recipe) {
    const li = document.createElement('li');
    li.className = 'bg-white rounded-lg shadow p-4';
    li.innerHTML = `
        <h3 class="text-lg font-semibold mb-2 text-center">${recipe.strMeal}</h3>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="w-full h-48 object-cover mb-2 rounded">
        <p class="text-sm mb-2">${recipe.strInstructions.substring(0, 100)}...</p>
        <button class="view-recipe bg-red-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded">Voir la recette</button>
    `;

    // Ajoute un gestionnaire d'événements pour le bouton
    li.querySelector('.view-recipe').addEventListener('click', () => {

        // Ouvre la recette dans une nouvelle fenêtre ou onglet
        window.open(recipe.strSource, '_blank');
    });

    return li;
}

async function populateMenu(category = '') {
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = '';
    document.getElementById('category-title').textContent = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Toutes les catégories';

    const categories = category ? [category] : Object.keys(menu);
    for (const cat of categories) {
        for (const meal of menu[cat]) {
            const recipe = await fetchRecipe(meal);
            if (recipe) menuList.appendChild(createRecipeItem(recipe));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('category-select').addEventListener('change', (e) => populateMenu(e.target.value));
    document.getElementById('admin-login').addEventListener('click', () => window.location.href = 'login.html');
    populateMenu();
});