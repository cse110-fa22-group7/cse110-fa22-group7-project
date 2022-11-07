
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
        this.attachShadow({mode: "open"});
        
        article = document.createElement("article");
        article.id = "post-article";
        this.shadowRoot.appendChild(article)
        super();
    }



    /* Fill out the innerHTML of the article element under the shadowRoot with the data passed in
     * 
     * 
     * @param data should be of the format {
     *      label :
     *      text : 
     * }
     */
    set data(data){

    }
}
customElements.define("journal-post", JournalPost);