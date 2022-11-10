/* JouralPost.js contains the JournalPost class defining the HTML element journal-post
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


/*  Post Class for custom web-component post
 *  InnerHTML = 
 *       <p>id</p>
 *       <p>dateCreated</p>
 *       ?modified : <p>Modified on dateModified</p> | none
 *       <p>label</p>
 *       <p>text</p>
 * 
 *  JournalPost.data = 
 *  {
 *      id
 *      dateCreated
 *      lastModified = null
 *      label = ""
 *      text
 *  }
 * 
 */
class JournalPost extends HTMLElement{
    
    /* 
     * 
     */
    constructor(){
        super();
        this.attachShadow({mode: "open"});
        
        let article = document.createElement("article");
        article.id = "post-article";
        this.shadowRoot.appendChild(article)
    }



    /* Fill out the innerHTML of the article element under the shadowRoot with the data passed in
     * 
     * 
     * @param data should be of the format {]
     *      "id"    :
     *      "label" :
     *      "text"  :
     *      "dateCreated"  : 
     *      "dateModified" :
     * }
     */
    set data(data){
        let article = this.shadowRoot.getElementById("post-article");
        article.innerHTML = 
        `
        <p>ID = ${data["id"]}</p>
        <p>label = ${data["label"]}</p>
        <p>text = ${data["text"]}</p>
        <p>Created = ${data["dateCreated"]}</p>
        <p>Modified = ${data["dateModified"]}</p>
        `;
    }

   
}
customElements.define("journal-post", JournalPost);

// Define variables needed for this file
const post_key = "_post_arrray";
const post_id_key = "NEXT_POST_ID"


var post_container;
var curr_user = "";



//runs the init function upon page being fully loaded
window.addEventListener("DOMContentLoaded", init);

/*  Called on page load,
 *  initalizes variables for this file, and loads the current posts
 * 
 *  Code can be added here to test the functionality of the script
 */
function init(){
    post_container = document.getElementById("posts"); 

    //VvV TESTING VvV
    
}


/* Refreshes display of posts to match what is currently in storage
 * posts are loaded from storage, elements are created from the post data loaded, and they are appended to the 
 * post_container
 */
function refresh_posts(){
    //load the post array from storage
    let post_array = JSON.parse(window.localStorage.getItem(curr_user+post_key))

    //remove all current posts from post_container
    let curr_child = post_container.firstChild;
    while(curr_child){
        post_container.removeChild(curr_child);
        curr_child = post_container.firstChild;
    }

    //quit early if postArray object is not found
    if(!post_array){
        console.log("error, post array not found");
        return;
    }

    //append all newly loaded post objects to post_container
    for(let post_index in post_array){
        //create new post element
        let post = document.createElement("journal-post");
        post.data = post_array[post_index];
        post_container.appendChild(post);
    }
}


/* loads the current posts from storage and appends them to their post_container
*
*  @return Post Array object from local storage or null if missing
*/
function load_posts(){
    let posts = JSON.parse(window.localStorage.getItem(curr_user+post_key));
    if(!posts){
        return [];
    }
    else{
        return posts;
    }
}

/*  Stores a new array of posts for the current user:
 *  
 *  @param posts -> array object to store
 */
function store_posts(posts){
    window.localStorage.setItem(curr_user+post_key, JSON.stringify(posts));
}


/* Creates a new post object and adds it to the array
*  in local storage
*  @param data {
*       "label": label
*       "text" : text
*  }
*
*/
function create_post(data){
    posts = load_posts();
    let post_data = {
        "id" : get_new_post_id(),
        "dateCreated" : Date.now(),
        "dateModified": null,
        "label" : data["label"],
        "text"  : data["text"]
    };
    posts.push(post_data);
    store_posts(posts);
    refresh_posts();
}

/*  Removes a post from the post array in local storage
 * 
 *  @param post_id of post to delete
 */
function delete_post(post_id){
    //get current posts
    let posts = load_posts();

    //add all posts that do not match id to a new updated post array
    let updated_post_array = [];
    for(index in posts){
        if(posts[index].data["post_id"] == post_id){
            continue;
        }
        else{
            updated_post_array.push(posts[index]);
        }
    }

    store_posts(updated_post_array);
    refresh_posts();
}

/* Deletes All Posts under the current user
 * 
 */
function delete_all_posts(){
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
function edit_post(post_id, data){
    //get posts from storage
    let posts = load_posts();

    //iterate through posts, looking for post to edit:
    for(post_index in posts){
        let curr_post = post[post_index];
        if(curr_post["post_id"] == post_id){
            //found correct post:
            //update label, text, and dateModified
            post[post_index]["label"] = data["label"];
            post[post_index]["text"]  = data["text"];
            post[post_index]["dateModified"] = Date.now();
        }
    }

    store_posts(posts);
    refresh_posts();
}

/* Pulls the next post_id from storage and returns it, pushing post_id + 1 back into storage
 *
 */
function get_new_post_id(){
    let id_from_storage = window.localStorage.getItem(post_id_key);
    if(!id_from_storage){
        window.localStorage.setItem(post_id_key, "1");
        return 0;
    }   
    else{    
        let id = parseInt(id_from_storage, 10);
        let new_id = id + 1;
        window.localStorage.setItem(post_id_key, new_id);
        return id;
    }

}