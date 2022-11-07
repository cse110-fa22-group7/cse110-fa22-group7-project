var container;
var currUser = "";

//runs the init function upon page being fully loaded
window.addEventListener("DomContentLoaded", init);

/*  Called on page load,
 *  initalizes variables for this file, and loads the current posts
 */
function init(){
    container = document.getElementById("posts");

    

}


/* Refreshes display of posts to match what is currently in storage
*/
function refresh_posts(){
    //load the post array from storage
    post_array = JSON.parse(window.getItem(currUser+"_post_array"))

    //remove all current posts from container
    let curr_child = container.firstChild();
    while(curr_child){
        container.removeChild(curr_child);
        curr_child = container.firstChild();
    }

    //quit early if postArray object is not found
    if(!post_array){
        console.log("error, post array not found");
        return;
    }

    //append all newly loaded post objects to container
    for(post_index in post_array){
        //create new post element
        post = document.createElement("journal-post");
        post.data = post_array[post_index];
        container.appendChild(post);
    }
}


/* loads the current posts from storage and appends them to their container
*
*  @return Post Array object from local storage
*/
function load_posts(){

}


/* Creates a new post object and adds it to the array
*  in local storage
*/
function create_post(data){


}

/*  Removes a post from the post array in local storage
 * 
 */
function delete_post(post_id){

}

/* Updates the data of a post object
 * @param post - object to update
 * @param data - new data to use of the format {
 *      label :
 *      text :
 * }
 */
function edit_post(post_id, data){

}

