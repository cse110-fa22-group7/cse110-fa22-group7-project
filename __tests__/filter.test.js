const PATH = "http://127.0.0.1:5501/source/main.html";
describe('Test Filter Functionality', () => {
    beforeAll(async () => {
      await page.goto(PATH);
    });
  
    it('Add Posts to LocalStorage', async () => {
        //click the create button 20 times to create 20 random posts
        //@todo - when the popup is implemented this test will fail as it won't be creating posts propperly
        console.log("Creating 20 Random Posts...");
        for(let i = 0; i<20; i++) {
            let button = await page.$('#create_button')
            await button.click();
        }
        let posts = await page.evaluate('window.localStorage.getItem("_post_array")');
        posts = JSON.parse(posts);
        let length = posts.length;
        expect(length).toBe(20);
    });

    it('Check that total number of posts on screen matches the number of posts in storage', async () => {
      let posts = await page.$$("journal-post");
      expect(posts.length).toBe(20);
    });

    it('Check Filter Buttons', async () => {
      let posts = await page.evaluate('window.localStorage.getItem("_post_array")');
      posts = JSON.parse(posts);
      //get total number of posts with each label:
      let post_totals = {
        "Happiness": 0,
        "Fear": 0,
        "Surpries": 0,
        "Anger": 0,
        "Sadness": 0
      };
      
      for(let i = 0; i< posts.length; i++){
        post_totals[posts[i]["label"]] += 1;
      }

      //Check each filter button
      let filterButtons = await page.$$(".filterby_label");
      for(let i = 0; i < filterButtons.length; i++){
        //click filter button
        let button = filterButtons[i];
        let label = await button.value;
        await button.click();
        //get number of posts displayed:
        let filtered_posts = await page.$$("journal-post");
        let len = filtered_posts.length;
        
        if(label == "Reset"){ 
          expect(len).toBe(20); //Reset button should display all posts
        }
        else{
          expect(len).toBe(post_totals[label]); //verify that number of posts on screen matches totals calculated from storage
        }
      }
    });

  });