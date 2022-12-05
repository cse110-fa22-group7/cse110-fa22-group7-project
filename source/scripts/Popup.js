/**Popup.js contains the Popup class defining the HTML element popup-dialog
 * as well as methods for interfacing with buttons.
 *
 */

import { create_post, edit_post, delete_post } from "./JournalPost.js";
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
    popupDialog.id = "popup";
    this.shadowRoot.appendChild(popupDialog);
    var popup_style_text = `
      .popup {
        background-color: #202020;
        border-radius: 30px;
        text-align: center;
        width:60%;
        height: 30rem;
        left: 15rem;
        top: 10%;
      }
      h1 {
        font-family: "Inter";
        font-style: normal;
        font-weight: 400;
        font-size: 3rem;
        line-height: 1rem;
        color: #ffffff;
        display: flex;
        justify-content: center;
      }
      textarea {
        background: transparent;
        width: 99%;
        height: 19rem;
        color: white;
        resize: none;
        font-size: 1.5rem;
        font-family: "Inter";
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
        height: 2.5rem;
        background: transparent;
        color: white;
        border-color: white;
        font-family: "Inter";
        font-style: normal;
        font-weight: 400;
        font-size: 2rem;
        color: white;
        cursor: pointer;
      }
      select option {
        color: black;
      }
      button {
        width: 8rem;
        height: 2.5rem;
        background: transparent;
        border-radius: 30px;
        border-color: white;
        font-family: "Inter";
        font-style: normal;
        font-weight: 400;
        font-size: 2rem;
        color: white;
        cursor: pointer;
      }
      p
      {
        color: white;
      }
      button:hover{
        background-color:grey;
      }
        `;
    let style = document.createElement("style");
    // style for Create and Edit popups
    style.innerText = popup_style_text;
    this.shadowRoot.appendChild(style);
  }

  /** Fill out the innerHTML of the popup element under the shadowRoot with the data passed in
   *
   *
   *  should be of the format {
   *  @param {Object} data             The popup data
   *  @param {Number} data.popup_id    The popup id
   *  @param {String} data.popup_title The popup's title: "Add" / "Edit" / "Delete"
   *  @param {String} data.popup_text  The popup's content
   *  @param {String} data.popup_label The popup's emotional indicator: "Choose a Label" / "Happy" / "Angry" / ...
   *
   * }
   */
  set data(data) {
    let popup = this.shadowRoot.querySelector("#popup");
    let button_approval = data.popup_title;

    let textContent = data.popup_text;
    if (textContent == undefined || textContent == null) {
      textContent = "";
    }

    popup.className = "popup";
    popup.innerHTML = `
        <h1>${data["popup_title"]} Post</h1>
        <hr />
        <form>
          <textarea placeholder="What would you like to say?">${textContent}</textarea>
          <hr />
          <div class="label_and_button">
            <select name="label" required>
              <option value="" disabled selected hidden>
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

    //set default label:
    if (data.popup_label != "") {
      let option = popup.querySelector(`option[value=${data.popup_label}]`);
      if (option) option.selected = true;
    }

    // Delete popup fill in and style
    if (data.popup_title == "Delete") {
      popup.innerHTML = `
            <h1>${data["popup_title"]} Post?</h1>
            <hr />
            <form method="dialog" id="${data["popup_id"]}">
            <p>warning: The deleted content cannot be retrieved.</p>
            <input type="text" style="display: none" id="prompt-message" />
            <div>
              <button id="no-button" value="no" type="cancel">Cancel</button>
              <button id="yes-button" value="default" >
                Confirm
              </button>
            </div>
          </form>
            `;
    }

    if (data.popup_title == "Cancel Create") {
      //cancel popup for the create popup
      popup.innerHTML = `
              <h1>${data["popup_title"]} Post?</h1>
              <hr />
              <form method="dialog" id="${data["popup_id"]}">
              <p>warning: Are you sure you want to cancel? No new post will be created.</p>
              <input type="text" style="display: none" id="prompt-message" />
              <div>
                <button id="no-button" value="no" type="cancel">Cancel</button>
                <button id="yes-button" value="default" >
                  Confirm
                </button>
              </div>
            </form>
              `;
    }

    if (data.popup_title == "Cancel Edit") {
      //cancel popup for the edit popup
      popup.innerHTML = `
              <h1>${data["popup_title"]} Post</h1>
              <hr />
              <form method="dialog" id="${data["popup_id"]}">
              <p>warning: Are you sure you want to cancel? This post will not be edited.</p>
              <input type="text" style="display: none" id="prompt-message" />
              <div>
                <button id="no-button" value="no" type="cancel">Cancel</button>
                <button id="yes-button" value="default" >
                  Confirm
                </button>
              </div>
            </form>
              `;
    }
    // add yes buttoon event listener
    let yes_button = this.shadowRoot.querySelector("#yes-button");
    yes_button.addEventListener("click", () => {
      if (data["popup_title"] == "Delete") {
        // if a delete popup go head and delete post
        delete_post(data["popup_id"]);
      } else if (data["popup_title"] == "Cancel Create") {
        // if a cancel create post popup just close popup
        this.closeDialog();
      } else if (data["popup_title"] == "Cancel Edit") {
        // if a cancel create edit popup closee popup and remove last child from main (would be the edit popup element)
        this.closeDialog();
      } else {
        //for add and edit, carry out correponding functionality in backend
        const formEl = yes_button.parentElement.parentElement;
        const select = formEl.querySelector("select");
        const textBox = formEl.querySelector("textarea");
        let emote = select.value;
        if (emote == "") {
          return;
        }
        textContent = textBox.value;
        if (data["popup_title"] == "Add")
          create_post(data["popup_id"], { label: emote, text: textContent });
        if (data["popup_title"] == "Edit")
          edit_post(data["popup_id"], { label: emote, text: textContent });
      }
      this.closeDialog(); //after all action, popup should close
    });
    // add no button (cancel button) event listen
    let no_button = this.shadowRoot.querySelector("#no-button");
    no_button.addEventListener("click", (ev) => {
      //Prevent page refresh:
      ev.preventDefault();

      //Stash popup data:
      let textBox = this.shadowRoot.querySelector("textarea");
      if (textBox) {
        data["popup_text"] = textBox.value;
      }
      let labelSelect = this.shadowRoot.querySelector("select");
      if (labelSelect) {
        data["popup_label"] = labelSelect.value;
      }
      let old_data = {
        id: data["popup_id"],
        label: data["popup_label"],
        text: data["popup_text"],
        title: data["popup_title"],
      };

      //close popup:
      this.closeDialog();
      //Handle Event based on popup_title:
      switch (data["popup_title"]) {
        case "Add":
          // if an add popup, close popup and open new Cancel Create popup
          create_popup({
            title: "Cancel Create",
            id: old_data["id"],
            label: old_data["label"],
            text: old_data["text"],
          });
          break;
        case "Edit":
          // edit popup implemented differently in JournalPost.js so dont think this else if statemnt is used
          create_popup({
            title: "Cancel Edit",
            id: old_data["id"],
            label: old_data["label"],
            text: old_data["text"],
          });
          break;
        case "Cancel Create":
          //if a Cancel Create popup, close popup and open new add popup is displayed
          create_popup({
            title: "Add",
            id: old_data["id"],
            text: old_data["text"],
            label: old_data["label"],
          });
          break;
        case "Cancel Edit":
          // is a Cancel Edit popup, close popup show the edit popup
          create_popup({
            title: "Edit",
            id: old_data["id"],
            text: old_data["text"],
            label: old_data["label"],
          });
          break;
      }
    });
  }

  displayDialog() {
    let dialogEl = this.shadowRoot.querySelector("dialog");
    dialogEl.showModal();
    dialogEl.addEventListener("cancel", (event) => {
      event.preventDefault();
    });
    // blur posts
    const posts_container = document.querySelector("div.posts");
    posts_container.style.filter = "blur(.25rem)";
  }
  closeDialog() {
    let dialogEl = this.shadowRoot.querySelector("dialog");
    dialogEl.close();

    //remove all dialog elements
    const output = document.querySelector("#output");
    let firstChild = output.firstChild;
    while (firstChild != null) {
      firstChild.remove();
      firstChild = output.firstChild;
    }
    // un blur posts
    const posts_container = document.querySelector("div.posts");
    posts_container.style.filter = "none";
  }
}
customElements.define("popup-dialog", Popup);

export function create_popup(data) {
  let popup_data = {
    popup_title: data.title,
    popup_id: data.id,
    popup_text: data.text,
    popup_label: data.label,
  };
  const output = document.querySelector("#output");
  const popup = document.createElement("popup-dialog");
  popup.data = popup_data;
  output.appendChild(popup);
  popup.displayDialog();
}
