const assert = require('assert');
const {clientId, clientSecret, origin, authOrigin, globalReqOptions} = require('./test.config');
const ET_Client = require('../lib/ET_Client');


describe('DataExtension', function () {

    this.timeout(10000);
    let client, createdDataExtensionId;
	createdDataExtensionId = "testjourneylog";

    before(() => {
        client = new ET_Client(clientId, clientSecret, null, {origin, authOrigin, globalReqOptions});
    });

    

    describe('Get', () => {
        const props = ['CustomerKey'];
        it('should get it if createdDataExtensionId is passed', done => {
            const filter = {
                leftOperand: 'CustomerKey',
                operator: 'equals',
                rightOperand: createdDataExtensionId
            };
            client.dataExtension({props, filter}).get((err, response) => {
                if (err) throw new Error(err);
                assert.equal(response.res.statusCode, 200);
                assert.equal(response.body.Results.length, 1);
                assert.equal(response.body.Results[0].CustomerKey, createdDataExtensionId);
                done();
            });
        });
        it('should error 404 if random id is passed', done => {
            const filter = {
                leftOperand: 'CustomerKey',
                operator: 'equals',
                rightOperand: createdDataExtensionId
            };
            client.dataExtension({props, filter}).get((err, response) => {
                if (err) throw new Error(err);
                assert.equal(response.body.Results.length, 0);
                done();
            });
        });
    });

   

});