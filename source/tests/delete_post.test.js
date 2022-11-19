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
      'window.localStorage.getItem("_post_array")'
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
    expect(len).toBe(4);
  });
});
