// import { assert } from "chai"
import fetch from "node-fetch"

// before(done => {
//   console.log("\n\n---------------\n--\n-- START TEST\n--\n---------------")
//   done()
// })

// after(done => {
//   console.log("\n\n---------------\n--\n-- END TEST\n--\n---------------")
//   done()
// })

const packageJson = {
	bootloader: {},
	kb2abot: {}
}

describe("Checking bootloader & kb2abot updates", () => {
	it("Pinging kb2abot repo", async () => {
		const res = await fetch(
			"https://raw.githubusercontent.com/kb2ateam/kb2abot/main/package.json"
		)
		packageJson.kb2abot = await res.json()
	})
	// it("Pinging bootloader repo", async () => {
	// 	const res = await fetch("https://raw.githubusercontent.com/kb2ateam/kb2abot-bootloader/main/package.json")
	// 	packageJson.bootloader = await res.json()
	// })
})

/*


describe('amogus', function () {
	before(function () {
		// runs once before the first test in this block
	});

	after(function () {
		// runs once after the last test in this block
	});

	beforeEach(function () {
		// runs before each test in this block
	});

	afterEach(function () {
		// runs after each test in this block
	});

	// test cases
});

*/

// describe("#Asynchronous user crud test", () => {
//  it("get \"users\" record", done => {
//    chai.request(server)
//      .get("/users")
//      .end(function (err, res) {
//        if (err) done(err)

//        done()
//        console.log("status code: %s, users: %s", res.statusCode, res.body.length)
//      })
//  }).timeout(0)

//  it("get \"user by id\" record", done => {
//    chai.request(server)
//      .get("/users/1")
//      .end(function (err, res) {
//        if (err) done(err)

//        done()
//        console.log("status code: %s, user: %s", res.statusCode, util.inspect(res.body, false, null))
//      })
//  }).timeout(0)

//  it("get \"user with query param id\" record", done => {
//    chai.request(server)
//      .get("/users")
//      .query({ name: "test" })
//      .end(function (err, res) {
//        if (err) done(err)

//        done()
//        console.log("status code: %s, user: %s", res.statusCode, util.inspect(res.body, false, null))
//      })
//  }).timeout(0)

//  it("save \"user\" record", done => {
//    chai.request(server)
//      .post("/users")
//      .send(user)
//      .then(res => {
//        done()
//        console.log("status code: %s, user saved with id: %s", res.statusCode, res.body.insertId)
//      })
//      .catch(err => {
//        done(err)
//      })
//  }).timeout(0)

//  it("update \"user\" record", done => {
//    chai.request(server)
//      .put("/users/2")
//      .send({ email: "new@test.com" })
//      .then(res => {
//        done()
//        console.log("status code: %s, user updated: %s", res.statusCode, res.body.changedRows)
//      })
//      .catch(err => {
//        done(err)
//      })
//  }).timeout(0)

//  it("delete \"user\" record", done => {
//    chai.request(server)
//      .del("/users/5")
//      .then(res => {
//        done()
//        console.log("status code: %s, user delete: %s", res.statusCode, res.body.affectedRows)
//      })
//      .catch(err => {
//        done(err)
//      })
//  }).timeout(0)
// })

// describe("POST /todos", () => {
//  it("should create a new todo", (done) => {
//    var text = "Testing todo route"

//    request(app)
//      .post("/todos")
//      .set("x-auth", users[0].tokens[0].token)
//      .send({ text })
//      .expect(200)
//      .expect((res) => {
//        expect(res.body.text).toBe(text)
//      })
//      .end((err, res) => {
//        if (err) return done(err)

//        Todo.find({ text }).then((todos) => {
//          expect(todos.length).toBe(1)
//          expect(todos[0].text).toBe(text)
//          done()
//        }).catch((err) => {
//          done(err)
//        })
//      })
//  })

//  it("should not create todo with invaild nody data", (done) => {
//    request(app)
//      .post("/todos")
//      .set("x-auth", users[0].tokens[0].token)
//      .send({})
//      .expect(400)
//      .end((err, res) => {
//        if (err) return done(err)

//        Todo.find().then((todos) => {
//          expect(todos.length).toBe(2)
//          done()
//        }).catch((err) => {
//          done(err)
//        })
//      })
//  })
// })
