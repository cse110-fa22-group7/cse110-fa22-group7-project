# cse110-fa22-group7-project

[View Project Here](https://cse110-fa22-group7.github.io/cse110-fa22-group7-project/source/main.html)

[meet the team](admin/team.md)
## What is MyJournal?
MyJournal is a personalalized social media app where the users can post for themselves. The purpose of MyJournal is to allow users to truly express themselves without having to worry about what others think. MyJournal is just like a social media where a user can post how they're feeling and any text; the difference is that there are no friends, no seeing each other's posts, and the user's posts are only visible to themselves.  

To make MyJournal more personalized users create their own posts which each have an emotion associated with them. The user is then able to view just posts from a certain emotion or all posts at once. The user can also view posts from a certain date. 
## Dev Instructions

### 1. Branch from main

Make sure when working on a new feature for the project you pull from the main branch so that you have all of the up to date source code, and save your new work in a new branch for the feature or bug fix.

### 2. Install Dependencies

The CICD Pipeline for this project relies on several tools which can be downloaded through Node

First Install Node from [NodeJS.org](https://nodejs.org/en/download/)
then run the command below inside of your working directory
```
npm install
```

### 2. Check your code before submitting a pull request

Rita has included a couple scripts in the package.json file to help you lint your code before submitting.  
```
npm run eslint-fix
npm run prettier-fix
```

Any HTML and CSS code should also be validated before submitting
```
npx html-validate --ext html ./source
```
And the JSDoc should be built from any updated javascript.  We are looking into performing the JSDoc creation automatically from workflow which runs on merging into main however for now it still needs to be done manually.
```
npx jsdoc -r ./source -d ./docs
```
Finally any test cases should be checked (we haven't built any tests yet)
```
npm run test
```

### 3. Create a pull request and request a review

Create a pull request to merge your branch back into main and request a review from someone else on the team.  If the reviewer approves and the github action passes all the tests you are good to merge and delete!

