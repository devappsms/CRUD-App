var chai = require('chai');
var chaiHttp = require('chai-http');
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style
var server = require('./../server');

chai.use(chaiHttp)

/*
*  Test - server started 
*/
describe('Test - Server Started', () => {
    it('Is server running on 3000', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message');
                let msg = res.body.message;
                expect(msg).to.equals('Running on port 3000')
                done();
            });
    });
});


/*
*  Test - Api JWT validation
*/
describe('Test - api not allowed without JWT token', () => {
    it('Api NOT allowed without JWT token', (done) => {
        chai.request(server)
            .get('/api')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('err');
                let msg = res.body.err;
                expect(msg).to.equals("Invalid Request")
                done();
            });
    });
});

let user = {
    email_id : 'parent1@school.com',
    key: 'school123'
}

let token;

/*
*  Test - Get JWT token
*/
describe('Test - Get JWT token', () => {
    it('Get JWT token', (done) => {
        chai.request(server)
            .post('/getUserToken')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('result').to.includes.keys('token');
                token = res.body.token;
                done();
            });
    });
    
    it('Invalid user should get - Check your credentials message',(done) => {
        chai.request(server)
            .post('/getUserToken')
            .send({...user, key: '12354'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('err');
                let msg = res.body.err;
                expect(msg).to.equals("Check your credentials")
                done();
            });
    })

});


