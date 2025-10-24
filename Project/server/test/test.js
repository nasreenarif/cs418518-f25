import { expect } from 'chai';
import { it } from 'mocha';
import supertest from 'supertest';
import app from '../app.js';


describe('Test Numbers', () => {
    it('should add two numbers', function () {
        const num1 = 2;
        const num2 = 3;

        expect(num1 + num2).to.equal(5);
    })
})

describe('Test user api', () => {
    it('Calling user creation', async () => {
        const response = await supertest(app).post(`/user`).send({
            "u_first_name": "Test",
            "u_last_name": "API",
            "u_email": "narif@odu.com",
            "u_password": "12345678",
            "is_verified": 0,
            "is_admin":0
        });

        expect(response.status).to.equal(200);
    })
})