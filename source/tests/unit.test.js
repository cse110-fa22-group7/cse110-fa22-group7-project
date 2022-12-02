import * as myTest from "../scripts/JournalPost.js";
// label: data["label",
// text: data["text"]

// class

const post_key = "_post_array";
curr_user = "";

const newPost1 =  [{
    id: 43,
    text: "Test post one",
    label: "Sadness"
}];
let newPost2 = [{
    id: 44,
    text: "Test Post two",
    label: "Fear"
}];
const newPost3 = [{
    id: 45,
    text: "Test Post three",
    label: "Anger"
}];

myTest.create_post(44, newPost2);
let postData1 = JSON.parse(window.localStorage.getItem(43));

test('Was the first test post created', () => {
    expect(myTest.create_post(43, newPost1).tobe(postData1));
});
test('Was the second post created', () => {
    expect(myTest.create_post(44, newPost2).tobe(postData2));
});