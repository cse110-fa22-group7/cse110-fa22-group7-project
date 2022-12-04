// collapse nav button
document.addEventListener("DOMContentLoaded", () => {
  const collapseBtn = document.querySelector("#collapse_button");
  const collapseCon = document.querySelector("#collapse_container");
  const createBtn = document.querySelector("#create_button");
  const filterByCon = document.querySelector(".filter_by");
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
      '<img src="/source/images/create_white.svg" alt="create_image" height="22"> Create';
    filterBtn.textContent = "Filter by";
    summaryDateEl.style = summaryDateStyle;
    summaryLabelEl.style = summaryLabelStyle;
    mainEl.style.gridTemplateColumns = "250px auto";
    createBtn.style.width = createBtnWidth;
    collapseCon.style.justifyContent = "end";
    filterByCon.style.gap = "18px";
    filterByCon.style.justifyContent = "start";
    filterImgEl.style.cursor = "auto";
  }

  function shrink() {
    collapseBtn.textContent = ">";
    createBtn.innerHTML =
      '<img src="/source/images/create_white.svg" alt="create_image" height="22">';
    createBtn.style.width = 0;
    filterBtn.textContent = "";
    summaryDateEl.parentElement.removeAttribute("open");
    summaryLabelEl.parentElement.removeAttribute("open");
    summaryDateEl.style = "display:none";
    summaryLabelEl.style = "display:none";
    mainEl.style.gridTemplateColumns = "75px auto";
    collapseCon.style.justifyContent = "center";
    filterByCon.style.gap = 0;
    filterByCon.style.justifyContent = "center";
    filterImgEl.style.cursor = "pointer";
  }
  shrink();
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
