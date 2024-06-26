// Variable pour suivre l'index de la recette en cours d'édition
let editingIndex = -1;

// Ajout d'un écouteur d'événements pour le formulaire d'ajout/modification de recette
document.getElementById('add-recipe-form').addEventListener('submit', function(event) {
    // Empêche le comportement par défaut du formulaire
    event.preventDefault();

    // Récup des valeurs des champs du formulaire
    const recipeName = document.getElementById('recipe-name').value;
    const recipeImage = document.getElementById('recipe-image').value;
    const recipeTime = document.getElementById('recipe-time').value;
    const recipeLink = document.getElementById('recipe-link').value;
    const recipeCategory = document.getElementById('recipe-category').value;

    // Création d'un objet recette avec les valeurs du formulaire
    const newRecipe = {
        name: recipeName,
        image: recipeImage,
        time: recipeTime,
        link: recipeLink,
        category: recipeCategory
    };

    // Récup des recettes existantes du localStorage ou création d'un tableau vide
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    
    // Si on n'est pas en mode édition, ajouter la nouvelle recette
    if (editingIndex === -1) {
        recipes.push(newRecipe);
    } else {
        // Sinon, mettre à jour la recette existante
        recipes[editingIndex] = newRecipe;
        editingIndex = -1; // Réinitialisation de l'index d'édition
    }
    
    // Sauvegarde des recettes mises à jour dans le localStorage
    localStorage.setItem('recipes', JSON.stringify(recipes));

    // Réinitialisation du formulaire
    document.getElementById('add-recipe-form').reset();
    // Mise à jour du texte du bouton de soumission
    document.querySelector('button[type="submit"]').textContent = 'Ajouter la recette';

    // Mise à jour de l'affichage des recettes
    displayRecipes();
});

// afficher les recettes
function displayRecipes() {
    // Récup de l'élément liste des recettes
    const recipeList = document.getElementById('recipe-list');
    // Efface du contenu actuel de la liste
    recipeList.innerHTML = '';

    // Récup des recettes du localStorage
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    // Parcours de chaque recette pour l'afficher
    recipes.forEach((recipe, index) => {
        // Création d'un élément de liste pour chaque recette
        const recipeItem = document.createElement('li');
        // Ajout de classes CSS à l'élément
        recipeItem.className = 'bg-white p-4 rounded-lg shadow-md mb-4';
        // Définition du contenu HTML de l'élément
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
        // Ajout de l'élément à la liste des recettes
        recipeList.appendChild(recipeItem);
    });
}

// éditer une recette
function editRecipe(index) {
    // Récup des recettes du localStorage
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    // Récup de la recette à éditer
    const recipe = recipes[index];

    // Rempli du formulaire avec les données de la recette
    document.getElementById('recipe-name').value = recipe.name;
    document.getElementById('recipe-image').value = recipe.image;
    document.getElementById('recipe-time').value = recipe.time;
    document.getElementById('recipe-link').value = recipe.link;
    document.getElementById('recipe-category').value = recipe.category;

    // Mise à jour du texte du bouton de soumission
    document.querySelector('button[type="submit"]').textContent = 'Modifier la recette';
    // Mise à jour de l'index d'édition
    editingIndex = index;
}

// supprimer une recette
function deleteRecipe(index) {
    // Récup des recettes du localStorage
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    // Suppression de la recette à l'index spécifié
    recipes.splice(index, 1);
    // Mise à jour du localStorage avec les recettes restantes
    localStorage.setItem('recipes', JSON.stringify(recipes));
    // Mise à jour de l'affichage des recettes
    displayRecipes();
}

// Appel de la fonction displayRecipes au chargement de la page
window.onload = displayRecipes;