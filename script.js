/**
 *
 * I don't know what to cook!
 *
 * app heading.
 * " I don't know what to cook!"
 * 
 * namespace
 *
 * input form where the user can add ingredients that they have.
 *
 * show the ingredients list below the form.
 *
 * delete button beside of the ingredients list so user can edit.
 *
 * listen to a button click event to generate the recipe.
 * :get ingredients input value & generate random menu -> send them to the API
 *
 * receive recipe data from API -> display the recipe with ingredients that user might have to buy
 *
 * a button where user can see different option (recipe)
 *
 */

//namespace
const recipeApp = {};
recipeApp.localStorage = "ingredient";
recipeApp.ingredStorageArray = [];

//save relevant API information
recipeApp.apiUrl = 'https://api.edamam.com/search';
recipeApp.apiKey = '293c08c7945e511e5cb756b37b0c5179';

recipeApp.addIngred = () => {
    const ingredients = document.querySelector("#ingredient");
    const addButton = document.querySelector(".add-button");
    const clearStorage = document.querySelector("#reset");
    clearStorage.addEventListener("click", (e) => {
        e.preventDefault();
        recipeApp.clearLocalStorage();
    })

    addButton.addEventListener("click", (e) => {
        e.preventDefault();
        const storage = document.querySelector("#storage");
        const storageList = document.createElement("li");
        storageList.className = "storage-list";
        storageList.innerHTML = ingredients.value;

        if (ingredients.value) {
            storage.prepend(storageList);
            recipeApp.ingredStorageArray.push(ingredients.value);
            ingredients.value = '';
        } else {
            alert("please tell us what is in your fridge");
            ingredients.focus();
        }
        recipeApp.setLocalStorage();
    })
}

recipeApp.submitButton = () => {
    const submitButton = document.querySelector(".submit-button");
    const recipeName = document.querySelector('.recipe-label');
    const recipeImage = document.getElementById('recipe-image');
    const ingredientUl = document.querySelector('.recipe');
    const formEl = document.querySelector('form');
    const ulEl = document.querySelector('.list-container');

    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        recipeName.textContent = '';
        recipeImage.src = '';
        recipeImage.alt = '';
        ingredientUl.innerHTML = '';

        const ingredList = document.querySelectorAll('li');
        const randomNumber = Math.floor(Math.random() * ingredList.length);
        if (ingredList[randomNumber]) {
            recipeApp.getRecipe((ingredList[randomNumber]).textContent);
        } else {
            alert("please tell us what is in your fridge");
            const ingredients = document.querySelector("#ingredient");
            ingredients.focus();
        }
    })
}

//create a method which requests informtion from the API
recipeApp.getRecipe = (ingredient) => {
    //use URL constructor to specify the parameters we wish to include in our API endpoint
    const url = new URL(recipeApp.apiUrl);
    url.search = new URLSearchParams({
        q: ingredient,
        app_id: 'e941670e',
        app_key: recipeApp.apiKey
    });

    fetch(url)
        .then((response) => {
            //parse this response into JSON and return
            return response.json();
        })
        //parse the JSON promise response and log out readable data
        .then((jsonResponse) => {

            const randomNumber = Math.floor(Math.random() * jsonResponse.hits.length);

            if (jsonResponse.hits[randomNumber]) {
                jsonResponse.hits[randomNumber].recipe;

                //pass the data into the displayPhotos method
                recipeApp.displayRecipe(jsonResponse.hits[randomNumber].recipe);

            } else {
                alert('Please check your spelling and try again!')
                location.reload();
            }
        });
};

recipeApp.displayRecipe = (menu) => {
    const recipeSection = document.querySelector('.recipe-section')
    const fridge = document.querySelector('.fridge')
    const recipeName = document.querySelector('.recipe-label');
    const recipeImage = document.getElementById('recipe-image');
    const ingredientContainer = document.querySelector('.recipe');
    const imageContainer = document.querySelector('.image-container');
    const recipeLinkButton = document.querySelector('.recipe-link');
    const healthUl = document.createElement('ul');
    const categoryCuisineType = document.querySelector('.category-cuisine-type');
    const categoryDietType = document.querySelector('.category-diet-type');
    const nutritionDetail = document.querySelector('.nutrition-detail');
    const health = document.querySelector('.health');
    let cuisineType = "N/A";
    let dietLabels = "";

    if (menu.cuisineType) {
        const cuisineTypeFirstLetter = menu.cuisineType[0];
        cuisineType = cuisineTypeFirstLetter.charAt(0).toUpperCase() + cuisineTypeFirstLetter.slice(1);
    }

    if (menu.dietLabels.length !== 0) {
        dietLabels = `, ${menu.dietLabels[0]}`;
    } 
    const calories = menu.calories.toFixed(0);
    const totalWeight = menu.totalWeight.toFixed(0);
    const carb = menu.totalNutrients.CHOCDF.quantity.toFixed(0);
    const protein = menu.totalNutrients.PROCNT.quantity.toFixed(0);
    const fat = menu.totalNutrients.FAT.quantity.toFixed(0);
    const healthLabels = menu.healthLabels;

   

    imageContainer.style.visibility = "visible";
    recipeSection.style.visibility = "visible";
    recipeLinkButton.innerHTML = '';
    // recipeName.textContent = '';
    // recipeImage.src = '';
    // recipeImage.alt = '';
    // recipeLinkButton.innerHTML = '';
    // ingredientUl.innerHTML = '';
    health.innerHTML = '';
    // category.innerHTML = '';
    // categoryCuisineType.innerHTML = '';
    // categoryDietType.innerHTML = '';
    // nutrition.innerHTML = '';
    // nutritionDetail.innerHTML = '';

    recipeName.textContent = menu.label;
    recipeImage.src = menu.image;
    recipeImage.alt = menu.label;
    categoryCuisineType.innerHTML = cuisineType;
    categoryDietType.innerHTML = dietLabels;
    nutritionDetail.innerHTML = `Total: ${totalWeight}g, Calories: ${calories}kcal, Carb: ${carb}g, Protein: ${protein}g, Fat: ${fat}g`

    if (healthLabels.includes('Peanut-Free')) {
        const peanutFreeList = document.createElement('li');
        peanutFreeList.innerHTML = '<div><span>Peanut-Free</span></div>';
        healthUl.appendChild(peanutFreeList);
    }

    if (healthLabels.includes('Vegan')) {
        const veganList = document.createElement('li');
        veganList.innerHTML = '<div><span>Vegan</span></div>'
        healthUl.appendChild(veganList);
    }

    if (healthLabels.includes('Vegetarian')) {
        const vegetarianList = document.createElement('li');
        vegetarianList.innerHTML = '<div><span>Vegetarian</span></div>'
        healthUl.appendChild(vegetarianList);
    }

    if (healthLabels.includes('Alcohol-Free')) {
        const alcoholFreeList = document.createElement('li');
        alcoholFreeList.innerHTML = '<div><span>Alcohol-Free</span></div>'
        healthUl.appendChild(alcoholFreeList);
    }

    health.appendChild(healthUl);


    menu.ingredientLines.forEach(ingred => {
        const ingredUl = document.createElement('ul')
        const ingredList = document.createElement('li');
        ingredList.textContent = ingred;
        ingredList.innerHTML = ingred;
        ingredUl.appendChild(ingredList);
        ingredientContainer.appendChild(ingredUl);
    })

    const link = document.createElement('button');
    link.innerHTML = `<a href="${menu.url}">Go to Recipe</a>`;

    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = `<button class="closeBtn">X</button>`;
    recipeLinkButton.appendChild(link);
    fridge.appendChild(closeBtn);

    //close recipe container
    closeBtn.addEventListener('click', () => {
        imageContainer.style.visibility = "hidden";
        recipeSection.style.visibility = "hidden";
    })
};

recipeApp.setLocalStorage = () => {
    localStorage.setItem(recipeApp.localStorage, JSON.stringify(recipeApp.ingredStorageArray));
}

recipeApp.getLocalStorage = () => {
    const loadedIngred = localStorage.getItem(recipeApp.localStorage);
    const storage = document.querySelector("#storage");

    if (loadedIngred) {
        const parsedIngred = JSON.parse(loadedIngred);
        parsedIngred.forEach(ingred => {
            const storageList = document.createElement("li");
            storageList.className = "storage-list";
            storageList.innerHTML = ingred;
            storage.prepend(storageList);
            recipeApp.ingredStorageArray.push(ingred);
        })
    }
}

recipeApp.clearLocalStorage = () => {
    localStorage.clear();
    const storageList = document.querySelectorAll(".storage-list");

    for (let i = 0; i < storageList.length; i++) {
        storageList[i].innerHTML = '';
    }
    location.reload();
}

recipeApp.init = () => {
    recipeApp.getLocalStorage();
    recipeApp.addIngred();
    recipeApp.submitButton();
};

recipeApp.init();