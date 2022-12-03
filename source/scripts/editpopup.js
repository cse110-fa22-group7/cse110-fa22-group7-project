class EditPopup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    let edit_popup_holder = document.createElement("div");
    edit_popup_holder.className = "edit_popup";
    edit_popup_holder.innerHTML = `
        <div class="background"></div>
        <div class="content">
          <h1 class="popup">Edit Post</h1>
          <hr />
            <textarea placeholder="What would you like to say?"></textarea>
            <hr />
            <div class="label_and_button">
                <select>
                <option value="Choose a label" disabled>
                    <label>What are your feelings</label>
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
                <button type="button" class="popup" id="cancel">Cancel</button>
                <button type="submit" value="update" class="popup" id="update">
                Update
                </button>
            </div>
        </div>
        `;
    let style = document.createElement("style");
    style.textContent = `
        .edit_popup .content {
          position: absolute;
          width: 62.5%;
          height: 30.5rem;
          top: 27.5%;
          left: 30rem;
          background-color: #202020;
          border-radius: 30px;
          text-align: center;
          justify-content: center;
          z-index: 2;
          padding-top: 30px;
          border: 5px solid black;
        }
        hr {
          width: 95%;
        }
        h1.popup {
          font-style: normal;
          font-weight: 400;
          font-size: 3rem;
          line-height: 10px;
          color: #ffffff;
          display: flex;
          justify-content: center;
        }
        textarea {
          background: transparent;
          width: 94%;
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
          padding-left: 30px;
          padding-right: 30px;
        }
        select {
          width: 246px;
          height: 2.5rem;
          background: transparent;
          font-family: "Inter";
          color: white;
          border-color: white;
          font-weight: 400;
          font-size: 24px;
        }
        select option {
          color: black;
        }
        button.popup {
          width: 8rem;
          height: 2.5rem;
          background: transparent;
          border-radius: 30px;
          border-color: white;
          font-family: "Inter";
          font-weight: 400;
          font-size: 2rem;
          color: white;
        }
        button.popup:hover {
          background-color: grey;
        }
        .edit_popup .background {
          position: fixed;
          top: 0px;
          left: 0px;
          width: 200vw;
          height: 200vh;
          background: rgba(9, 8, 8, 0.6);
          z-index: 1;
        }
        `;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(edit_popup_holder);
  }
}

customElements.define("edit-popup", EditPopup);
