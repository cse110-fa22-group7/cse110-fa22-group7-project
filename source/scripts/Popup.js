/**Popup.js contains the Popup class defining the HTML element popup-dialog
 * as well as methods for interfacing with buttons. 
 * 
 * TODO : create/edit button click => create/edit post to 
 *        create/edit button click => create/edit popup => create/edit post
 *        delete      button click => delete post => delete post
 */

class Popup extends HTMLElement {
    /**
     * sets up shadow dom
     * @TODO css for popup object
     * @constructor
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        let popupDialog = document.createElement("dialog");
        popupDialog.id = "popup"
        this.shadowRoot.appendChild(popupDialog);

        let style = document.createElement("style");

        // style for Create and Edit popups
        style.innerText = `
        .popup {
          position: absolute;
          width: 802px;
          height: 480px;
          left: 531px;
          top: 288px;
          background-color: #60686a;
          border-radius: 30px;
          text-align: center;
        }
        h1 {
          font-family: "Inter";
          font-style: normal;
          font-weight: 400;
          font-size: 64px;
          line-height: 10px;
          color: #ffffff;
          display: flex;
          justify-content: center;
        }
        textarea {
          background: transparent;
          width: 750px;
          height: 250px;
          color: white;
          resize: none;
        }
        textarea::placeholder {
          color: white;
        }
        .label_and_button {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        select {
          width: 246px;
          height: 52px;
          background: transparent;
          font-family: "Inter";
          color: white;
          border-color: white;
          font-family: "Inter";
          font-family: "Inter";
          font-style: normal;
          font-weight: 400;
          font-size: 24px;
          color: white;
        }
        button {
          width: 150px;
          height: 48px;
          background: transparent;
          border-radius: 30px;
          border-color: white;
          font-family: "Inter";
          font-style: normal;
          font-weight: 400;
          font-size: 36px;
          color: white;
        }
        `;

        this.shadowRoot.appendChild(style);
    }

    /** Fill out the innerHTML of the popup element under the shadowRoot with the data passed in
     * 
     * 
     *  @param data should be of the format {
     *         "title": "Create" / "Edit" / "Delete" / ( "Signin" / "Signout" )
     * }
     */
    set data(data) {
        let popup = this.shadowRoot.querySelector('#popup');
        let button_approval = 'Edit';
        // Create / Edit
        popup.innerHTML = `
        <h1>${data["title"]} Post</h1>
        <hr />
        <form>
          <textarea placeholder="What would you like to say?"></textarea>
          <hr />
          <div class="label_and_button">
            <select>
              <option value="Choose a label">
                <label>Choose a label</label>
              </option>
              <option value="Happiness">
                <label>Happiness</label>
              </option>
              <option value="Sadness">
                <label>Sadness</label>
              </option>
              <option value="Anger">
                <label>Anger</label>
              </option>
              <option value="Fear">
                <label>Fear</label>
              </option>
              <option value="Surprise">
                <label>Surprise</label>
              </option>
            </select>
            <button id="no-button" type="cancel">Cancel</button>
            <button id="yes-button" type="submit" value="${button_approval.toLowerCase()}">${button_approval}</button>
          </div>
        </form>
        `;

        // Delete popup fill in and style
        if( data.title == 'Delete' ) {
            popup.innerHTML = `
            <h1>${data["title"]} Post</h1>
            <hr />
            <form method="dialog">
            <p>Delete?</p>
            <input type="text" style="display: none" id="prompt-message" />
            <div>
              <button id="no-button" value="no" type="cancel">Cancel</button>
              <button id="yes-button" value="default" style="display: none">
                Confirm
              </button>
            </div>
          </form>
            `;
            popup.style = `
             *{
                 background-color: black;
             }
            `; // TODO: work on delete popup style
        }

        // add yes event listener
        let yes_button = this.shadowRoot.querySelector('#yes-button');
        yes_button.addEventListener('click', () => {
            answer = true; // yes button is clicked
        });
        // add no event listen 
        let no_button = this.shadowRoot.querySelector('#no-button');
        no_button.addEventListener('click', () => {
            answer = false; // no button is clicked just close the modal
        });
    }
    displayDialog(message) {
        let dialogEl = this.shadowRoot.querySelector('dialog');
        dialogEl.style = `background-color: black; color: white;`;
        dialogEl.showModal("message");
    }
}
customElements.define('popup-dialog', Popup);

export function create_popup(data) {
    let popup_data = {
        title: data.title,
    };
    const output = document.querySelector('#output');
    const popup = document.createElement('popup-dialog');
    popup.data = popup_data;
    output.appendChild(popup);
    popup.displayDialog("yoyo");
}

export var answer;
  
  // closing the dialog
  export function closeDialog() {
    let dialog = document.querySelector("#output > #warning-dialog");
    dialog.close();
  }
  

  