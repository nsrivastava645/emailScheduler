const { StatusCodes } = require("./UtilConstants");
module.exports = function responseHandler(status, statusCode, title, message = null, res, apiResponse, req, isInternalResponse = false) {
    let log = 'Endpoint: ' + (req ? req.url : undefined) +
      '\nTitle: ' + title +
      '\nMessage: ' + message +
      '\nStatus: ' + statusCode +
      '\nResponse/error: ' + (apiResponse && apiResponse.message ? apiResponse.message : JSON.stringify(apiResponse));
    if (statusCode !== StatusCodes.Ok && statusCode !== StatusCodes.BadRequest)
        console.error(log);
    else
        console.debug(log);
    if (isInternalResponse)
        return {
            status: status,
            code: statusCode,
            title: title,
            message: message,
            response: apiResponse
        };
    return res.send({
        status: status,
        code: statusCode,
        title: title,
        message: message,
        response: apiResponse,
        underMaintenance: 'no',
        serverTimestamp: Math.floor(Date.now() / 1000)
    }); 
}