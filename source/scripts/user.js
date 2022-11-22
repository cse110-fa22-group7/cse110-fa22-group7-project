/**
 * Author: Yaosen Zhang
 * This file contains functions to create a user account, store the user account to local storage,
 * login to a user account that help manipulate the account system. A User class might not be needed
 * to create a general object for a user to be stored in local storage.
 * -------------------------------------
 * Some stretch goals:
 * - delete an account and delete all the posts on that account (?)
 * - retype password to confirm when creating an account
 * - "Forgot password" option in login page
 * - when someone enters the page containg the domain of our app, redirect to login page if not logged in
 */

// constants
const APP_MAIN_URL = "main.html"; // "some_url_for_the_main_app_page";
const CREATE_ACCOUNT_URL = "some_url_for_user_to_create_account";
const LOGIN_URL = "some_url_for_user_to_login_in";
const USER = "user"
const USER_ARRAY = "user_array"


window.addEventListener('DOMContentLoaded', init);
// Starts the program, all function calls trace back here
function init() {
  // Get the user array from localStorage
  get_users_from_storage();
  // Add the event listeners to the form elements
  form_handler();
}


/**
 * Get the users from local storage as an array of user objects, abandoned
 */

function get_users_from_storage() {
    if (!localStorage.getItem(USER_ARRAY)) {
        let empty_array = [];
        return empty_array;
    }
    return JSON.parse(localStorage.getItem(USER_ARRAY));
}


/**
 * Takes in an array of users, converts it to a string, and then
 * saves that string to 'users' in localStorage, abandoned
 */

function save_users_to_storage(users) {
    let users_string = JSON.stringify(users);
    localStorage.setItem(USER_ARRAY, users_string);
}


/**
 * Event handler to <form> of create_account class in create_account.html
 */
function create_account_form_handler() {
    console.log('begin');
    let user_info = document.querySelector('.create_account');
    // console.log(user_info);
    // console.log(user_info.classList.contains('create_account'));
    let form_data = new FormData(user_info); // form data from user input
    
    let submit_button = document.querySelector('.create_and_submit_account');
    submit_button.addEventListener('click', create_account);

    function create_account(event) {
        event.preventDefault();
        // first check if an account associated with the username exists
        if (localStorage.getItem(username) != null) {
            alert('User already exists!')
            console.log('Fail to create a new account');

            // redirect to login page
            location.reload();
            return;
        }
        // create a new user object  
        let user_object = new Object();   
        let users_array = get_users_from_storage();
        console.log(users_array)
        let length = users_array.length

        user_object.username = length + "/" + form_data.username;
        user_object.password = form_data.password; // store users as "id/username"
        console.log(user_object);

        // add the user object to local storage
        users_array.push(user_object);
        console.log(users_array);
        save_users_to_storage(users_array);
        
        // after creating a new account, redirect to the new account's homepage
        //user_homepage_url = `${APP_URL}`; // should be something like `${APP_URL}/${user_object['username']}`
        //location.replace(user_homepage_url); // alternate: window.location.href = user_homepage_url;
    }
}

/**
 * Event handler to <form> of login_account class in login_account.html
 */
function login_form_handler(event) {
    event.preventDefault();
    let user_info = document.querySelector('.login_account'); // need to be created in some login.html
    // console.log(user_info);
    let form_data = new FormData(user_info);

    let username = form_data.username;
    let users_array = get_users_from_storage();
    let len = users_array.length;
    let idx = ""
    for (let i = 0; i < len; i++) {
        if (username.substring(i, i+1) == "/") {
            break
        }
        idx += username.substring(i, i+1);
    }
    idx = parseInt(idx);

    let password = form_data.password;
    
    let submit_button = document.querySelector('.login_account_button'); // need to be created in some login.html
    submit_button.addEventListener('click', login_account);

    function login_account(event) {
        event.preventDefault() // prevent the form from auto-submitting when refreshing page
        // first check if an account associated with the username exists
        try {
            localStorage.getItem(users_array[idx]);
        } catch(e) {
            alert('User does not exist!');
            console.log('Fail to login to an account');
            // refresh the login page
            location.replace(LOGIN_URL);
            return;
        }
        if (localStorage.getItem(users_array[idx]) != password) {
            alert('Passowrd is incorret!');
            console.log('Fail to login to an account');
            // not refresh page to keep the username entry filled
        } else {
            alert('Successfully logged in!')
            user_homepage_url = `${APP_URL}`; // /${user_object['username']}`;
            location.replace(user_homepage_url)
        }
    }
}

/**
 * Event handler to both forms by make a choice between the two forms
 */
function form_handler() {
    let user_info = document.querySelector('form');
    console.log(user_info)
    if (user_info.classList.contains('create_account')) {
        return create_account_form_handler;
    } else {
        return login_form_handler;
    }
}
