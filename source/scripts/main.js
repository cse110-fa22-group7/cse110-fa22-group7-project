// collapse nav button
document.addEventListener("DOMContentLoaded", () => {
  const collapseBtn = document.querySelector("#collapse_button");
  const createBtn = document.querySelector("#create_button");
  const filterBtn = document.querySelector(".filter_by h2");
  const summaryDateEl = document.querySelector("summary#date_option");
  const summaryLabelEl = document.querySelector("summary#label_option");

  const mainEl = document.querySelector("main");
  const filterImgEl = document.querySelector("img.filter_img");

  let summaryDateStyle = summaryDateEl.style;
  let summaryLabelStyle = summaryLabelEl.style;
  let createBtnWidth = createBtn.style.width;

  function expand() {
    collapseBtn.textContent = "<";
    createBtn.innerHTML =
      '<img src=\"/source/images/create_white.svg\" alt=\"create_image\" height=\"22\"> Create';
    filterBtn.textContent = "Filter by";
    summaryDateEl.style = summaryDateStyle;
    summaryLabelEl.style = summaryLabelStyle;
    mainEl.style.gridTemplateColumns = "15rem auto";
    createBtn.style.width = createBtnWidth;
  }

  function shrink() {
    collapseBtn.textContent = ">";
    createBtn.innerHTML =
      '<img src=\"/source/images/create_white.svg\" alt=\"create_image\" height=\"22\">';
    createBtn.style.width = 0;
    filterBtn.textContent = "";
    summaryDateEl.style = "display:none";
    summaryLabelEl.style = "display:none";
    mainEl.style.gridTemplateColumns = "4.5rem auto";
  }
  collapseBtn.addEventListener("click", () => {
    // Collapse button textcontent to >
    if (collapseBtn.textContent == "<") {
      shrink();
    } else {
      expand();
    }
  });

  filterImgEl.addEventListener("click", () => {
    if (collapseBtn.textContent == ">") {
      expand();
    }
  });
});
