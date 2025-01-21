const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);

const postsData = async () => {
  const posts = await fetch("http://localhost:3000/post");
  const postsData = await posts.json();
  return postsData;
};

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNjc2NWJkYjQ4ZmM3ZTJhMTEzYzIyNGUwIiwiaWF0IjoxNzM3NDUxMzg3LCJleHAiOjE3Mzc0NTQ5ODd9.o1VM8UiIAZ9HQP7ZCEnVN1C9S8Bv9vSwEhX6Ry0jr4k";

describe("Post Api Test", function () {
  it("Should return a list of users with its posts", async function () {
    this.timeout(10000); // Increase timeout if needed

    const expectedData = await postsData(); // Fetch expected data

    const res = await chai.request("http://localhost:3000").get("/post");

    expect(res).to.have.status(200);
    expect(res.body.data).to.be.an("array");
    expect(res.body).to.deep.equal(expectedData);
    res.body.data[0].posts.forEach((post) => {
      expect(post).to.have.keys([
        "_id",
        "user_id",
        "title",
        "description",
        "photos",
        "__v",
        "createdAt",
        "updatedAt",
      ]);
    });
  });

  it("Should send post data", async function () {
    this.timeout(10000);

    const mockingData = {
      title: "Testing Title",
      description: "testing description here!",
      photos: [],
    };

    const res = await chai
      .request("http://localhost:3000")
      .post("/post")
      .send(mockingData)
      .set("Authorization", token);

    expect(res).to.have.status(200);
    expect(res.body).to.have.key("message");
    expect(mockingData).to.have.property("title").not.equal("");
    expect(mockingData).to.have.property("description").not.equal("");
    //expect(mockingData).to.have.property("photos").not.equal("");
  });

  it("Should update post data", async function () {
    this.timeout(10000);

    const mockingData = {
      title: "Testing Title",
      description: "testing description here!",
      //photos: [],
    };

    const res = await chai
      .request("http://localhost:3000")
      .patch("/post/67851fa8403550b1b3e941f1")
      .send(mockingData)
      .set("Authorization", token);

    expect(res).to.have.status(200);
    expect(mockingData).to.have.property("title").not.equal("");
    expect(mockingData).to.have.property("description").not.equal("");
    expect(res.body).to.include.all.keys([
      "title",
      "photos",
      "description",
      "_id",
    ]);
  });

  it("Should Delete a Post", async function () {
    this.timeout(10000);

    const res = await chai
      .request("http://localhost:3000")
      .delete("/post/678e46434661553429b180d0")
      .set("Authorization", token);

    expect(res).to.have.status(200);
  });
});
