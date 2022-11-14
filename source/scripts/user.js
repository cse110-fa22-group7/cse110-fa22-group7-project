/**
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

// constant urls
const APP_MAIN_URL = "some_url_for_the_main_app_page";
const CREATE_ACCOUNT_URL = "some_url_for_user_to_create_account";
const LOGIN_URL = "some_url_for_user_to_login_in";

/**
 * Class for creating User type Object, could instead just declare a general Object type without this
 */
class User extends HTMLElement() {
    constructor(){
        super();
        // to add something that needed to be displayed on html page
    }
    set data(data){
        // data that need to be visualized on html page
    }
}

// customElements.define('user-account', User); // custom element from User Object, might not be needed

/**
 * Get the users from local storage as an array of user objects
 */
function get_users_from_storage() {
    if (!localStorage.getItem('users')) {
      let empty_array = [];
      return empty_array;
    }
    return JSON.parse(localStorage.getItem('users'));
}

/**
 * Takes in an array of users, converts it to a string, and then
 * saves that string to 'users' in localStorage
 */
function save_users_to_storage(users) {
    let users_string = JSON.stringify(users);
    localStorage.setItem('users', users_string);
}

/**
 * Event handler to <form> of creating a user account
 */
function create_account_form_handler() {
    let user_object = {};
    let user_info = document.querySelector('.create_account'); // need to be created in createaccount.html
    let form_data = new FormData(user_info); // form data from user input
    let username = form_data.username.value;
    let password = form_data.password.value;
    
    let submit_button = document.querySelectorAll('button'); // type 'button' in createaccount.html
    submit_button.addEventListener('click', create_account);

    function create_account() {
        // first check if an account associated with the username exists
        if (localStorage.getItem(username) != null) {
            alert('User already exists!')
            console.log('Fail to create a new account');

            // redirect to login page
            location.replace(LOGIN_URL);
            return;
        }
        // add new user to local storage       
        user_object['username'] = form_data.username.value;
        user_object['password'] = form_data.password.value;
        let users_array = get_users_from_storage();
        users_array.push(user_object);
        save_users_to_storage(users_array);
        
        // after creating a new account, redirect to the new account's homepage
        // is this the correct way to build and go to a non-preexisting url?
        // should we request some valid url first?
        user_homepage_url = `${APP_URL}/${user_object['username']}`;
        location.replace(user_homepage_url); // alternate: window.location.href = user_homepage_url;
    }
}

/**
 * Event handler to <form> of logging into an existing user's account
 */
 function login__form_handler() {
    let user_object = {};
    let user_info = document.querySelector('.login_account'); // need to be created in some login.html
    let form_data = new FormData(user_info);
    let username = form_data.username.value;
    let password = form_data.password.value;
    
    let submit_button = document.querySelectorAll('button'); // need to be created in some login.html
    submit_button.addEventListener('click', login_account);

    function login_account() {
        // first check if an account associated with the username exists
        if (localStorage.getItem(username) == null) {
            alert('User does not exist!')
            console.log('Fail to login to an account');
            // refresh the login page
            location.replace(LOGIN_URL);
        } else if (localStorage.getItem(username) != password) {
            alert('Passowrd is incorret!');
            console.log('Fail to login to an account');
            // not refresh page to keep the username entry filled
        } else {
            alert('Successfully logged in!')
            user_homepage_url = `${APP_URL}/${user_object['username']}`;
            location.replace(user_homepage_url)
        }
    }
}
