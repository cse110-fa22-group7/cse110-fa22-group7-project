# Create and Store posts

## Create Posts:

post object should be a custom web-component


## Storage:

cookies : 10kb
Sessions Storage : 5mb
Local Storage : 10mb

Stores key value pairs

all keys and all values must be strings

let posts = [] of posts
value = JSON.stringify(posts)
key = "postList"
window.localStorage.setItem(key, value)
window.localStorage.getItem(key) -> value

JSON.parse(value) -> original array object


## Multiple Users:

setItem(username, password)
getItem(username) -> password
match given password with stored password

key for users posts: username+"postList"

Ahn Load / Create
Yaosen Set Data
Hongkun deletePost
Jake editPost
Neal make sure everything we did works 
