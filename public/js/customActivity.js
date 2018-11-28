define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                if (key === 'journeytype') {
                    $('#journeytype').val(val);
                }
				if (key === 'entrytype') {
                    $('#entrytype').val(val);
                }
				if (key === 'objective') {
                    $('#objective').val(val);
                }
				if (key === 'reason') {
                    $('#reason').val(val);
                }
              
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

   function save() {
        var name = $('#journeytype').find('option:selected').html();
        var filledform = getMessage();

        // 'payload' is initialized on 'initActivity' above.
        // Journey Builder sends an initial payload with defaults
        // set by this activity's config.json file.  Any property
        // may be overridden as desired.
      payload.name = filledform.journeytype+" "+filledform.entrytype+" "+filledform.objective;
		
		payload['arguments'].execute.inArguments = [{ 
		"journeytype": filledform.journeytype,
		"entrytype": filledform.entrytype,
		"objective": filledform.objective,
		"reason": filledform.reason,
		"tokens":authTokens,
		"dataExtensionId":"testjourneylog",
		"emailAddress": "{{Contact.Default.Email}}"
		}];

        payload['metaData'].isConfigured = true;
        
        connection.trigger('updateActivity', payload);
    }

    function getMessage() {
		 var formvalues = {
            journeytype: "",
            entrytype: "",
            objective: "",
            reason: "",
			filled:false

        };
        formvalues.journeytype = $('#journeytype').find('option:selected').attr('value').trim();
		formvalues.entrytype = $('#entrytype').find('option:selected').attr('value').trim();
		formvalues.objective = $('#objective').find('option:selected').attr('value').trim();
		formvalues.reason = $('#reason').val();
		if ((formvalues.journeytype)&& (formvalues.entrytype)&& ((formvalues.objective)|| (formvalues.reason))){
			formvalues.filled = true;
		}
		
		return formvalues;
    }


});