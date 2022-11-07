
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



    /** 
     * Fill out the innerHTML of the article element under the shadowRoot with the data passed in
     * 
     * 
     * @param {Object} data - The data to pass into the <recipe-card>, must be of the
     *                        following format:
     *                        {
     *                          "id": "string",
     *                          "label": "string",
     *                          "text": "string",
     *                          "date": "date"
     *                        }
     */
    set data(data){
        if (!data) return;

        let article = this.shadowRoot.querySelector('article');

        // a temporary template; might need one from the front-end
        article.innerHTML = `
        <p class="id">${data['id']}</p>
        <p class="label">${data['label']}</p>
        <p class="text">${data['text']}</p>
        <p class="date">${data['date']}</p>
        `;
    }
}
customElements.define("journal-post", JournalPost);