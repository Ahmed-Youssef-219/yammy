// https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata
const menubars = document.getElementById("menubars");
const navContainer = document.querySelector(".nav-container");
const navContent = document.querySelector(".nav-content-container");
const navItems = document.querySelectorAll(".nav-items ul li");
const contentContainer = document.querySelector(".content-container");
const nameSearch = document.getElementById('name_search');

const inputs_wrapper = document.getElementById('inputs_wrapper')
const letterSearch = document.getElementById('letter_search');
const cardsWrapper = document.querySelector(
  ".content-container .cards-wrapper"
);
const spinner_container = document.querySelector('.spinner_container')

let data;

const fetching_data = async (url) => {
  try {
    const response = await fetch(url);
    data = await response.json();
    console.log(data)
  } catch (error) {
    console.log(error);
  }
};

const handleMenubar = () => {
  // menubars.classList.remove("fa-bars")
  menubars.classList.toggle("fa-xmark");
  navContainer.classList.toggle("translate_x");
  navItems.forEach((item, index) => {
    item.classList.toggle(`list_${index + 1}`);
  });
};

const get_measures_ingredients = (meal) => {
  let recipesCode = "";
  let ingredientArray = [];
  let measureArray = [];
  for (let index = 1; index <= 20; index++) {
    ingredientArray.push(`strIngredient${index}`);
    measureArray.push(`strMeasure${index}`);
  }
  for (let index = 0; index < ingredientArray.length; index++) {
    if (meal[measureArray[index]] == " " || meal[measureArray[index]] == "") {
      continue;
    } else {
      let recipe = `<div class="recipe">${meal[measureArray[index]]} ${
        meal[ingredientArray[index]]
      }</div>`;
      recipesCode += recipe;
    }
  }
  return recipesCode;
};

const get_tags = (meal) => {
  let tagsArray;
  if (meal.strTags == null) {
    tagsArray = [];
  } else {
    tagsArray = meal.strTags.split(",");
  }
  let tagsCode = "";
  for (let index = 0; index < tagsArray.length; index++) {
    let tag = `<div class="tag">${tagsArray[index]}</div>`;
    tagsCode += tag;
  }
  return tagsCode;
};

const go_to_meal_details = async (mealId) => {

  spinner_container.style.display = 'flex';
  let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals?.forEach((meal) => {
    const htmlCode =
      '<div class="meal_details">' +
      '<div class="meal_details_image">' +
      `<img src="${meal.strMealThumb}" alt="">` +
      `<h2>${meal.strMeal}</h2>` +
      "</div>" +
      "<div class='meal_details_content'>" +
      `<h3>Instructions</h3>` +
      `<p class='instructions'>${meal.strInstructions}</p>` +
      `<div class="area">` +
      "<span>Area :</span>" +
      `${meal.strArea}` +
      `</div>` +
      `<div class="category">` +
      "<span>Category :</span>" +
      `${meal.strCategory}` +
      `</div>` +
      `<span >Recipes : </span>` +
      "<div class='recipes_wrapper'>" +
      get_measures_ingredients(meal) +
      "</div>" +
      `<div>` +
      "<span>Tags :</span>" +
      `<div class='tags_wrapper'>` +
      get_tags(meal) +
      `</div>` +
      `</div>` +
      "<div class='links'>" +
      `<a href="${meal.strSource}" target="_blank">Source</a>` +
      `<a href="${meal.strYoutube}" target="_blank">youtube</a>` +
      "</div>" +
      "</div>" +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = 'none';
};

//======================== fetch food data from api to put it in the home page ===================
const home_page = async () => {

  spinner_container.style.display = 'flex';

  const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals.forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="go_to_meal_details(${meal.idMeal})">` +
      `<img src=${meal.strMealThumb} alt="" />` +
      `<div class="overlay">` +
      `<h2>${meal.strMeal}</h2>` +
      "</div>" +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = 'none';
};

home_page();

// ============================== Search ===============================

let searchQuery = '' ;
const handleChange = async (event) => {
  spinner_container.style.display = 'flex';
  searchQuery = event.target.value;
  let url ;
  console.log(event.target.id)
  if(event.target.id == "name_search"){
    url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
  }else{
    url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchQuery}`
  }
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals?.forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="go_to_meal_details(${meal.idMeal})">` +
      `<img src=${meal.strMealThumb} alt="" />` +
      `<div class="overlay">` +
      `<h2>${meal.strMeal}</h2>` +
      "</div>" +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = 'none';
}

const go_to_search = async () => {
  spinner_container.style.display = 'flex';
  inputs_wrapper.style.display = 'flex';
  cardsWrapper.innerHTML = " ";
  handleMenubar()
  spinner_container.style.display = 'none';
}

// ============================= categories ============================
const go_to_categories = async () => {
  spinner_container.style.display = 'flex';
  inputs_wrapper.style.display = 'none';
  handleMenubar()

  let url = "https://www.themealdb.com/api/json/v1/1/categories.php";
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.categories.forEach((category) => {
    const htmlCode =
      `<div class="card" onclick="filter_by_category('${category.strCategory}')">` +
      `<img src=${category.strCategoryThumb} alt="" />` +
      `<div class="overlay">` +
      `<h2>${category.strCategory}</h2>` +
      `<p>${category.strCategoryDescription.slice(0, 100)}</div>` +
      "</div>" +
      "</div>";
    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = 'none';
};

// =========== filter by category ============

const filter_by_category = async (category) => {
  spinner_container.style.display = 'flex';
  let url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals.forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="go_to_meal_details(${meal.idMeal})">` +
      `<img src=${meal.strMealThumb} alt="" />` +
      '<div class="overlay">' +
      `<h2>${meal.strMeal}</h2>` +
      "</div>" +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = 'none';
};

// ============================= Areas ============================

const go_to_areas = async () => {
  spinner_container.style.display = 'flex';
  inputs_wrapper.style.display = 'none';
  handleMenubar();

  let url = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals.forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="filter_by_area('${meal.strArea}')">` +
      `<i class="fa-solid fa-house"></i>` +
      `<h2>${meal.strArea}</h2>` +
      "</div>";
    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = 'none';
};
// =========== filter by area ============
const filter_by_area = async (area) => {
  spinner_container.style.display = 'flex';

  let url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals.forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="go_to_meal_details(${meal.idMeal})">` +
      `<img src=${meal.strMealThumb} alt="" />` +
      '<div class="overlay">' +
      `<h2>${meal.strMeal}</h2>` +
      "</div>" +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = 'none';
};

// ============================= Ingredients ============================

const go_to_ingredients = async () => {
  spinner_container.style.display = 'flex';

  inputs_wrapper.style.display = 'none';
  handleMenubar();

  let url = "https://www.themealdb.com/api/json/v1/1/list.php?i=list";
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals.slice(0, 20).forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="filter_by_ingredient('${meal.strIngredient}')">` +
      `<i class="fa-solid fa-utensils"></i>` +
      `<h2>${meal.strIngredient}</h2>` +
      `<p class="ingredient_p">${meal.strDescription.slice(0, 100)}</p>` +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = 'none';
};

// =========== filter by ingredient ============

const filter_by_ingredient = async (ingredient) => {
  spinner_container.style.display = 'flex';

  let url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
  await fetching_data(url);

  cardsWrapper.innerHTML = " ";
  data.meals.forEach((meal) => {
    const htmlCode =
      `<div class="card" onclick="go_to_meal_details(${meal.idMeal})">` +
      `<img src=${meal.strMealThumb} alt="" />` +
      '<div class="overlay">' +
      `<h2>${meal.strMeal}</h2>` +
      "</div>" +
      "</div>";

    cardsWrapper.innerHTML += htmlCode;
  });
  spinner_container.style.display = 'none';
};