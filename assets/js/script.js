$(document).ready(function () {
  //phone mask
  $.mask.definitions["h"] = "[A-Fa-f0-9]";
  $("#bgcolor").mask("+375 (99) 999-99-99", {
    completed: function () {
      this.removeClass("error");
    },
  });

  //select
  $(".select").each(function () {
    const _this = $(this),
      selectOption = _this.find("option"),
      selectOptionLength = selectOption.length,
      duration = 200;

    _this.hide();
    _this.wrap('<div class="select"></div>');
    $("<div>", {
      class: "new-select",
      text: _this.children("option:disabled").text(),
    }).insertAfter(_this);

    const selectHead = _this.next(".new-select");
    $("<div>", {
      class: "new-select__list",
    }).insertAfter(selectHead);

    const selectList = selectHead.next(".new-select__list");
    for (let i = 1; i < selectOptionLength; i++) {
      $("<div>", {
        class: "new-select__item",
        html: $("<span>", {
          text: selectOption.eq(i).text(),
        }),
      })
        .attr("data-value", selectOption.eq(i).val())
        .appendTo(selectList);
    }

    const selectItem = selectList.find(".new-select__item");
    selectList.slideUp(0);
    selectHead.on("click", function () {
      if (!$(this).hasClass("on")) {
        $(this).addClass("on");
        selectList.slideDown(duration);

        selectItem.on("click", function () {
          let chooseItem = $(this).data("value");

          $("select").val(chooseItem).attr("selected", "selected");
          selectHead.text($(this).find("span").text());

          selectList.slideUp(duration);
          selectHead.removeClass("on").addClass("new-select__checked");
        });
      } else {
        $(this).removeClass("on");
        selectList.slideUp(duration);
      }
    });
  });

});


document.addEventListener("DOMContentLoaded", function () {
  //help btns
  let currentlyOpenHelpContent = null;

  const helpBtns = document.querySelectorAll(".help-btn");

  helpBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const helpContent = btn.querySelector(".help-content");

      if (currentlyOpenHelpContent === helpContent) {
        helpContent.classList.remove("open");
        btn.classList.remove("open");
        currentlyOpenHelpContent = null;
        return;
      }

      if (currentlyOpenHelpContent) {
        currentlyOpenHelpContent.classList.remove("open");
        currentlyOpenHelpContent.parentNode.classList.remove("open");
      }

      helpContent.classList.toggle("open");
      btn.classList.toggle("open");

      currentlyOpenHelpContent = helpContent;
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("help-btn") && !event.target.classList.contains("help-content")) {
      // Close  currently open helpContent
      if (currentlyOpenHelpContent) {
        currentlyOpenHelpContent.classList.remove("open");
        currentlyOpenHelpContent.parentNode.classList.remove("open");
        currentlyOpenHelpContent = null;
      }
    }
  });

  document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("help-btn") && !event.target.classList.contains("help-content")) {
      // Close  currently open helpContent
      if (currentlyOpenHelpContent) {
        currentlyOpenHelpContent.classList.remove("open");
        currentlyOpenHelpContent.parentNode.classList.remove("open");
        currentlyOpenHelpContent = null;
      }
    }
  });


  //form
  // click on block and add .block-checked
  const dataProgram = document.querySelectorAll(".robowash-item");
  dataProgram.forEach((item) => {
    item.addEventListener("click", (event) => {
      if (!event.target.classList.contains("help-btn")) {
        item.classList.toggle("block-checked");
        calcPriceCheckedPrograms();
      }
    });
  });

  document.querySelectorAll(".product-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      if (!event.target.classList.contains("help-btn")) {
        item.classList.toggle("block-checked");
        getAllPrice();
      }
    });
  });

  document.querySelectorAll(".concierge-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      if (!event.target.classList.contains("help-btn")) {
        item.classList.toggle("block-checked");
      }
    });
  });

  // calculate
  let formResult = document.querySelectorAll(".form-result span");
  let formResultWithoutLast = [...formResult].slice(0, -1);
  let totalPrice = formResult[formResult.length - 1];

  const inputFuel = document.querySelector('input[name="num-liters"]');
  const selectFuel = document.querySelector(".select-fuel");
  const product = document.querySelectorAll(".product-item");
  let priceCheckedProducts = 0;

  inputFuel.addEventListener("input", (e) => {
    const valueInputFuel = e.target.value;
    inputFuel.innerHTML = valueInputFuel;
    calcPriceFuel();
  });

  document
    .querySelectorAll(".select-fuel-wrap .new-select__item")
    .forEach((item) => {
      item.addEventListener("click", function () {
        item.click(); // double click
        calcPriceFuel();
      });
    });

  function calcPriceFuel() {
    formResult[0].innerHTML =
      (+selectFuel.value * inputFuel.value).toFixed(2) + " BYN";
    getAllPrice();
  }

  function calcPriceCheckedPrograms() {
    const res = [...dataProgram].reduce((acc, item) => {
      if (item.classList.contains("block-checked")) {
        acc += +item.dataset.program;
      }
      return acc;
    }, 0);

    formResult[1].innerHTML = res.toFixed(2) + " BYN";
    getAllPrice();
  }

  function getIndexPrice(index) {
    // console.log(index);
    if (index !== null && index !== undefined) {
      return !!+formResult[index].innerHTML.split("BYN")[0];
    } else {
      return !!+priceCheckedProducts;
    }
  }

  function calcPriceConcierge() {
    const a = getIndexPrice(0);
    const b = getIndexPrice(1);
    const c = getIndexPrice();
    // console.log(a, b, c);

    let PriceConcierge = 0;

    if (a && b && c) {
      PriceConcierge = 45;
    } else if (a && b) {
      PriceConcierge = 40;
    } else {
      PriceConcierge = 0;
    }
    formResult[2].innerHTML = PriceConcierge.toFixed(2) + " BYN";
  }

  function getAllPrice() {
    priceCheckedProducts = [...product].reduce((acc, item) => {
      if (item.classList.contains("block-checked")) {
        acc += +item.dataset.product;
      }
      return acc;
    }, 0);

    calcPriceConcierge();

    sumPricesWhithooutProduct = [...formResultWithoutLast].reduce(
      (acc, current) => acc + parseInt(current.textContent),
      0
    );

    totalPrice.innerHTML =
      sumPricesWhithooutProduct + priceCheckedProducts + " BYN";
  }

  //submit form
  const form = document.getElementById("form-concierge");
  const params = [];
  const consentCheckboxes = document.querySelectorAll('input[name="consent"]');
  const inputs = form.querySelectorAll(".input-item input");
  const selects = form.querySelectorAll(".new-select");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = validateForm();
    if (isValid) {
      collectParams();

      console.log(params); // выводим данные в консоль в виде массива !!!

    } else {
      alert("Заполните все обязательные поля")
    }
  });

  function validateForm() {
    let isValid = true;

    //validate inputs req
    inputs.forEach((input) => {
      const label = input
        .closest(".input-item")
        .querySelector(".input-item__label");
      if (label.classList.contains("req") && !input.value) {
        input.classList.add("error");
        isValid = false;
      } else {
        input.classList.remove("error");
      }

      input.addEventListener("input", () => {
        input.classList.remove("error");
      });
    });

    //validate inputs select
    selects.forEach((select) => {
      if (!select.classList.contains("new-select__checked")) {
        select.classList.add("error");
        isValid = false;
      } else {
        select.classList.remove("error");
      }

      select.addEventListener("click", () => {
        select.classList.remove("error");
      });
    });

    // validate consent-checkbox
    consentCheckboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        checkbox.nextElementSibling.classList.add("error");
        isValid = false;
      } else {
        checkbox.nextElementSibling.classList.remove("error");
      }
    });
    return isValid;
  }


  //collecting data for  server
  function collectParams() {
    params.length = 0;

    // Add inputs to params
    inputs.forEach((input) => {
      if (input.name && input.value) {
        params.push({ name: input.name, value: input.value });
      }
    });

    // Add selected fuel to params
    const fuelSelect = form.querySelector('select[name="fuel"]');
    if (fuelSelect && fuelSelect.options[fuelSelect.selectedIndex]) {
      params.push({
        ...params,
        name: "fuel",
        value: fuelSelect.options[fuelSelect.selectedIndex].text,
      })
    }

    // Add selected time to params
    const timeSelect = form.querySelector('select[name="time"]');
    if (timeSelect && timeSelect.options[timeSelect.selectedIndex]) {
      params.push({
        ...params,
        name: "time",
        value: timeSelect.options[timeSelect.selectedIndex].text,
      });
    }

    // Add programs to params
    const programsNames = [];
    dataProgram.forEach((item) => {
      if (item.classList.contains("block-checked")) {
        const titleElement = item.querySelector(".robowash-item__title");
        if (titleElement) {
          programsNames.push(titleElement.textContent);
        }
      }
    });
    if (programsNames.length > 0) {
      params.push({ name: "programs", value: programsNames });
    }

    // Add products to params
    const productsNames = [];
    product.forEach((item) => {
      if (item.classList.contains("block-checked")) {
        const nameElement = item.querySelector(".product-item__name");
        if (nameElement) {
          productsNames.push(nameElement.textContent);
        }
      }
    });
    if (productsNames.length > 0) {
      params.push({ name: "products", value: productsNames });
    }
  }
});
