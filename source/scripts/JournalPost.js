/**JouralPost.js contains the JournalPost class defining the HTML element journal-post
 * as well as methods for interfacing with these posts, saving and loading them to local storage
 * and appending them to an element with id="posts" on the page.
 *
 * TODO : loading and saving posts is done at curr_user + post_key in local storage, curr_user is currently hardcoded as the empty string,
 *        however as we implement the login page, we will need to figure out how to keep track of the current user.
 *
 * TODO : Find a better way of handing post ids.
 *
 * TODO : Handle dates correctly, Date.now() gives milliseconds since something IDRK, we would prefer something like MM/DD/YYYY I think
 */

/** Post Class for custom web-component post
 *
 */
import * as myDialog from "./customdialog.js";
class JournalPost extends HTMLElement {
  /**
   * sets up shadow dom
   * @TODO should setup css for post object
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

  /* Fill out the innerHTML of the article element under the shadowRoot with the data passed in
   *
   *
   * @param data should be of the format {
   *      "id"    :
   *      "label" :
   *      "text"  :
   *      "dateCreated"  :
   *      "dateModified" :
   * }
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

    let edit_button = this.shadowRoot.getElementById("edit_button");
    edit_button.addEventListener("click", () => {
      //select the popup
      let popup = document.querySelector("div.edit_popup");
      popup.style.visibility = "visible";

      //select the options of emote
      var select = document.querySelector("select");

      //select the textbox
      var textBox = document.querySelector("textarea");

      //the current value of emote
      var emote = select.value;
      //other value for "choose a label"
      if (select.value == "Choose a label") {
        emote = "What are you feeling?";
      }
      //the current value of textContent in the textbox
      var textContent = textBox.value;

      var cancel_but = document.querySelector('button[type="cancel"]');
      var update_but = document.querySelector('button[type="submit"]');

      //update the label
      select.addEventListener("change", () => {
        //other value for "choose a label"
        if (select.value == "Choose a label") {
          emote = "What are you feeling?";
        } else {
          emote = select.value;
        }
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

/**Called on page load,
 * initalizes variables for this file, and loads the current posts
 *
 * Code can be added here to test the functionality of the script
 */
function init() {
  post_container = document.getElementsByClassName("posts")[0];
  refresh_posts();

  document.getElementById("create_button").addEventListener("click", () => {
    create_post({ label: "Happiness", text: "this is a test post" });
  });

  //VvV TESTING VvV
}

/**Refreshes display of posts to match what is currently in storage
 * posts are loaded from storage, elements are created from the post data loaded, and they are appended to the
 * post_container
 */
function refresh_posts() {
  //load the post array from storage
  let post_array = JSON.parse(
    window.localStorage.getItem(curr_user + post_key)
  );

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

/** loads the current posts from storage and appends them to their post_container
 *
 *  @return {Array} Post Array object from local storage or null if missing
 */
function load_posts() {
  let posts = JSON.parse(window.localStorage.getItem(curr_user + post_key));
  if (!posts) {
    return [];
  } else {
    return posts;
  }
}

/* Stores a new array of posts for the current user:
 *
 *  @param posts {Array} object to store
 */
function store_posts(posts) {
  window.localStorage.setItem(curr_user + post_key, JSON.stringify(posts));
}

/* Creates a new post object and adds it to the array
 *  in local storage
 *  @param data {
 *       "label": label
 *       "text": text
 *  }
 *
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

/*  Removes a post from the post array in local storage
 *
 *  @param post_id of post to delete
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

/** Deletes All Posts under the current user
 *
 */
function delete_all_posts() {
  //store empty array as new array of posts
  store_posts([]);
  //reset post ids
  window.localStorage.setItem(post_id_key, "0");
}

/* Updates the data of a post object
 * @param post - object to update
 * @param data - new data to use of the format {
 *      label :
 *      text :
 * }
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

/** Pulls the next post_id from storage and returns it, pushing post_id + 1 back into storage
 *
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
