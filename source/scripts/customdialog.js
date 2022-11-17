// javascript module for customdialogs

export function fill(message, isYesButton, isTextField) {
    const templateEl = document.querySelector('#dialog-template');
    const dialogEl = templateEl.content.cloneNode(true);
    // print out message to show
    const messageEl = dialogEl.querySelector('form > p')
    messageEl.textContent = message;
    messageEl["style"] = 'color: black; text-align: center; font: 2rem bold large;';

    // dialog appear
    (document.getElementById('output')).appendChild(dialogEl);

    let yesButton = document.querySelector('#yes-button');
    let textField = document.querySelector('#prompt-message');
    yesButton.style.display =(isYesButton)? '': yesButton.style.display = 'none'; 
    textField.style.display = (isTextField)? '' :'none';
    // rendering to the screen
    displayDialog(message)
    return dialogEl;
}

// closing the dialog
export function closeDialog() {
    let dialog = document.querySelector('#output > #warning-dialog');
    dialog.close();
}


export function displayDialog(message) {
    let dialogEl = document.querySelector('#output > #warning-dialog');
    dialogEl.showModal(message);
}