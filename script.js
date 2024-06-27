const apiKey = '1'; // TheMealDB API key (free tier)
const baseUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s='; // URL de base pour l'API TheMealDB

const menu = {
    entrees: ['Egg','Soup'],
    plats: ['Steak','Pizza'],
    desserts: ['crumble','pancake']
}; 

async function fetchRecipe(meal) {
    const response = await fetch(`${baseUrl}${encodeURIComponent(meal)}`); // Requête à l'API pour obtenir les détails d'un plat
    const data = await response.json(); // Conversion de la réponse en JSON
    return data.meals ? data.meals[0] : null; // Retourne le premier plat trouvé ou null
}

function createRecipeItem(recipe) {
    const li = document.createElement('li'); // Création d'un élément de liste
    li.className = 'bg-white rounded-lg shadow p-4'; // Ajout de classes CSS
    li.innerHTML = `
        <h3 class="font-semibold text-lg mb-2">${recipe.strMeal}</h3>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="w-full h-48 object-cover rounded mb-2">
        <p class="text-sm text-gray-600 mb-2">${recipe.strInstructions.substring(0, 100)}...</p>
        <a href="${recipe.strSource}" target="_blank" class="text-blue-500 hover:underline text-sm">Voir la recette complète</a>
    `; // Création du contenu HTML pour chaque recette
    return li;
}

async function populateMenu(category = '') {
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = ''; // Effacement des éléments précédents
    const categoryTitle = document.getElementById('category-title');
    
    if (category) {
        categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Mise en majuscule de la première lettre
        for (const meal of menu[category]) {
            const recipe = await fetchRecipe(meal); // Récup des détails de la recette
            if (recipe) {
                const li = createRecipeItem(recipe); // Création de l'élément de liste pour la recette
                menuList.appendChild(li); // Ajout de la recette à la liste
            }
        }
    } else {
        categoryTitle.textContent = 'Toutes les catégories';
        for (const category in menu) {
            for (const meal of menu[category]) {
                const recipe = await fetchRecipe(meal); // Récup des détails de la recette
                if (recipe) {
                    const li = createRecipeItem(recipe); // Création de l'élément de liste pour la recette
                    menuList.appendChild(li); // Ajout de la recette à la liste
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
    categorySelect.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        populateMenu(selectedCategory); // Mise à jour du menu en fonction de la catégorie sélectionnée
    });

    const adminLoginButton = document.getElementById('admin-login');
    adminLoginButton.addEventListener('click', () => {
        window.location.href = 'login.html'; // Redirection vers la page de connexion admin
    });

    populateMenu(); // Affichage de toutes les recettes au chargement initial
});