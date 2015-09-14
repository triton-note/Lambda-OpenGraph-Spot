var async = require('async');
var aws = require("aws-sdk");
var dbdoc = require('dynamodb-doc');

var log = function() {
	var args = Array.prototype.map.call(arguments, function(value) {
		if (typeof value === 'string') {
			return value;
		} else {
			return JSON.stringify(value, null, 2)
		}
	});
	console.log.apply(this, args);
}

exports.handler = function(event, context) {
    log('Received event:', event);

    var region = event.region;
    var table_report = event.table_report;
    var column_cognitoId = "COGNITO_ID";
    var column_reportId = "REPORT_ID";
    var cognitoId = event.cognitoId;
    var reportId = event.reportId;

    aws.config.update({region: region});
    var docClient = new dbdoc.DynamoDB();
    
    async.waterfall(
    		[
    		 function(next) {
    			 var params = {
    					 "TableName": table_report,
    					 "Key": {}
    			 };
        		 params.Key[column_cognitoId] = cognitoId;
        		 params.Key[column_reportId] = reportId;
    			 log("GetItem: ", params);
    			 
    			 docClient.getItem(params, next);
    		 },
    		 function(res, next) {
    			 log("Result of GetItem: ", res);
    			 var report = res.Item;
    			 var spot = report.CONTENT.location;
    			 
    			 spot.title = spot.name;
    			 spot.description = spot.title;
    			 next(null, spot);
    		 },
    		 function(spot, next) {
    			 log("Report: ", spot);
    			 
    			 var base64 = new Buffer(JSON.stringify(event)).toString('base64');
    			 
    			 next(null, {
    				 "info": event,
    				 "info_base64": base64,
    				 "spot": spot
    			 });
    		 }
            ],
    		function(err, result) {
    			if (err) {
    				context.fail(err);
    			} else {
    				log("Result: ", result);
    				context.succeed(result);
    			}
    		});
}
