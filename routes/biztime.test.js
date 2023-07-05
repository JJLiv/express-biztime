process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");


let testCompany 


beforeEach(async function() {
    let result = await db.query(`
    INSERT INTO 
    companies (code, name, description) VALUES ("ans", "A New Shine", "Boat Detailing")
    RETURNING code, name, description`);
    testCompany = result.rows[0];
});

afterEach(async function() {
    await db.query("DELETE FROM companies");
});

afterAll(async function() {
    await db.end();
});


describe("GET /companies", function() {
    test("Gets a list of 1 company", async function() {
      const response = await request(app).get(`/companies`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        companies: [testCompany]
      });
    });
    test("Responds with 404 if can't find company", async function() {
        const response = await request(app).get(`/companies/0`);
        expect(response.statusCode).toEqual(404);
    });    
  });


  describe("POST /companies", function() {
    test("Creates a new company", async function() {
      const response = await request(app)
        .post(`/companies`)
        .send({
          code: "md",
          name: "Mountain Dew",
          description: "Beverage",
        });
      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        company: {code: expect.any(String), name: "Mountain Dew", description: "Beverage"}
      });
    });
  });

  describe("PATCH /companies/:code", function() {
    test("Updates a single company", async function() {
      const response = await request(app)
        .patch(`/companies/${testCompany.code}`)
        .send({
          name: "A New Shine Marine",
          description: "Professional Boat Detailing",
        });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        company: {code: testCompany.code, name: "A New Shine Marine", description: "Professional Boat Detailing"}
      });
    });
  
    test("Responds with 404 if can't find company", async function() {
      const response = await request(app).patch(`/companies/0`);
      expect(response.statusCode).toEqual(404);
    });
  });

  describe("DELETE /companies/:code", function() {
    test("Deletes a single a company", async function() {
      const response = await request(app)
        .delete(`/companies/${testCompany.code}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ message: "DELETED!" });
    });
  });

