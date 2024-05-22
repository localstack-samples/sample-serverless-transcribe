import { S3, GetObjectCommand } from "@aws-sdk/client-s3";
import { SES, SendEmailCommand } from "@aws-sdk/client-ses";
import { SQS, SendMessageCommand } from "@aws-sdk/client-sqs";

const endpoint = process.env.AWS_ENDPOINT_URL;
const sqs = new SQS({
  endpoint: endpoint,
  credentials: {
    accessKeyId:'test',
    secretAccessKey:'test'
},
});
const ses = new SES({
  endpoint: endpoint,
  credentials: {
    accessKeyId:'test',
    secretAccessKey:'test'
},
});
const s3Client = new S3({
  endpoint: endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId:'test',
    secretAccessKey:'test'
},
});
const queueUrl = `${endpoint}/000000000000/aws-node-sample-transcribe-s3-local-jobs`;
const transcriptionBucket = process.env.S3_TRANSCRIPTION_BUCKET

// This function consumes the event from s3 PutObject and pushes a new message to SQS.
const producer = async (event, context, callback) => {
  let statusCode = 200;
  let message;

  try {
    // Get the record from the s3 event
    const records = event.Records;
    const sqsSendMessagePromises = records.map(async (record) => {
      const params = {
        Bucket: transcriptionBucket,
        Key: record.s3.object.key,
      };

      try {
        const data = await s3Client.send(new GetObjectCommand(params));
        const str = await data.Body.transformToString();
        console.log("str: ", str);

        const jsonContent = await JSON.parse(str);
        console.log("jsonContent: ", jsonContent);

        // Send message to SQS queue
        const sendMessageParams = {
          QueueUrl: queueUrl,
          MessageBody: jsonContent.results.transcripts[0].transcript,
          MessageAttributes: {
            AttributeName: {
              StringValue: "Attribute Value",
              DataType: "String",
            },
          },
        };
        await sqs.send(new SendMessageCommand(sendMessageParams));
      } catch (err) {
        console.error("Error getting object from S3 bucket: ", transcriptionBucket, err);
        throw err;
      }
    });

    await Promise.all(sqsSendMessagePromises);
    callback(null, { message: 'Message sent successfully' });
    message = "Message accepted!";
  } catch (error) {
    console.log(error);
    message = error.message;
    statusCode = 500;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

// The function is triggered by the SQS queue.
// A function is triggered whenever there is a new message in the queue.
// When the function is triggered, it sends an email to 'sender@example.com'
const consumer = async (event) => {
  for (const record of event.Records) {
    const params = {
        Destination: {
          ToAddresses: ["recipient@example.com"] // Email address/addresses that you want to send your email
        },
        Message: {
          Body: {
            Text: {
              Charset: "UTF-8",
              Data: `Hey there! Here is your generated transcribed file:\n${record.body}`
            }
          },
          Subject: {
            Charset: "UTF-8",
            Data: "Test Email - JOB COMPLETED SUCCESSFULLY"
          }
        },
        Source: "sender@example.com" // Sender email address
      };
    
      try {
        // Send email to recipient
        const result = await ses.send(new SendEmailCommand(params));
        console.log("Email sent successfully: ", result);
      } catch (error) {
        console.error("Error sending email: ", error);
      }
  }
};

export { producer, consumer };
