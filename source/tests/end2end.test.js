async function create_random_post() {
  let button = await page.$("#create_button");
  await button.click();

  //get reference to popup
  let popup = await page.$("popup-dialog");
  let shadow = await popup.getProperty("shadowRoot");
  let textBox = await shadow.$("textarea");
  let labelSelect = await shadow.$("select");
  let confirmButton = await shadow.$("#yes-button");

  //Type sample text content:
  await textBox.type("This is some random text lorem ipsum");
  //Select a label
  let label = "Happiness";
  let x = Math.random();
  switch (x) {
    case x < 0.2:
      label = "Sadness";
      break;
    case x < 0.4:
      label = "Fear";
      break;
    case x < 0.6:
      label = "Surprise";
      break;
    case x < 0.8:
      label = "Anger";
      break;
  }
  await labelSelect.type(label);

  //Confirm post
  await confirmButton.click();
}

const PATH = "http://localhost:9999";
describe("Test Post Functionality", () => {
  beforeAll(async () => {
    await page.goto(PATH);
  });
  it("Add Posts to LocalStorage", async () => {
    //click the create button 5 times to create 5 random posts
    for (let i = 0; i < 5; i++) {
      await create_random_post();
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

  it("Check create cancel functionality", async () => {
    let button = await page.$("#create_button");
    await button.click();

    let popup = await page.$("popup-dialog");
    let shadow = await popup.getProperty("shadowRoot");
    let cancelButton = await shadow.$("#no-button");
    await cancelButton.click();

    let cancelPop = await page.$("popup-dialog");
    let shadowPop = await cancelPop.getProperty("shadowRoot");
    await shadowPop.waitForSelector("h1");
    let edit_post_header = await shadowPop.$("h1");
    let inner_text = await edit_post_header.getProperty("innerText");
    let text = await inner_text.jsonValue();
    //checks to see if popup is the edit post popup
    expect(text).toBe("Cancel Create Post?");

    let confirmButton = await shadowPop.$("#yes-button");
    await confirmButton.click();

    let posts = await page.$$("journal-post");
    expect(posts.length).toBe(5);
  });

  it("Check edit cancel functionality", async () => {
    // clicks the edit button
    let post = await page.$("journal-post");
    let shadow = await post.getProperty("shadowRoot");
    let button = await shadow.$("#edit_button");
    await button.click();

    let popup = await page.$("popup-dialog");
    let shadowPop = await popup.getProperty("shadowRoot");
    await shadowPop.waitForSelector("h1");
    let edit_post_header = await shadowPop.$("h1");
    let inner_text = await edit_post_header.getProperty("innerText");
    let text = await inner_text.jsonValue();
    //checks to see if popup is the edit post popup
    expect(text).toBe("Edit Post");
    await shadowPop.waitForSelector("textarea");
    let textBox = await shadowPop.$("textarea");
    await page.keyboard.type("This is an edited post. ");
    let textBox_inner_text = await textBox.getProperty("value");
    let textBox_text = await textBox_inner_text.jsonValue();
    //checks to see if text is changed in the textbox of edit post popup
    expect(textBox_text).toBe(
      "This is an edited post. This is some random text lorem ipsum"
    );
    console.log(textBox_text);
    let noButton = await shadowPop.$("#no-button");
    await noButton.click();

    let cancelPop = await page.$("popup-dialog");
    cancelPop = await cancelPop.getProperty("shadowRoot");
    let yes = await cancelPop.$("#yes-button");
    await yes.click();

    let new_post = await page.$("journal-post");
    let new_shadow = await new_post.getProperty("shadowRoot");
    let new_post_textBox = await new_shadow.$(".post_text");
    let new_post_textBox_inner_text = await new_post_textBox.getProperty(
      "innerText"
    );
    let new_post_textBox_text = await new_post_textBox_inner_text.jsonValue();
    //checks to see if post card now has edited content on it
    expect(new_post_textBox_text).toBe("This is some random text lorem ipsum");
    console.log(new_post_textBox_text);
  });

  it("Check that popup appears after clicking delete button", async () => {
    let journalPost = await page.$("journal-post");
    let shadow = await journalPost.getProperty("shadowRoot");
    let button = await shadow.$("#delete_button");
    await button.click();
    let popup = await page.$("popup-dialog");
    popup = await popup.getProperty("shadowRoot");
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
      let popup = await page.$("popup-dialog");
      popup = await popup.getProperty("shadowRoot");
      let yes = await popup.$("#yes-button");
      await yes.click();
      popup = await page.$("#warning-dialog");
      expect(popup).toBe(null);
      let posts = await page.$$("journal-post");
      let len = posts.length;
      expect(len).toBe(4 - i);
    }
  });

  jest.setTimeout(30000);
  it("Add Posts to LocalStorage", async () => {
    //click the create button 20 times to create 20 random posts
    //@todo - when the popup is implemented this test will fail as it won't be creating posts propperly
    console.log("Creating 20 Random Posts...");
    for (let i = 0; i < 20; i++) {
      await create_random_post();
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

  it("Check that edit works", async () => {
    // clicks the edit button
    let post = await page.$("journal-post");
    let shadow = await post.getProperty("shadowRoot");
    let button = await shadow.$("#edit_button");
    await button.click();

    let popup = await page.$("popup-dialog");
    let shadowPop = await popup.getProperty("shadowRoot");
    await shadowPop.waitForSelector("h1");
    let edit_post_header = await shadowPop.$("h1");
    let inner_text = await edit_post_header.getProperty("innerText");
    let text = await inner_text.jsonValue();
    //checks to see if popup is the edit post popup
    expect(text).toBe("Edit Post");
    await shadowPop.waitForSelector("textarea");
    let textBox = await shadowPop.$("textarea");
    await page.keyboard.type("This is an edited post. ");
    let textBox_inner_text = await textBox.getProperty("value");
    let textBox_text = await textBox_inner_text.jsonValue();
    //checks to see if text is changed in the textbox of edit post popup
    expect(textBox_text).toBe(
      "This is an edited post. This is some random text lorem ipsum"
    );
    console.log(textBox_text);
    let confirmButton = await shadowPop.$("#yes-button");

    await confirmButton.click();

    let new_post = await page.$("journal-post");
    let new_shadow = await new_post.getProperty("shadowRoot");
    let new_post_textBox = await new_shadow.$(".post_text");
    let new_post_textBox_inner_text = await new_post_textBox.getProperty(
      "innerText"
    );
    let new_post_textBox_text = await new_post_textBox_inner_text.jsonValue();
    //checks to see if post card now has edited content on it
    expect(new_post_textBox_text).toBe(
      "This is an edited post. This is some random text lorem ipsum"
    );
    console.log(new_post_textBox_text);
  });

  it("Check that refreshing page saves posts", async () => {
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
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
    let collapse_side_button = await page.$("#collapse_button");
    await collapse_side_button.click();
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
