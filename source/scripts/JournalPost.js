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
    article {
      display: grid;
      background-color: #686c6c;
      color: white;
      font-family: "Courier New", Courier, monospace;
      grid-template-rows:
        ".post_header"
        "post_text";
    }
    .post_header {
      display: flex;
      padding: 0.4rem;
      flex-direction: row;
      border-bottom: 1px solid white;
      justify-content: space-between;
    }
    .post_meta {
      padding: 0.3rem;
      display: flex;
      flex-direction: row;
    }
    .post_label {
      padding: 0.37rem 1rem;
      border: white solid;
      border-radius: 2rem;
    }
    .dates {
      display: flex;
      padding: 0.5rem;
    }
    .dates p {
      margin: 0 1rem;
    }
    .post_buttons {
      display: flex;
      flex-direction: row;
    }
    .post_buttons * {
      margin: 0 0.25rem;
      padding: 0 0.5rem;
      border-radius: 0.5rem;
      background-color: #686c6c;
      font-weight: 300;
      font-size: large;
      color: white;
      border-color: white;
    }
    .post_text {
      padding: 0.1rem 0.5rem;
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
    <span class="post_header">
      <div class="post_meta">
        <span class="post_label">${data["label"]}</span>
        <span class="dates">
          <p>Date Created:</p>
          <date class="create_date">${data["dateCreated"]}</date>
          <p>Last Updated:</p>
          <date class="update_date">${mod_date}</date>
        </span>
      </div>
      <div class="post_buttons">
        <button id="edit_button" class="post_edit">Edit</button>
        <button id="delete_button" class="post_delete">Delete</button>
      </div>
    </span>
    <p class="post_text">${data["text"]}</p>
    `;

    //add delete event listener
    let del_button = this.shadowRoot.getElementById("delete_button");
    del_button.addEventListener("click", () => {
      delete_post(data["id"]);
    });

    //add edit event listener
    let edit_button = this.shadowRoot.getElementById("edit_button");
    edit_button.addEventListener("click", () => {
      edit_post(data["id"], {
        label: "Happiness",
        text: "This is an edit test!",
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
