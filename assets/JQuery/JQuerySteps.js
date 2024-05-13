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
    });
});

$('.promo-code').click(function(){
  $('.promo-input').collapse('toggle');
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
    // Remove all li elements except the first and last
    $(".main-cart li:not(:first-child)").remove();
      
    // Update subtotal text to only display the $ sign
    $(".border.p-3.bg-white span[style='font-size: 14px;']").html("Subtotal <span style='color: #D75D33;'>$</span>");
    
    // Update counter to display 0
    $(".border.p-3.bg-white img[src='./assets/images/cart-icon.svg']").next().html("0");
    
    // Disable the next button
    $(".next-cart-btn").prop("disabled", true);

    // Update the text in the last span element
    var mealPlan = localStorage.getItem("selectedPlan");
    if (mealPlan) {
        $(".border.p-3.bg-white span.text-center").html("Please select total <b>" + mealPlan + " items</b> to continue");
    } else {
        $(".border.p-3.bg-white span.text-center").html("Please select items to continue");
    }

    // Update the text in the first list item with the date from local storage
    var deliveryDate = localStorage.getItem("selectedDate");
    if (deliveryDate) {
        $(".main-cart .delievery-date").html("My Delivery for: <b>" + deliveryDate + "</b>");
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

  // Update the meal count in the order summary
  $('.main-cart .order-summary .meal-count').html(mealCount + ' Meals');

  // Calculate the subtotal price
  var subtotalPrice = mealCount * 14;

  localStorage.setItem("totalPrice",subtotalPrice);

  // Update the subtotal price in the order summary
  $('.main-cart .order-summary .subtotal').html('<b>$' + subtotalPrice.toFixed(2) + '</b>');
  // Update the subtotal price in the order summary
  $('.main-cart .order-summary .subtotal-meal').html('$' + subtotalPrice.toFixed(2));
  // Update the subtotal in the bottom cart part
  $('.bottom-cart .cart-subtotal span').html('$' + subtotalPrice.toFixed(2));

 // Update the count after the cart icon
 $('.bottom-cart .cart-icon-count').text(mealCount);

 // Update the text in the last span element
  var mealPlan = parseInt(localStorage.getItem("selectedPlan")); // Convert to number
  console.log("Total Meals count in meals cards section", mealPlan);
  console.log("Total Meals count in meals cards section", mealCount);
  console.log("Difference", mealPlan - mealCount);
  if (mealPlan > mealCount) {
      // Disable the next button
      $(".next-cart-btn").prop("disabled", true);
      $(".border.p-3.bg-white span.text-center").html("Please add <b>" + (mealPlan - mealCount) + " more</b> meals.");
  } else if (mealPlan === mealCount) {
      // Enable the next button
      $(".next-cart-btn").prop("disabled", false);
      $(".border.p-3.bg-white span.text-center").html("<b>Ready to go!</b>");
  } else {
      // Disable the next button
      $(".next-cart-btn").prop("disabled", true);
      $(".border.p-3.bg-white span.text-center").html("Please remove <b>" + (mealCount - mealPlan) + " meal</b> to continue.");
  }
}

// Function to handle the click event on the minus icon
$(document).on('click', '.fa-minus', function() {
// Find the parent list item
var listItem = $(this).closest('.list-group-item');
listItem.remove();
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
})


// Function to handle the click event on the "Add" button
$('.add-btn').click(function() {
    // Get the meal details from the clicked meal card
    var mealName;
    var mealImage = $(this).closest('.meals-cards').find('.card-img-top').attr('src');

    // Check if it's a special meal card
    if ($(this).closest('.special-meal-card').length > 0) {
      // Extract meal name from special meal card
      mealName = $(this).closest('.special-meal-card').find('.card-body .card-title').text().trim();
    } else {
        // Extract meal name from regular meal card
        mealName = $(this).closest('.meals-cards').find('.card-title').text().trim();
    }

    // Check if it's a special meal card
    var isSpecialCard = $(this).closest('.meals-cards').hasClass('special-meal-card');

    // Remove "@2x" from the image source
    mealImage = mealImage.replace('@2x', '');

    // Create a new list item with the meal details
    var listItem = '<li class="list-group-item border-0" style="' + (isSpecialCard ? 'background-color: black;' : '') + '">' +
    '<div style="display: flex; flex-direction: row; justify-content: space-between; background-color: ' + (isSpecialCard ? 'black;' : '#F3F3F3;') + '">' +
        '<div style="display: flex; flex-direction: row; gap: 3px;">' +
            '<img src="' + mealImage + '" alt="Meal">' +
            '<span class="pt-4" style="font-size: 13px; color: ' + (isSpecialCard ? 'white;' : 'black;') + '">' +
                '<b>' + mealName + '</b>' +
            '</span>' +
        '</div>' +
        '<div class="m-1 p-1" style="display: flex; flex-direction: column; justify-content: space-between;">' +
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
    totalPrice += 14;

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
