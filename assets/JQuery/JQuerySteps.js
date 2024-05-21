window.addEventListener('load', function () {
  localStorage.clear();
  // Update the subtotal in the bottom cart part
  $('.bottom-cart .cart-subtotal span').html('$');

  // Update the count after the cart icon
  $('.bottom-cart .cart-icon-count').text(0);
  // Disable the next button
  $(".next-cart-btn").prop("disabled", true);
});

$(document).ready(function () {
  // Show the top navigation
  $(".top-nav").show();
  var currentStep = 0;
  var visitedSteps = [];

  // Get all list items
  var listItems = document.querySelectorAll('.delievery-date-btn');

  // Add click event listener to each list item
  listItems.forEach(function(item) {
      item.addEventListener('click', function() {
          // Remove any existing 'clicked' class from other items
          listItems.forEach(function(item) {
              item.classList.remove('clicked');
          });
          
          // Add 'clicked' class to the clicked item
          this.classList.add('clicked');

          // Remove 'clicked-parent' class from all parent divs
          var allParentDivs = document.querySelectorAll('.clicked-parent');
          allParentDivs.forEach(function(div) {
              div.classList.remove('clicked-parent');
          });

          // Apply the 'clicked-parent' class to the parent div of the clicked item
          var parentDiv = this.closest('.delievery-date-btn-container');
          if (parentDiv) {
              parentDiv.classList.add('clicked-parent');
          }
      });
  });

  $('#promo-code-button').click(function() {
    $(this).hide();
    $('#promo-code-input').show().focus();
  });

  // Initially hide all sections except the first one
  $("#final-project section").not(":first").hide();

  // Highlight the "Plans" navigation item on page load
  highlightNavOption("plan-step");

  // Function to handle when a meal plan card is clicked
  $(".meal-pack").on("click", function () {
    // Get the meal plan value from the clicked card
    var planValue = $(this).data("plan-value");

    // Store the selected meal plan value in local storage
    localStorage.setItem("selectedPlan", planValue);
    // Log the selected plan value to the console
    console.log("Selected Plan Value:", planValue);

    // Move to the next step (day-step)
    $("#final-project section[data-step='day-step']").show();
    $("#final-project section[data-step='plan-step']").hide();

    // Highlight the navigation option for the current step
    highlightNavOption("day-step");

    // Update the current step
    currentStep = 1;
    // Add the current step to the visited steps array
    visitedSteps.push("plan-step");
    // Update the navigation links
    updateNavigation();
  });

  // Function to handle when a date is clicked
  $(".list-group-item").on("click", function () {
    // Get the selected date text
    var selectedDate = $(this).text().trim();
    // Store the selected date in local storage
    localStorage.setItem("selectedDate", selectedDate);
    // Log the selected plan value to the console
    console.log("Selected date Value:", selectedDate);
    // Update the first delivery date displayed on the page
    $(".first-delivery-date").text(selectedDate);
  });

  // Function to check if next button is clicked 
  $(".next-button").on("click", function() {
    // Check if the local storage contains the delivery date
    var deliveryDate = localStorage.getItem("selectedDate");
    console.log("Selected Date : ", deliveryDate);
    if (!deliveryDate) {
        // If no delivery date is found, set the default date (Monday, Jun 26)
        deliveryDate = "Monday, Jun 26";
        // Store the default date in local storage
        localStorage.setItem("selectedDate", deliveryDate);
    }
    console.log("Selected Date : ", deliveryDate);

  // Update the text in the last span element
  var mealPlan = parseInt(localStorage.getItem("selectedPlan"), 10);
  var mealCount = parseInt(localStorage.getItem("mealCartCount"), 10);
    if (mealPlan > mealCount) {
      // Disable the next button
      $(".next-cart-btn").prop("disabled", true);
      $(".border.p-3.bg-white span.text-center").html("Please add <b>" + Math.abs(mealPlan - mealCount) + " more</b> meals.");
  } else if (mealPlan === mealCount) {
      // Enable the next button
      $(".next-cart-btn").prop("disabled", false);
      $(".border.p-3.bg-white span.text-center").html("<b>Ready to go!</b>");
  } else if (mealPlan < mealCount) {
    console.log("Meal Plan", mealPlan);
    console.log("Meal Count", mealCount);
      // Disable the next button
      $(".next-cart-btn").prop("disabled", true);
      $(".border.p-3.bg-white span.text-center").html("Please remove <b>" + Math.abs(mealPlan - mealCount) + " meal</b> to continue.");
  } else if (mealPlan || mealCount) {
     // Disable the next button
     $(".next-cart-btn").prop("disabled", true);
     $(".border.p-3.bg-white span.text-center").html("Please add <b>" + mealPlan + " more</b> meals.");
  }

    // Update the text in the first list item with the date from local storage
    var deliveryDate = localStorage.getItem("selectedDate");
    if (deliveryDate) {
        $(".main-cart .delivery-date").html("My Delivery for: <b>" + deliveryDate + "</b>");
    }
    
     // Move to the next step (day-step)
     $("#final-project section[data-step='meals-step']").show();
     $("#final-project section[data-step='day-step']").hide();
     // Highlight the navigation option for the current step
     highlightNavOption("meals-step");
     // Update the current step
     currentStep = 2;
     // Add the current step to the visited steps array
     visitedSteps.push("day-step");
     // Update the navigation links
     updateNavigation();
  });

  // Variable to track if the order summary has been added
  var orderSummaryAdded = false;

  // Variable to track the total price
  var totalPrice = 0;

  // Function to update the order summary
  function updateOrderSummary() {
    // Count the number of meals
    var mealCount = $('.main-cart .list-group-item').length - 2;

    // Ensure meal count is not negative
    if (mealCount < 0) mealCount = 0;

    // Separate counts for regular and special meals
    var regularMealCount = 0;
    var specialMealCount = 0;

    // Calculate counts based on meal type
    $('.main-cart .list-group-item').each(function() {
      if ($(this).find('span').css('color') === 'rgb(255, 255, 255)') { // Special meal
        specialMealCount++;
      } else {
        regularMealCount++;
      }
    });

    // Adjust the counts
    regularMealCount -= 2; // Exclude the clear button and order summary

    // Ensure counts are not negative
    if (regularMealCount < 0) regularMealCount = 0;

    // Calculate the subtotal price for regular meals
    var regularSubtotal = regularMealCount * 14;

    // Calculate the subtotal price
    var subtotalPrice = regularSubtotal + (specialMealCount * 11.49);

    localStorage.setItem("totalPrice", subtotalPrice);
    localStorage.setItem("mealCartCount", mealCount);

    // Update the meal count in the order summary
    $('.main-cart .order-summary .meal-count').html(mealCount + ' Meals');

    // Update the subtotal price in the order summary
    var specialMealDisplay = specialMealCount > 0 ? `+ $${(specialMealCount * 11.49).toFixed(2)}` : '';
    $('.main-cart .order-summary .subtotal').html('<b>$' + subtotalPrice.toFixed(2) + '</b>');
    $('.main-cart .order-summary .subtotal-meal').html('$' + regularSubtotal.toFixed(2) + ' ' + specialMealDisplay + '');
    $('.bottom-cart .cart-subtotal span').html('$' + subtotalPrice.toFixed(2));

    // Update the count after the cart icon
    $('.bottom-cart .cart-icon-count').text(mealCount);

    // Update the text in the last span element
    var mealPlan = parseInt(localStorage.getItem("selectedPlan")); // Convert to number
    if (mealPlan > mealCount) {
      $(".next-cart-btn").prop("disabled", true);
      $(".border.p-3.bg-white span.text-center").html("Please add <b>" + (mealPlan - mealCount) + " more</b> meals.");
    } else if (mealPlan === mealCount) {
      $(".next-cart-btn").prop("disabled", false);
      $(".border.p-3.bg-white span.text-center").html("<b>Ready to go!</b>");
    } else {
      $(".next-cart-btn").prop("disabled", true);
      $(".border.p-3.bg-white span.text-center").html("Please remove <b>" + (mealCount - mealPlan) + " meal</b> to continue.");
    }
  }

  // Function to handle the click event on the clear all button
  $(document).on('click', '.clear-all-btn', function() {
    // Remove all list items except the first one (which contains the clear button)
    $('.main-cart .list-group-item').not(':first').remove();

    // Set the flag to indicate that the order summary has not been added
    orderSummaryAdded = false;

    // Reset the total price to zero
    totalPrice = 0;

    // Reset the subtotal price in local storage
    localStorage.setItem("totalPrice", totalPrice);

    // Update the order summary to reflect the changes
    updateOrderSummary();
  });

  // Function to add a meal to the cart
  function addMealToCart(mealTitle, isSpecial) {
    // Check if the order summary has already been added
    if (!orderSummaryAdded) {
      // Add the order summary to the cart
      $('.main-cart .list-group').append(`
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span class="clear-all-btn">Clear All</span>
          <span class="order-summary">
            <span class="meal-count"></span> -
            Subtotal: <span class="subtotal-meal"></span>
          </span>
        </li>
      `);

      // Set the flag to indicate that the order summary has been added
      orderSummaryAdded = true;
    }

    // Determine the price of the meal based on whether it is a special meal or not
    var mealPrice = isSpecial ? 11.49 : 14;

    // Create the new list item
    var listItem = `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${mealTitle}
        <span class="badge badge-primary badge-pill">${isSpecial ? '$11.49' : '$14'}</span>
      </li>
    `;

    // Add the new list item to the cart
    $('.main-cart .list-group-item').first().after(listItem);

    // Increment the total price
    totalPrice += mealPrice;

    // Update the subtotal price in local storage
    localStorage.setItem("totalPrice", totalPrice);

    // Update the order summary to reflect the changes
    updateOrderSummary();
  }

  // Function to handle the click event on a meal item
  $(".meal-item").on("click", function () {
    // Get the meal title
    var mealTitle = $(this).data("meal-title");
    // Get the special meal flag
    var isSpecial = $(this).data("special-meal");

    // Add the meal to the cart
    addMealToCart(mealTitle, isSpecial);
  });

  // Function to handle the click event on the clear all button
  $(document).on('click', '.clear-all-btn', function() {
    // Remove all list items except the first one (which contains the clear button)
    $('.main-cart .list-group-item').not(':first').remove();

    // Set the flag to indicate that the order summary has not been added
    orderSummaryAdded = false;

    // Reset local storage values
    localStorage.setItem("totalPrice", 0);
    localStorage.setItem("mealCartCount", 0);

    // Update the order summary
    updateOrderSummary();
  });

  // Function to handle the click event on the minus icon
  $(document).on('click', '.fa-minus', function() {
    // Find the parent list item
    var listItem = $(this).closest('.list-group-item');
    listItem.remove();
    updateOrderSummary();
  });

  $(document).on('click', '.fa-plus', function() {
    // Find the parent list item
    var listItem = $(this).closest('.list-group-item');
    
    // Clone the list item
    var clonedItem = listItem.clone();
  
    // Append the cloned item before the last list item
    listItem.parent().find('li:last-child').before(clonedItem);
  
    // Update the order summary
    updateOrderSummary();
  });
  

  $('.next-cart-btn').click(function(){
    // Retrieve the selected delivery date
    var selectedDeliveryDate = localStorage.getItem("selectedDate")

    // Update the text content of the "Delivery Date" input field in the order summary
    $('#delievery-date').val(selectedDeliveryDate);
    // Updating total price 
    var totalPrice = parseInt(localStorage.getItem("totalPrice"));
    $('#totalPrice').text('$' + totalPrice.toFixed(2));
    $('#totalOrderSummary').text('$' + (totalPrice + 8.99 + 10.99).toFixed(2));

    // Move to the next step (day-step)
    $("#final-project section[data-step='checkout-step']").show();
    $("#final-project section[data-step='meals-step']").hide();
    // Highlight the navigation option for the current step
    highlightNavOption("checkout-step");
    // Update the current step
    currentStep = 2;
    // Add the current step to the visited steps array
    visitedSteps.push("meals-step");
    // Update the navigation links
    updateNavigation();
  });

  // Function to handle the click event on the "Add" button
$('.add-btn').click(function() {
  // Get the meal details from the clicked meal card
  var mealName;
  var mealImage = $(this).closest('.meals-cards').find('.card-img-top').attr('src');

  // Check if it's a special meal card
  var isSpecialCard = $(this).closest('.meals-cards').hasClass('special-meal-card');

  // Extract meal name from special meal card
  if (isSpecialCard) {
    mealName = $(this).closest('.special-meal-card').find('.card-body .card-title').text().trim();
  } else {
    // Extract meal name from regular meal card
    mealName = $(this).closest('.meals-cards').find('.card-title').text().trim();
  }

  // Remove "@2x" from the image source
  mealImage = mealImage.replace('@2x', '');

  // Create a new list item with the meal details
  var listItem = '<li class="list-group-item border-0 mt-1 cart-meal-cards" style="' + (isSpecialCard ? 'background-color: black;' : 'background-color: #F3F3F3;') + '">' +
  '<div style="display: flex; flex-direction: row; justify-content: space-between; background-color: ' + (isSpecialCard ? 'black;' : '#F3F3F3;') + '">' +
  '<div style="display: flex; flex-direction: row; gap: 3px;">' +
  '<div class="img-container">' +
  '<img src="' + mealImage + '" alt="Meal">' +
  (isSpecialCard ? '<div class="bottom-left border">+$11.49</div>' : '') + // Conditionally add the bottom text
  '</div>' +
  '<div class="my-meals-summary-card-li-content">' +
  '<span style="font-size: 13px; color: ' + (isSpecialCard ? 'white;' : 'black;') + '">' +
  '<b>' + mealName + '</b>' +
  '</span>' +
  '</div>' +
  '</div>' +
  '<div class="m-1 p-1" style="display: flex; flex-direction: column; justify-content: start; gap: 1.1rem">' +
  '<i role="button" class="fa fa-plus" style="color: ' + (isSpecialCard ? 'white;' : '#717171;') + '"></i>' +
  '<i role="button" class="fa fa-minus" style="color: ' + (isSpecialCard ? 'white;' : '#717171;') + '"></i>' +
  '</div>' +
  '</div>' +
  '</li>';

  // If the order summary hasn't been added yet
  if (!orderSummaryAdded) {
    // Add the Order Summary below all selected meals
    var orderSummary = '<li class="list-group-item border-0 order-summary">' +
      '<div style="display: flex; flex-direction: column; justify-content: space-between;">' +
      '<span style="font-size: 14px;">' +
      '<b>Order Summary</b>' +
      '</span>' +
      '<div style="display: flex; flex-direction: row; justify-content: space-between;">' +
      '<span style="font-size: 14px;" class="meal-count">' +
      '0 Meals' +
      '</span>' +
      '<span style="font-size: 14px;" class="subtotal-meal">' +
      '$0' +
      '</span>' +
      '</div>' +
      '<div style="display: flex; flex-direction: row; justify-content: space-between;">' +
      '<span style="font-size: 14px;">' +
      'Subtotal' +
      '</span>' +
      '<span class="subtotal" style="font-size: 14px;">' +
      '<b>$0</b>' +
      '</span>' +
      '</div>' +
      '<span class="text-center mt-4 mb-4" style="font-size: 12px;">' +
      'Tax and shipping calculated at checkout' +
      '</span>' +
      '</div>' +
      '</li>';

    // Add the Order Summary to the cart column
    $('.main-cart').append(orderSummary);

    // Set the flag to indicate that the order summary has been added
    orderSummaryAdded = true;
  }

  // Add the new list item to the cart column before the Order Summary
  $('.main-cart .list-group-item:last-child').before(listItem);

  // Update the total price
  totalPrice += isSpecialCard ? 11.49 : 14;

  // Update the order summary
  updateOrderSummary();
});


  // Function to update the navigation links based on the current step
  function updateNavigation() {
    $("[data-step-target]").each(function () {
      var targetStep = $(this).data("step-target");
      var targetIndex = parseInt(targetStep.split("-")[1]);
      if (targetIndex <= currentStep || visitedSteps.includes(targetStep)) {
        $(this).removeClass("disabled");
      } else {
        $(this).addClass("disabled");
      }
    });
  }

  // Function to highlight the navigation option for the current step
  function highlightNavOption(step) {
    // Remove blue color from all navigation options
    $(".top-nav p").css("color", "black");
    // Add blue color to the navigation option for the current step
    $(".top-nav p[data-step-target='" + step + "']").css("color", "blue");
  }

  // Add click event listener to navigation links
  $("[data-step-target]").on("click", function () {
    // Get the target step from the clicked element
    var targetStep = $(this).data("step-target");
    var targetIndex = parseInt(targetStep.split("-")[1]);
    // Check if the target step can be navigated to
    if (targetIndex <= currentStep || visitedSteps.includes(targetStep)) {
      // Hide all sections except the target one
      $("#final-project section").not("[data-step='" + targetStep + "']").hide();
      // Show the target section
      $("#final-project section[data-step='" + targetStep + "']").show();
      // Highlight the clicked navigation option
      highlightNavOption(targetStep);
      // Update the current step
      currentStep = targetIndex;
      // Update the navigation links
      updateNavigation();
    }
  });

  // Update navigation links initially
  updateNavigation();
});
