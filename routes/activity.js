'use strict';

const assert = require('assert');
const {clientId, clientSecret, origin, authOrigin, globalReqOptions} = require('./test.config');
//const ET_Client = require('../lib/ET_Client');

// Deps
const Path = require('path');
const Path2 = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
const ET_Client = require(Path.join(__dirname, '..', 'lib','ET_Client.js'));
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
            var decodedArgs = decoded.inArguments[0];
			
			/**/var Objective_not_met = false;
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
			}																				/**/
			
			
			
			var updateDE = {};
			var test = "";
			
			
			
			
			
			
		/*	var FuelAuth = require( 'fuel-auth' );

			// Required Settings
			var myClientId     = clientId;
			var myClientSecret = clientSecret;

			
		//	Initialization with extra options
			var authUrl      = "https://auth.exacttargetapis.com/v1/requestToken"; //this is the default
			var accessToken  = "";
			var refreshToken = "";

			var FuelAuthClient = new FuelAuth({
				clientId: myClientId // required
				, clientSecret: myClientSecret // required
				, authUrl: authUrl
				, accessToken: accessToken
				, refreshToken: refreshToken
			});
			
			var options = {
			  // whatever request options you want
			  // See https://github.com/mikeal/request#requestoptions-callback
			  
			  force: true // I want to force a request
			};

			FuelAuthClient.getAccessToken(options, function(err, data) {
			  if(err) {
				console.log(err);
				return;
			  }

			   var test1= data;
			  // data.expiresIn = how long until token expiration
			  
			console.log(data);
			});
			
*/
		   	const FuelRest = require('fuel-rest');
			const options = {
				auth: {
					// options you want passed when Fuel Auth is initialized
					clientId: clientId,
					clientSecret: clientSecret
				}
			//	,				origin: 'https://alternate.rest.endpoint.com' // default --> https://www.exacttargetapis.com
			};
const RestClient = new FuelRest(options);
var jsonbody = {"keys":{"Id": decodedArgs.Id},"values":{"AccountId": decodedArgs.AccountID}};
			const optionss = {
				uri: '/hub/v1/dataeventsasync/key:'+decodedArgs.dataExtensionId+'/rowset',
				headers: {},
				json:true,
				 multipart: [
				 {	'content-type': 'application/json',
					 body: JSON.stringify(jsonbody)}
				 ]
				
				// other request options
			};
					// CANNOT USE BOTH CALLBACKS AND PROMISES TOGETHER
			RestClient.post(optionss, (err, response) => {
				if (err) {
					// error here
					console.log(err);
				}
				var request = require('request');
				var url ='https://webhook.site/fc3cd16a-1950-4329-ba25-8080421eadf4?fieldname='+response.res.statusCode
				request({
				url:url,
				method:"POST",
				json: response
				}, function (error, response, body) {
				  if (!error) {
					console.log(body);
				  }
				});
				// will be delivered with 200, 400, 401, 500, etc status codes
				// response.body === payload from response
				// response.res === full response from request client
				console.log(response);
			});
			

	
			
			
			
            
            logData(req);
            res.send(200, 'Execute');
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