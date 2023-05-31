const AWS = require('aws-sdk');
const credentials = new AWS.Credentials({
    accessKeyId: 'test',
    secretAccessKey: 'test'
});
AWS.config.credentials = credentials;
  
const s3 = new AWS.S3(
    {
        endpoint: 'https://s3.localhost.localstack.cloud:4566',
        s3ForcePathStyle: true,
    }
);

// This function is triggered by an HTTP request using the POST method.
// The function returns a presigned URL to upload a file to S3.
exports.post = async (event) => {
    const bucketName = 'aws-node-sample-transcribe-s3-local-records';
    const key = event.queryStringParameters.filename;
    const expiration = 3600;

    try {
        const url = await s3.getSignedUrlPromise('putObject', {
            Bucket: bucketName,
            Key: key,
            Expires: expiration,
        });
        return {
            statusCode: 200,
            body: {"url": url},
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
        };
    } catch (err) {
        console.log('Error generating presigned URL', err);
        return {
            statusCode: 500,
            body: 'Error generating presigned URL',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
        };
    }
};
