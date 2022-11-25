// collapse nav button
const collapseBtn = document.querySelector("#collapse_button");
const createBtn = document.querySelector('#create_button');
const filterBtn = document.querySelector('.filter_by h2');
const summaryDateEl = document.querySelector('summary#date_option');
const summaryLabelEl = document.querySelector('summary#label_option');

const collapseContainer = document.querySelector('#collapse_container');
const leftCreate = document.querySelector('.left_create');
const filters= document.querySelector('.filters');


let summaryDateStyle = summaryDateEl.style;
let summaryLabelStyle = summaryLabelEl.style;
collapseBtn.addEventListener("click", () => {
    // Collapse button textcontent to >
    if( collapseBtn.textContent == 'x') {
        collapseBtn.textContent = ">";
        createBtn.innerHTML = '<img src="/source/images/create_white.svg" alt="create_image" height="22">';
        filterBtn.textContent = ''
        summaryDateEl.style = 'display:none';
        summaryLabelEl.style = 'display:none';

    } else {
        // restore the sidebar
        collapseBtn.textContent = "x";
        createBtn.innerHTML = '<img src="/source/images/create_white.svg" alt="create_image" height="22"> Create';
        filterBtn.textContent = 'Filter by';
        summaryDateEl.style = summaryDateStyle;
        summaryLabelEl.style= summaryLabelStyle;
    }
});