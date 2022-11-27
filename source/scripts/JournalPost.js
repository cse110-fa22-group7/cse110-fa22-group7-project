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

/** Post Class for custom web-component post
 *
 */
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
      border: 1px solid rgb(87, 87, 87);
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
      border: solid white;
      padding: 0.25rem 0.75rem;
      height: 100%;
      width: 100%;
      font-size: 0.75rem;
      font-weight: 600;
      transition: 0.2s;
    }
    .post_edit:hover {
      color: #3191ff;
      border: solid #3191ff;
    }
    .post_delete:hover {
      color: rgb(227, 45, 45);
      border: solid rgb(227, 45, 45);
    }
  
    /*Styles footer*/
    .post_meta {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.5rem;
      border-bottom: 1px solid rgb(87, 87, 87);
      border-left: 1px solid rgb(87, 87, 87);
      border-right: 1px solid rgb(87, 87, 87);
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
      border-left: 1px solid rgb(87, 87, 87);
      border-right: 1px solid rgb(87, 87, 87);
      border-bottom: 1px solid rgb(87, 87, 87);
      font-size: 1rem;
      line-height: 1.5rem;
      padding: 1rem;
      white-space: pre-line
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
    article.innerHTML = `
    <div class="post_header">
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

    //setup delete popup
    const warningDialog = this.shadowRoot.querySelector("#delete_button");
    warningDialog.addEventListener("click", function openWarning() {
      myDialog.fill("Are you sure?", true, false);
      const okButtonEl = document.querySelector("#yes-button");
      const noButtonEl = document.querySelector("#no-button");
      noButtonEl.addEventListener("click", function denyAction() {
        myDialog.closeDialog(warningDialog);
      });
      okButtonEl.addEventListener("click", function confirmAction() {
        myDialog.closeDialog(warningDialog);
        delete_post(data["id"]);
      });
    });

    //add edit event listener
    let edit_button = this.shadowRoot.getElementById("edit_button");
    edit_button.addEventListener("click", () => {
      //select the popup
      let popup = document.querySelector(".edit_popup");
      popup.style.visibility = "visible";

      //select the options of emote
      var select = document.querySelector("select");

      //select the textbox
      var textBox = document.querySelector("textarea");

      //the current value of emote
      select.value = data["label"];

      //the current value of textContent in the textbox
      textBox.value = data["text"];
      var textContent = textBox.value;
      var emote = select.value;
      var cancel_but = document.querySelector("#cancel");
      var update_but = document.querySelector("#update");

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
        console.log("This is update");
        edit_post(data["id"], {
          label: emote,
          text: textContent,
        });
        popup.style.visibility = "hidden";
      });

      //do nothing if cancel button is clicked
      cancel_but.addEventListener("click", () => {
        popup.style.visibility = "hidden";
      });
    });
  }
}
customElements.define("journal-post", JournalPost);

// Define variables needed for this file
const post_key = "_post_array";
const post_id_key = "NEXT_POST_ID";

var post_container;
var curr_user = "";
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
      filter_posts(value);
    });
  }

  refresh_posts();

  document.getElementById("create_button").addEventListener("click", () => {
    let num = Math.random();
    console.log(num);
    let label = "Happiness";
    if (num <= 0.2) {
      label = "Anger";
    } else if (num <= 0.4) {
      label = "Sadness";
    } else if (num <= 0.6) {
      label = "Fear";
    } else if (num <= 0.8) {
      label = "Surprise";
    }
    create_post({ label: label, text: "this is a test post" });
  });

  //VvV TESTING VvV
}

/**
 * Displays on the posts of a specified label on the page.
 * Call with label = "Reset" to show all posts.
 *
 * @param {String} [label = "Reset"] - label to filter by
 */
function filter_posts(label = "Reset") {
  if (label == "Reset") {
    refresh_posts();
    return;
  }
  let post_array = load_posts();
  let output = [];
  for (var i in post_array) {
    let post = post_array[i];
    if (post["label"] == label) {
      output.push(post);
    }
  }
  display_posts(output);
}
/**
 * Refreshes display of posts to match what is currently in storage
 */
function refresh_posts() {
  //load the post array from storage
  let post_array = JSON.parse(
    window.localStorage.getItem(curr_user + post_key)
  );
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
  let posts = JSON.parse(window.localStorage.getItem(curr_user + post_key));
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
  window.localStorage.setItem(curr_user + post_key, JSON.stringify(posts));
}

/**
 *  Creates a new post object and adds it to the array in local storage.
 *
 *  @param {Object} data - data to create post object from
 *  @param {String} data."label" - label of new post
 *  @param {String} data."text" - text content of new post
 */
function create_post(data) {
  let posts = load_posts();

  //
  const date = new Date();
  let post_data = {
    id: get_new_post_id(),
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
function delete_post(post_id) {
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

/**
 * Deletes All Posts under the current user
 *
 */
function delete_all_posts() {
  //store empty array as new array of posts
  store_posts([]);
  //reset post ids
  window.localStorage.setItem(post_id_key, "0");
}

/**
 * Updates the data of a post object
 * @param {Integer} post_id - id of post to update
 * @param {Object} data - new data to add to post
 * @param {String} data."label" - label of edited post
 * @param {String} data."text"  - text content of edited post
 */
function edit_post(post_id, data) {
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
