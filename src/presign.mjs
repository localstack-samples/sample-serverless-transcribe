import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';

const s3 = new S3({
    endpoint: 'https://s3.localhost.localstack.cloud:4566',
    forcePathStyle: true,
    credentials: {
        accessKeyId:'test',
        secretAccessKey:'test'
    },
});

// This function is triggered by an HTTP request using the POST method.
// The function returns a presigned URL to upload a file to S3.
export const post = async (event) => {
    const bucketName = 'aws-node-sample-transcribe-s3-local-records';
    const key = event.queryStringParameters.filename;
    const expiration = 3600;

    try {
        const url = await getSignedUrl(s3, new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
        }), {
            expiresIn: expiration,
        });
        console.log('Presigned URL: ', url);
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
