$(document).ready(function () {
  
  function confirmInput(elementId) {
    var input = $("#" + elementId).val().trim();

    if (input === "") {
      if (elementId !== "totalDeductions") {
        displayErrorMessage(elementId);
      } else {
        displayErrorMessage(elementId, "hidden");
      }
      return;
    }

    var isValidNumber = /^-?\d*\.?\d+(?:e[+-]?\d+)?$/.test(input);

    if (!isValidNumber) {
      displayErrorMessage(elementId); 
    } else {
      displayErrorMessage(elementId, "hidden");
    }
  }
  
  function inputHandler() {
    confirmInput(this.id);
  }

  $("#annualIncome, #extraIncome, #totalDeductions").on("input", inputHandler);

  $("#taxForm").submit(function (e) {
    e.preventDefault();

    const annualIncome = parseFloat($("#annualIncome").val()) || 0;
    const extraIncome = parseFloat($("#extraIncome").val()) || 0;
    const age = $("#ageGroup").val() || 0;
    const deductions = parseFloat($("#totalDeductions").val()) || 0;

    $(".errorMsg").css("visibility", "hidden");

    let hasError = false;

    if (!annualIncome) {
      displayErrorMessage("annualIncome");
      hasError = true;
    }
    if (!extraIncome) {
      displayErrorMessage("extraIncome");
      hasError = true;
    }
    if (!age) {
      displayErrorMessage("ageGroup");
      hasError = true;
    }
    if (!deductions) {
      displayErrorMessage("totalDeductions");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const tax = calculateTax(age, annualIncome, extraIncome, deductions);

    $("#myModal").css("display", "flex");
    const incomeAfterTax = annualIncome + extraIncome - deductions - tax;
    const resultText = `<p class="heading">Your Overall Income will be</p> ${formatIndianNumber(
      incomeAfterTax
    )} <p class='description'>after tax deduction.</p>`;
    $("#result").html(resultText);
  });

  function displayErrorMessage(elementId, visibility) {
    $(`#${elementId} ~ .errorMsg`).css("visibility", visibility || "visible");
  }

  $(window).click(function (e) {
    const modal = $("#myModal");
    if (e.target === modal[0]) {
      modal.css("display", "none");
    }
  });

  $("#closeModal").click(function () {
    $("#myModal").css("display", "none");
    window.location.reload();
  });

  function calculateTax(age, annualIncome, extraIncome, deductions) {
    const overallIncome = annualIncome + extraIncome - deductions;

    if (overallIncome <= 800000) {
      return 0;
    } else {
      let taxableAmount = overallIncome - 800000;

      if (age < 40) {
        return taxableAmount * 0.3;
      } else if (age >= 40 && age < 60) {
        return taxableAmount * 0.4;
      } else {
        return taxableAmount * 0.1;
      }
    }
  }

  function formatIndianNumber(tax) {
    const suffixes = ["", "Lakh", "Crore"];
    let i = 0;

    while (tax >= 100000) {
      tax /= 100000;
      i++;
    }

    if (i > 0) {
      return `${tax.toFixed(1)} ${suffixes[i]}`;
    } else {
      return `${tax.toFixed(2)} ${suffixes[i]}`;
    }
  }

});
