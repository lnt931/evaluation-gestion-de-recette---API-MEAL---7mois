const menu = {
    entrees: ['salad', 'egg'],
    plats: ['carbonara', 'Pizza'],
    desserts: ['apple', 'chocolat']
};

// Charger les données du localStorage
function loadMenu() {
    const savedMenu = localStorage.getItem('menu');
    if (savedMenu) {
        return JSON.parse(savedMenu);
    }
    return menu;
}

// Sauvegarder les données dans le localStorage
function saveMenu(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
}

async function fetchRecipe(meal) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(meal)}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
}

function createRecipeItem(recipe) {
    const li = document.createElement('li');
    li.className = 'bg-white rounded-lg shadow p-4 mb-4';
    li.innerHTML = `
        <h3 class="font-semibold text-lg mb-2">${recipe.strMeal}</h3>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="w-full h-48 object-cover rounded mb-2">
        <p class="text-sm text-gray-600 mb-2">${recipe.strInstructions.substring(0, 100)}...</p>
        <a href="${recipe.strSource}" target="_blank" class="text-blue-500 hover:underline text-sm">Voir la recette complète</a>
        <div class="mt-2">
            <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded mr-2">Modifier</button>
            <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
        </div>
    `;
    li.querySelector('.edit-btn').onclick = () => {
        const newName = prompt('Nouveau nom:', recipe.strMeal);
        if (newName) li.querySelector('h3').textContent = recipe.strMeal = newName;
    };
    li.querySelector('.delete-btn').onclick = () => {
        if (confirm('Supprimer?')) {
            li.remove();
            // Mettre à jour le menu et sauvegarder
            const category = Object.keys(menu).find(cat => menu[cat].includes(recipe.strMeal));
            if (category) {
                menu[category] = menu[category].filter(meal => meal !== recipe.strMeal);
                saveMenu(menu);
            }
        }
    };
    return li;
}

async function populateRecipeList() {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';
    
    const filterSelect = document.createElement('select');
    filterSelect.innerHTML = ['Toutes les catégories', ...Object.keys(menu)]
        .map(cat => `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`)
        .join('');
    recipeList.appendChild(filterSelect);

    const recipeContainer = document.createElement('div');
    recipeList.appendChild(recipeContainer);

    const displayRecipes = async (category = 'Toutes les catégories') => {
        recipeContainer.innerHTML = '';
        for (const cat in menu) {
            if (category === 'Toutes les catégories' || category === cat) {
                for (const meal of menu[cat]) {
                    const recipe = await fetchRecipe(meal);
                    if (recipe) recipeContainer.appendChild(createRecipeItem(recipe));
                }
            }
        }
    };

    await displayRecipes();
    filterSelect.onchange = (e) => displayRecipes(e.target.value);
}

function addNewRecipe() {
    const newMealName = prompt('Nom de la nouvelle recette:');
    if (newMealName) {
        const category = prompt('Catégorie (entrees, plats, desserts):');
        if (category && menu[category]) {
            fetchRecipe(newMealName).then(recipe => {
                if (recipe) {
                    document.getElementById('recipe-list').lastChild.appendChild(createRecipeItem(recipe));
                    menu[category].push(newMealName);
                    saveMenu(menu);
                } else {
                    alert('Recette non trouvée.');
                }
            });
        } else {
            alert('Catégorie invalide.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Charger le menu depuis le localStorage
    Object.assign(menu, loadMenu());

    populateRecipeList();
    document.getElementById('add-recipe-btn')?.addEventListener('click', addNewRecipe);
});
