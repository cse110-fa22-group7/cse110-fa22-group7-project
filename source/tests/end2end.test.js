const PATH = "http://localhost:9999";
describe("Test Delete Functionality", () => {
  beforeAll(async () => {
    await page.goto(PATH);
  });
  it("Add Posts to LocalStorage", async () => {
    //click the create button 20 times to create 20 random posts
    //@todo - when the popup is implemented this test will fail as it won't be creating posts propperly

    for (let i = 0; i < 5; i++) {
      let button = await page.$("#create_button");
      await button.click();
    }
    let posts = await page.evaluate(
      'window.localStorage.getItem("post_array")'
    );
    posts = JSON.parse(posts);
    let len = posts.length;
    expect(len).toBe(5);
  });

  it("Check that total number of posts on screen matches the number of posts in storage", async () => {
    let posts = await page.$$("journal-post");
    expect(posts.length).toBe(5);
  });

  it("Check that popup appears after clicking delete button", async () => {
    let journalPost = await page.$("journal-post");
    let shadow = await journalPost.getProperty("shadowRoot");
    let button = await shadow.$("#delete_button");
    await button.click();
    let popup = await page.$("#warning-dialog");
    expect(popup == null).toBe(false);
    let no = await popup.$("#no-button");
    await no.click();
    popup = await page.$("#warning-dialog");
    expect(popup).toBe(null);
  });

  it("Check that post is deleted after clicking yes on popup", async () => {
    for (let i = 0; i < 5; i++) {
      let journalPost = await page.$("journal-post");
      let shadow = await journalPost.getProperty("shadowRoot");
      let button = await shadow.$("#delete_button");
      await button.click();
      let popup = await page.$("#warning-dialog");
      let yes = await popup.$("#yes-button");
      await yes.click();
      popup = await page.$("#warning-dialog");
      expect(popup).toBe(null);
      posts = await page.$$("journal-post");
      let len = posts.length;
      expect(len).toBe(4 - i);
    }
  });

  it("Add Posts to LocalStorage", async () => {
    //click the create button 20 times to create 20 random posts
    //@todo - when the popup is implemented this test will fail as it won't be creating posts propperly
    console.log("Creating 20 Random Posts...");
    for (let i = 0; i < 20; i++) {
      let button = await page.$("#create_button");
      await button.click();
    }
    let posts = await page.evaluate(
      'window.localStorage.getItem("post_array")'
    );
    posts = JSON.parse(posts);
    let length = posts.length;
    expect(length).toBe(20);
  });

  it("Check that total number of posts on screen matches the number of posts in storage", async () => {
    let posts = await page.$$("journal-post");
    expect(posts.length).toBe(20);
  });

  it("Check Filter Buttons", async () => {
    let posts = await page.evaluate(
      'window.localStorage.getItem("post_array")'
    );
    posts = JSON.parse(posts);
    //get total number of posts with each label:
    let post_totals = {
      Happiness: 0,
      Fear: 0,
      Surprise: 0,
      Anger: 0,
      Sadness: 0,
    };

    for (let i = 0; i < posts.length; i++) {
      post_totals[posts[i]["label"]] += 1;
    }
    //Open Drop Down:
    let dropDown = await page.$("#label_option");
    await dropDown.click();

    //Check each filter button
    let filterButtons = await page.$$(".filterby_label");
    for (let i = 0; i < filterButtons.length; i++) {
      //click filter button
      let button = await filterButtons[i];
      let label = await button.getProperty("value");
      label = await label.jsonValue();
      console.log(`Checking posts after pressing ${label} button`);
      await button.click();
      //get number of posts displayed:
      let filtered_posts = await page.$$("journal-post");
      let len = filtered_posts.length;

      if (label == "Reset") {
        expect(len).toBe(20); //Reset button should display all posts
      } else {
        expect(len).toBe(post_totals[label]); //verify that number of posts on screen matches totals calculated from storage
      }
    }
  });
});
