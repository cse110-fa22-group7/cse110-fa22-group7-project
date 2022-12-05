import * as myTest from "../scripts/JournalPost.js";
// label: data["label",
// text: data["text"]

// class
//practice test 
//use mockReturnValue to mimic a function's return value
//I don't think this would work because there is no return 
//value to be mocked but rather actions to be run
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  };
  
test("Add two numbers", () => {
    const sum = 5+7;
    const expected = 12;
    expect(sum).toBe(expected);
});
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
const newPost4 = [{
    id: 46,
    text: "Test Post four",
    label: "Fear"
}];

myTest.create_post(44, newPost2);
//need to mock: create_post(post_id, data)
//create_post(42, newPost4) = jest.fn()
//load_posts() = jest.fn(); or
//fn() to define the mock function's behavior and return value
load_posts.fn().mockImplementation(() => {
    return;
})
store_posts(posts) = jest.fn();
store_posts.fn().mockImplementation(() => {
    return;
})
let postData1 = JSON.parse(window.localStorage.getItem(43));

test('Was the first test post created', () => {
    expect(myTest.create_post(43, newPost1).tobe(postData1));
});
test('Was the second post created', () => {
    expect(myTest.create_post(44, newPost2).tobe(postData2));
});

//myTest.refresh_posts()
//myTest.display_posts(post_array);
//
let posts = JSON.parse(window.localStorage.getItem(curr_user + post_key));
test('Check if posts were correctly loaded')
{
    expect(myTest.load_posts().tobe(postData3));
}

//myTest.delete_post(44)
test('Check if Test Post 3 was correctly deleted')
{
    expect(myTest.delete_post(44).tobe(44));
}
test('Check if Test Post 2 was correctly deleted')
{
    expect(myTest.delete_post(43).tobe(43));
}

test('Check if Test Post 2 was correctly edited')
{
    expect(myTest.edit_post(43, newPost2).tobe(43));
}
test('Check if Test Post 3 was correctly edited')
{
    expect(myTest.edit_post(44, newPost2).tobe(44));
}

import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});


  global.localStorage = localStorageMock;

  it('puts the chili in the fridge when the fridge is empty', () => {
    // just make some dummy functions, where the getter returns undefined
    const getFromStorage = jest.fn().mockReturnValueOnce(undefined)
    // then, make a mock storage object to check
    // whether the chili was put in the fridge
    let mockStorage
    const setInStorage = jest.fn((value) => { mockStorage = value })
    
      saveForLater('chili', { getFromStorage, setInStorage })
    expect(setInStorage).toHaveBeenCalledOnce()
    expect(mockFridge).toEqual('chili')
  })

  jest.mock('./UserStore', () => ({
    UserStore: ({
        getUser: jest.fn().mockImplementation(arg => ({
            FirstName: 'Ondrej',
            LastName: 'Polesny'
        })),
        setUser: jest.fn()
    })
}));
//
//myTest.getNewPostId()