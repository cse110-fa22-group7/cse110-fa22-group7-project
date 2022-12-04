/**JouralPost.js contains the JournalPost class defining the HTML element journal-post
 * as well as methods for interfacing with these posts, saving and loading them to local storage
 * and appending them to an element with id="posts" on the page.
 *
 * @TODO : loading and saving posts is done at curr_user + post_key in local storage, curr_user is currently hardcoded as the empty string,
 *        however as we implement the login page, we will need to figure out how to keep track of the current user.
 *
 * @TODO : Find a better way of handing post ids.
 *
 * @TODO : Handle dates correctly, Date.now() gives milliseconds since something IDRK, we would prefer something like MM/DD/YYYY I think
 */
import { create_popup } from "./Popup.js";
/** Post Class for custom web-component post
 *
 */
import * as dateComp from "./DateFilter.js";
import * as myDialog from "./customdialog.js";
class JournalPost extends HTMLElement {
  /**
   * sets up shadow dom
   * @constructor
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    let article = document.createElement("article");
    article.id = "post-article";
    this.shadowRoot.appendChild(article);

    let style = document.createElement("style");
    style.innerText = `
    /*Styles posts*/
    article {
      position: relative;
      display: flex;
      flex-direction: column;
      word-wrap: break-word;
      border-radius: 0.75rem;
      background-color: #202020;
      min-height: 15rem;
      height: 100%;
    }

    /*Styles header*/
    .post_header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-weight: 600;
      gap: 1rem;
      align-items: center;
      padding: 0.4rem;
      border-radius: 0.75rem 0.75rem 0 0;
      background-color: rgba(87, 87, 87, 0);
    }
    .post_label {
      grid-area: label;
      padding: 0 0.25rem;
      border-radius: 50vh;
      font-size: 1rem;
    }
    .post_buttons {
      grid-area: buttons;
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
    }
    .post_buttons * {
      border-radius: 2rem;
      background-color: #00000000;
      color: white;
      border: 2px solid white;
      padding: 0.25rem 0.75rem;
      height: 100%;
      width: 100%;
      font-size: 0.75rem;
      font-weight: 600;
      transition: 0.2s;
      cursor: pointer;
    }
    .post_edit:hover {
      color: #3191ff;
      border: 2px solid #3191ff;
    }
    .post_delete:hover {
      color: rgb(227, 45, 45);
      border: 2px solid rgb(227, 45, 45);
    }

    /*Styles footer*/
    .post_meta {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.5rem;
      border-radius: 0 0 0.75rem 0.75rem;
    }
    .post_meta * {
      font-size: 0.65rem;
      color: #606060;
    }

    /*Styles post text*/
    .post_text {
      grid-area: text;
      flex: 1 1 auto;
      margin: 0;
      border-bottom: 1px solid rgb(87, 87, 87);
      font-size: 1rem;
      line-height: 1.5rem;
      padding: 1rem;
      white-space: pre-wrap;
    }
    
    /*Color coded header styling*/
    .happiness {
      border: 2px solid #ede35f;
    }
    .happiness_header {
      border-bottom: 1px solid #ede35f;
      background-color: #ede35f20;
      color: #ede35f;
    }
    .sadness {
      border: 2px solid #2189ff;
    }
    .sadness_header {
      border-bottom: 1px solid #2189ff;
      background-color: #2189ff20;
      color: #2189ff;
    }
    .anger {
      border: 2px solid #ef5353;
    }
    .anger_header {
      border-bottom: 1px solid #ef5353;
      background-color: #ef535320;
      color: #ef5353;
    }
    .fear {
      border: 2px solid #57cd57;
    }
    .fear_header {
      border-bottom: 1px solid #57cd57;
      background-color: #57cd5720;
      color: #57cd57;
    }
    .surprise {
      border: 2px solid #ea59ed;
    }
    .surprise_header {
      border-bottom: 1px solid #ea59ed;
      background-color: #ea59ed20;
      color: #ea59ed;
    }
    `;
    this.shadowRoot.appendChild(style);
  }

  /** Fill out the innerHTML of the article element under the shadowRoot with the data passed in
   *
   * @param {Object} data
   * @param {Number} data."id" - ID of the post
   * @param {String} data."label" - Label of the post
   * @param {String} data."text" - Actual text content of the post
   * @param {String} data."dateCreated" - MM/DD/YYYY formated date of the post's creation
   * @param {String} data."dateModified" - MM/DD/YYYY formatted date of the post's last modification
   *
   * @TODO add popups to event listeners
   */
  set data(data) {
    let mod_date = data["dateModified"];
    if (!mod_date) {
      mod_date = "Never";
    }
    let article = this.shadowRoot.getElementById("post-article");
    article.classList.add(`${data["label"].toLowerCase()}`);
    article.innerHTML = `
    <div class="post_header ${data["label"].toLowerCase()}_header">
      <div class="post_label">${data["label"]}</div>
      <div class="post_buttons">
        <button id="edit_button" class="post_edit">Edit</button>
        <button id="delete_button" class="post_delete">Delete</button>
      </div>
    </div>
    <p class="post_text">${data["text"]}</p>
    <div class="post_meta">
      <div class="create_date">Date Created: ${data["dateCreated"]}</div>
      <div class="update_date">Last Updated: ${mod_date}</div>
    </div>
    `;

    //add delete event listener
    //TODO when integrating the above innerHTML with the outline provided by the frontend team, make sure
    //     to update the getElementById to refer to whatever they named the delete and edit buttons
    let del_button = this.shadowRoot.getElementById("delete_button");
    del_button.addEventListener("click", () => {
      // popup appear
      create_popup({ title: "Delete", id: data["id"] });
    });

    let edit_button = this.shadowRoot.getElementById("edit_button");
    edit_button.addEventListener("click", () => {
      create_popup({ title: "Edit", id: data["id"], text: data["text"], label: data["label"] });
      /*
      let main = document.querySelector("main");

      //select the popup
      let popup = document.createElement("edit-popup");
      //let the edit popup appear
      main.appendChild(popup);

      //shadowroot of edit popup
      var shadow = popup.shadowRoot;

      //select the options of emote
      var select = shadow.querySelector("select");

      //select the textbox
      var textBox = shadow.querySelector("textarea");

      //the current value of emote
      select.value = data["label"];

      //the current value of textContent in the textbox
      textBox.value = data["text"];
      var textContent = textBox.value;
      var emote = select.value;
      var cancel_but = shadow.querySelector("#cancel");
      var update_but = shadow.querySelector("#update");

      //update the label
      select.addEventListener("change", () => {
        emote = select.value;
      });

      //update the text
      textBox.addEventListener("change", () => {
        textContent = textBox.value;
      });

      //advance the change and close the popup if update button is clicked
      update_but.addEventListener("click", () => {
        edit_post(data["id"], {
          label: emote,
          text: textContent,
        });
        main.removeChild(main.lastChild);
      });

      //do nothing if cancel button is clicked
      cancel_but.addEventListener("click", () => {
        main.lastChild.style.display = "none";
        create_popup({ title: "Cancel Edit", id: data["id"] });
      });
      */
    });
  }
}
customElements.define("journal-post", JournalPost);

// Define variables needed for this file
const post_key = "post_array";
const post_id_key = "NEXT_POST_ID";

var post_container;
//runs the init function upon page being fully loaded
window.addEventListener("DOMContentLoaded", init);

/**
 * Called on page load,
 * initalizes variables for this file, and loads the current posts
 *
 * Code can be added here to test the functionality of the script
 */
function init() {
  post_container = document.getElementsByClassName("posts")[0];

  //add event listeners to filter buttons
  var labels = document.getElementsByClassName("filterby_label");
  for (var i = 0; i < labels.length; i++) {
    let value = labels[i].value;
    let label = labels[i];
    label.addEventListener("click", () => {
      let posts = filter_posts(value);
      display_posts(posts);
      select_label(labels, value);
    });
  }

  document.getElementById("dateSubmit").addEventListener("click", () => {
    let a = document.getElementById("dateFrom").value;
    let b = document.getElementById("dateTo").value;

    let dateA = dateComp.validateDate(a);
    let dateB = dateComp.validateDate(b);

    if (dateA == null || dateB == null) {
      //open warning dialogconst warningDialog = this.shadowRoot.querySelector("#delete_button");
      myDialog.fill(
        "Date Must Exist and Be In the Format: MM-DD-YYYY",
        false,
        false
      );
      const noButtonEl = document.querySelector("#no-button");
      noButtonEl.addEventListener("click", function denyAction() {
        myDialog.closeDialog();
      });
      return;
    }

    if (dateComp.isEqualTo(dateB, dateA) || dateComp.isLessThan(dateB, dateA)) {
      myDialog.fill("Please enter a valid date range", false, false);
      const noButtonEl = document.querySelector("#no-button");
      noButtonEl.addEventListener("click", function denyAction() {
        myDialog.closeDialog();
      });
      return;
    }

    let posts = filter_post_array_by_date(dateA, dateB);
    display_posts(posts);
  });

  document.getElementById("dateReset").addEventListener("click", () => {
    document.getElementById("dateFrom").value = "";
    document.getElementById("dateTo").value = "";
    let posts = filter_posts("Reset");
    display_posts(posts);
  });

  document.getElementById("create_button").addEventListener("click", () => {
    // check popup for create
    // receive label, text, date from popup
    create_popup({ title: "Add", id: get_new_post_id(), label: "" });
  });

  refresh_posts();
  //VvV TESTING VvV
}

/**
 * Gets only posts of a specified label on the page.
 * Call with label = "Reset" to show all posts.
 *
 * @param {String} [label = "Reset"] - label to filter by
 * @return {Object[]} - lists of posts with the specified label
 */
function filter_posts(label = "Reset") {
  let post_array = load_posts();
  if (label == "Reset") {
    return post_array;
  }
  let output = [];
  for (var i in post_array) {
    let post = post_array[i];
    if (post["label"] == label) {
      output.push(post);
    }
  }
  return output;
}

/**
 * Gets only posts within a given date range
 *
 * @param {String} [label = "Reset"] - label to filter by
 * @return {Object[]} - lists of posts within the specified date range
 */
function filter_post_array_by_date(from, to) {
  let posts = load_posts();
  let filtered_posts = [];
  for (var i in posts) {
    let dateCreated = posts[i]["dateCreated"];
    dateCreated = dateComp.validateDate(dateCreated);
    if (dateCreated == null) {
      console.error("Invalid Date found within post object, skipping for now");
      continue;
    }
    if (
      dateComp.isLessThanEqualTo(dateCreated, to) &&
      dateComp.isGreaterThanEqualTo(dateCreated, from)
    ) {
      filtered_posts.push(posts[i]);
    }
  }
  return filtered_posts;
}

/**
 * Indicates which label filter is selected.
 *
 * @param {Object[]} [labels] - array of labels
 * @param {String} [value] - label to filter by
 */
function select_label(labels, value) {
  for (var i = 0; i < labels.length; i++) {
    if (labels[i].value == value) {
      labels[i].classList.add("selected");
    } else {
      labels[i].classList.remove("selected");
    }
  }
}

/**
 * Refreshes display of posts to match what is currently in storage
 */
function refresh_posts() {
  //load the post array from storage
  let post_array = JSON.parse(window.localStorage.getItem(post_key));
  display_posts(post_array);
}

/**
 * Helper function to display posts on the page.
 * Used by refresh_posts and filter_posts to display the loaded posts
 *
 * @param {Object[]} post_array - array of posts to display on the page
 */
function display_posts(post_array) {
  //remove all current posts from post_container
  let curr_child = post_container.firstChild;
  while (curr_child) {
    post_container.removeChild(curr_child);
    curr_child = post_container.firstChild;
  }

  //quit early if postArray object is not found
  if (!post_array) {
    console.log("error, post array not found");
    return;
  }

  //append all newly loaded post objects to post_container
  for (let post_index in post_array) {
    //create new post element
    let post = document.createElement("journal-post");
    post.data = post_array[post_index];
    post_container.appendChild(post);
  }
}

/** '
 * loads the current posts from storage and appends them to their post_container
 *
 *  @return {Object[]|null} Post Array object from local storage or null if missing
 */
function load_posts() {
  let posts = JSON.parse(window.localStorage.getItem(post_key));
  if (!posts) {
    return [];
  } else {
    return posts;
  }
}

/**
 * Stores a new array of posts for the current user
 *
 *  @param {Object[]} posts - array of post object to store
 */
function store_posts(posts) {
  window.localStorage.setItem(post_key, JSON.stringify(posts));
}

/**
 *  Creates a new post object and adds it to the array in local storage.
 *
 *  @param {Object} data - data to create post object from
 *  @param {String} data."label" - label of new post
 *  @param {String} data."text" - text content of new post
 */
export function create_post(post_id, data) {
  let posts = load_posts();
  //
  const date = new Date();
  let post_data = {
    id: post_id,
    dateCreated: `${
      date.getMonth() + 1
    }-${date.getDate()}-${date.getFullYear()}`,
    dateModified: null,
    label: data["label"],
    text: data["text"],
  };
  posts.push(post_data);
  store_posts(posts);
  refresh_posts();
}

/**
 * Removes a post from the post array in local storage
 *
 *  @param {Integer} post_id - id of post to delete
 */
export function delete_post(post_id) {
  //get current posts
  let posts = load_posts();

  //add all posts that do not match id to a new updated post array
  let updated_post_array = [];
  for (let index in posts) {
    if (posts[index]["id"] == post_id) {
      continue;
    } else {
      updated_post_array.push(posts[index]);
    }
  }

  store_posts(updated_post_array);
  refresh_posts();
}

// /**
//  * Deletes All Posts under the current user
//  *
//  */
// function delete_all_posts() {
//   //store empty array as new array of posts
//   store_posts([]);
//   //reset post ids
//   window.localStorage.setItem(post_id_key, "0");
// }

/**
 * Updates the data of a post object
 * @param {Integer} post_id - id of post to update
 * @param {Object} data - new data to add to post
 * @param {String} data."label" - label of edited post
 * @param {String} data."text"  - text content of edited post
 */
export function edit_post(post_id, data) {
  //get posts from storage
  let posts = load_posts();
  const date = new Date();
  //iterate through posts, looking for post to edit:
  for (let index in posts) {
    let curr_post = posts[index];
    if (curr_post["id"] == post_id) {
      //found correct post:
      //update label, text, and dateModified
      posts[index]["label"] = data["label"];
      posts[index]["text"] = data["text"];
      posts[index]["dateModified"] = `${
        date.getMonth() + 1
      }-${date.getDate()}-${date.getFullYear()}`;
    }
  }

  store_posts(posts);
  refresh_posts();
}

/**
 * Pulls the next post_id from storage, pushing post_id + 1 back into storage
 *
 * @return {Integer} id to use when creating a new post
 */
function get_new_post_id() {
  let id_from_storage = window.localStorage.getItem(post_id_key);
  if (!id_from_storage) {
    window.localStorage.setItem(post_id_key, "1");
    return 0;
  } else {
    let id = parseInt(id_from_storage, 10);
    let new_id = id + 1;
    window.localStorage.setItem(post_id_key, new_id);
    return id;
  }
}
