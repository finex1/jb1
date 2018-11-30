'use strict';

const assert = require('assert');
const {clientId, clientSecret, origin, authOrigin, globalReqOptions} = require('./test.config');
const ET_Client = require('../lib/ET_Client');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {

    // example on how to decode JWT
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {

        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            
            // decoded in arguments
			var Objective_not_met = false;
			var Objective_met = false;
			var ExitUpdateType = false;
			var EntryUpdateType = false;
			var EntryUpdateDate = "";
			var UpdateDate ="";
			var UpdateType ="";
			var ExitUpdateDate = "";
			var objective = "";
			var d = new Date();
			var z = d.toLocaleDateString() +" "+ d.toLocaleTimeString();
			
            var decodedArgs = decoded.inArguments[0];
			if (decodedArgs.objective == "met"){
				Objective_met = true;
				 objective = "'Objective_met':"+ Objective_met;
			}else if(decodedArgs.objective == "notmet"){
				Objective_not_met = true;
				objective = "'Objective_not_met':"+ Objective_not_met;
			}
		
			if (decodedArgs.entrytype == "entry"){
				EntryUpdateType = true;
				EntryUpdateDate = z;
				UpdateType = "'EntryUpdateType':"+ EntryUpdateType;
				UpdateDate = "'EntryUpdateDate':"+ EntryUpdateDate;
			}else if(decodedArgs.entrytype == "exit"){
				ExitUpdateType = true;
				ExitUpdateDate = z;
				UpdateType = "'ExitUpdateType':"+ ExitUpdateType;
				UpdateDate = "'ExitUpdateDate':"+ ExitUpdateDate;
			}
				/*************************************************/
	/*describe('DataExtension', function () {

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
	const client = new ET_Client(clientId, clientSecret, null, {origin, authOrigin, globalReqOptions});
			const createdDataExtensionId = "testjourneylog";
			var Args 
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
						Args   = response.body.Results.length
						done();
					});
	******************************************************************************************/
		var request = require('request');
		/******************************************************************************************
		
			var Authurl = 'https://auth.exacttargetapis.com/v1/requestToken';
			var contentType = 'application/json';
			var payload = {
					clientId: process.env.ID,
					clientSecret: process.env.SECRET
			};
			var accessTokenRequest = "";
			var data = {
				url: Authurl,
				json: true,
				body: payload
			}

			request.post(data, function(error, httpResponse, body){
				accessTokenRequest = body;
			});																								*/
			/*
			if(accessTokenRequest.StatusCode == 200) {
				var tokenResponse = Platform.Function.ParseJSON(accessTokenRequest.Response[0]);
				var accessToken = tokenResponse.accessToken;	
				var updateDE = {};
				if (accessToken != '' || accessToken != 'undefined'){
					var APIurl = 'https://www.exacttargetapis.com//hub/v1/dataevents/key:'+decodedArgs.dataExtensionId+'/rowset';
					var contentType = 'application/json';
					var payload = [ {
								"keys":{
										"Id": decodedArgs.Id
										},
								"values":{
										"AccountID": decodedArgs.AccountID,
										"Journeyid": decodedArgs.definitionId,
										objective,
										"Reason": decodedArgs.Reason,
										UpdateType,
										UpdateDate,
										"journeytype": decodedArgs.journeytype
										}
								}];
					var headerNames = ["Authorization"];
					var headerValues = ["Bearer "+accessToken];
					 updateDE = HTTP.Post(APIurl, contentType, JSON.stringify(payload), headerNames, headerValues);			
				}	
			}*/
			var updateDE = [];
			const client = new ET_Client(process.env.ID, process.env.SECRET, null, {origin, authOrigin, globalReqOptions});
			const Name = decodedArgs.dataExtensionId;
            const props = {
                Id: decodedArgs.Id,
				AccountID: decodedArgs.AccountID,
				Journeyid: decodedArgs.definitionId
            };
            client.dataExtensionRow({Name, props}).post((err, response) => {
                if (err) throw new Error(err);
                assert.equal(response.res.statusCode, 200);
				updateDE = response;
               
            });
			
			var url ='http://requestbin.fullcontact.com/10sa3c91'
			request({url:url,
					method:"POST",
					JSON:decoded.inArguments[0]
					}, function (error, response, body) {
			  if (!error) {
				console.log(body);
			  }
			});
			
            logData(req);
            res.send(200, 'Execute');
			
/*******************************************************************************************/	
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Validate');
};