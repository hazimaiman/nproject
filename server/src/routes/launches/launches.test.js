const request = require ('supertest')
const app =require('../../app')
const {mongoConnect, mongoDisconnect } = require("../../services/mongo")


describe('Launches API', () =>{

    beforeAll(async()=>{
        await mongoConnect();
    })

    afterAll(async()=>{
        await mongoDisconnect();
    })

    describe ("Test GET /launches", () =>{
        test("it shoud respnd with 200 sucees", async ()=>{
            const response = await request(app)
            .get("/v1/launches")
            .expect('Content-Type', /json/)
            .expect(200)
    
        })
    }) 
    
    describe("Test POST / launches",() =>{
        const completeLaunchDate ={
            mission: "uSS enterprise",
            rocket: "Ncc WMEMAN",
            target: "Kepler-62 f",
            launchDate :"January 4,2028"
        }
    
        const launchDataWithoutDate ={
            mission: "uSS enterprise",
            rocket: "Ncc WMEMAN",
            target: "Kepler-62 f",
        }
    
        const launchDataWithInvalidDate ={
            mission: "uSS enterprise",
            rocket: "Ncc WMEMAN",
            target: "Kepler-62 f",
            launchDate: 'zoot'
        }
    
        test("it should respnd with 201 success", async () =>{
            const response = await request(app)
            .post("/v1/launches")
            .send(completeLaunchDate)
    
            .expect('Content-Type', /json/)
            .expect(201)
    
            const requestDate = new Date(completeLaunchDate.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate)
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
    
        });
    
        test('its should catch missing require properties', async() => {
            const response = await request(app)
            .post("/v1/launches")
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
    
            expect(response.body).toStrictEqual({
                error: "Missing required launch property"
            })
        });
    
        test('its should catch invalid dates', async() => {
            const response = await request(app)
            .post("/v1/launches")
            .send(launchDataWithInvalidDate) 
            .expect('Content-Type', /json/)
            .expect(400);
    
    
            expect(response.body).toStrictEqual({
                error: 'Invalid Launch Date'
            } )
        });
    
    });

})

