document.addEventListener("DOMContentLoaded", function () {
  let addIngredientsBtn = document.getElementById("addIngredientsBtn");
  let ingredientList = document.querySelector(".ingredientList");
  let ingredeintDiv = document.querySelector(".ingredeintDiv");

  if (addIngredientsBtn && ingredientList && ingredeintDiv) {
    addIngredientsBtn.addEventListener("click", function () {
      let newIngredients = ingredeintDiv.cloneNode(true);
      let input = newIngredients.getElementsByTagName("input")[0];
      input.value = "";
      ingredientList.appendChild(newIngredients);
    });
  } else {
    console.error("One or more elements are missing:", {
      addIngredientsBtn,
      ingredientList,
      ingredeintDiv,
    });
  }
});
