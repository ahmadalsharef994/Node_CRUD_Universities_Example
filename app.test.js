/*
Jest gives the ability to send request with mock IP addresses. So, we can test the IP Filter and Rate Limter.
*/

const supertest = require('supertest');
const req = require('express/lib/request');
const app = require ("./app")

jest.setTimeout(60000); 

afterEach(async () => {
  await app.close();
});

afterAll(()=>{ //force exit Node after executing all tests
  process.kill(0)
})

//test 1
 it(`Should return 200`, async done => {
    const IP =  "127.0.0.1";
    jest.spyOn(req, 'ip', 'get').mockReturnValue(IP); //This mocks request IP
    await supertest(app).get("/getuniversities").then((response) => {
      console.log(`Response Status for ${IP}: `, response.status)
    })     
      done();
  }); 

  //test 2
  it(`Should return 200`, async done => {
    const IP =  "127.0.0.1";
    jest.spyOn(req, 'ip', 'get').mockReturnValue(IP);
    await supertest(app).get("/getuniversities").then((response) => {
      console.log(`Response Status for ${IP}: `, response.status)
    })     
      done();
  }); 

  //test 3
  it(`Should return 429 (in case rate_limit is set to 2)`, async done => {
    const IP =  "127.0.0.1";
    jest.spyOn(req, 'ip', 'get').mockReturnValue(IP);
    await supertest(app).get("/getuniversities").then((response) => {
      console.log(`Response Status for ${IP} on the third call: `, response.status)
    })     
      done();
  }); 

//test 4
it(`Should return 401`, async done => {
  const IP =  "127.3.3.3"
  jest.spyOn(req, 'ip', 'get').mockReturnValue(IP);
  await supertest(app).get("/getuniversities").then((response) => {
    console.log(`Response Status for ${IP}: `, response.status)
  })    
   done();
  }); 
