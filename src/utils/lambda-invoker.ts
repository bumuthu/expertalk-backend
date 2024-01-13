const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

export const invokeHandler = async (handlerArn, payload) => {
    const params = {
        FunctionName: handlerArn,
        InvokeArgs: JSON.stringify({ body: JSON.stringify(payload) })
    };
    const startTime = Date.now();
    console.log("Handler invoked with payload:", payload, "Arn:", handlerArn);

    return await new Promise((resolve, reject) => {
        lambda.invokeAsync(params, function (err, data) {
            if (err) {
                console.log("Error:", err, err.stack);
                reject(err)
            }
            else {
                const endTime = Date.now();
                console.log("Success:", data);
                console.log("Time to invoke:", endTime - startTime)
                resolve(data)
            }
        })
    })
}