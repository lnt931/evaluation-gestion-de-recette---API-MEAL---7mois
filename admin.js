let editingIndex = -1;

document.getElementById('add-recipe-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const recipeName = document.getElementById('recipe-name').value;
    const recipeImage = document.getElementById('recipe-image').value;
    const recipeTime = document.getElementById('recipe-time').value;
    const recipeLink = document.getElementById('recipe-link').value;
    const recipeCategory = document.getElementById('recipe-category').value;

    const newRecipe = {
        name: recipeName,
        image: recipeImage,
        time: recipeTime,
        link: recipeLink,
        category: recipeCategory
    };

    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    
    if (editingIndex === -1) {
        recipes.push(newRecipe);
    } else {
        recipes[editingIndex] = newRecipe;
        editingIndex = -1;
    }
    
    localStorage.setItem('recipes', JSON.stringify(recipes));

    document.getElementById('add-recipe-form').reset();
    document.querySelector('button[type="submit"]').textContent = 'Ajouter la recette';

    displayRecipes();
});

function displayRecipes() {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    recipes.forEach((recipe, index) => {
        const recipeItem = document.createElement('li');
        recipeItem.className = 'bg-white p-4 rounded-lg shadow-md mb-4';
        recipeItem.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">${recipe.name}</h3>
            <img class="w-full h-48 object-cover rounded-lg mb-4" src="${recipe.image}" alt="${recipe.name}">
            <p><strong>Temps de préparation:</strong> ${recipe.time} minutes</p>
            <p><strong>Catégorie:</strong> ${recipe.category}</p>
            <a href="${recipe.link}" class="text-blue-500 hover:text-blue-700" target="_blank">Voir la recette</a>
            <div class="mt-4">
                <button onclick="editRecipe(${index})" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mr-2">Modifier</button>
                <button onclick="deleteRecipe(${index})" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Supprimer</button>
            </div>
        `;
        recipeList.appendChild(recipeItem);
    });
}

function editRecipe(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = recipes[index];

    document.getElementById('recipe-name').value = recipe.name;
    document.getElementById('recipe-image').value = recipe.image;
    document.getElementById('recipe-time').value = recipe.time;
    document.getElementById('recipe-link').value = recipe.link;
    document.getElementById('recipe-category').value = recipe.category;

    document.querySelector('button[type="submit"]').textContent = 'Modifier la recette';
    editingIndex = index;
}

function deleteRecipe(index) {
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes();
}

window.onload = displayRecipes;