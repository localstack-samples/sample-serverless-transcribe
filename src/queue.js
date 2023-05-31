const localstackHost = `http://${process.env.LOCALSTACK_HOSTNAME}:${process.env.EDGE_PORT}`;
const awsSdk = require('aws-sdk');
const sqs = new awsSdk.SQS({endpoint:localstackHost});
const ses = new awsSdk.SES({endpoint:localstackHost});
const s3 = new awsSdk.S3({endpoint:localstackHost, s3ForcePathStyle: true});

// This function consumes the event from s3 PutObject and pushes a new message to SQS.
const producer = async (event, context, callback) => {
  let statusCode = 200;
  let message;

  const queueUrl = `http://${process.env.LOCALSTACK_HOSTNAME}:${process.env.EDGE_PORT}/000000000000/aws-node-sample-transcribe-s3-local-jobs`;

  try {
    // Get the record from the s3 event
    const records = event.Records;
    const sqsSendMessagePromises = records.map((record) => {
        var jsonContent = "";
        const params = {
            Bucket: process.env.S3_TRANSCRIPTION_BUCKET,
            Key: record.s3.object.key
        };
        s3.getObject(params, (err, data) => {
            if (err) {
              console.error("Error getting object from S3 bucket: ", process.env.S3_TRANSCRIPTION_BUCKET)
            } else {
              jsonContent = JSON.parse(data.Body.toString());

              // Send message to SQS queue
              return sqs.sendMessage({
              QueueUrl: queueUrl,
              MessageBody: jsonContent.results.transcripts[0].transcript,
              MessageAttributes: {
                AttributeName: {
                  StringValue: "Attribute Value",
                  DataType: "String",
                },
              },
            }).promise();
            }
          });
      });

    Promise.all(sqsSendMessagePromises)
    .then(() => {
      callback(null, { message: 'Message sent successfully' });
    })
    .catch(err => callback(err, { message: 'Error sending message' }));
    message = "Message accepted!";
  } catch (error) {
    console.log(error);
    message = error;
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
            Data: "Test Email - JOB COMPLETED SUCESSFULLY"
          }
        },
        Source: "sender@example.com" // Sender email address
      };
    
      try {
        // Send email to recipient
        const result = await ses.sendEmail(params).promise(); 
        console.log("Email sent successfully: ", result);
      } catch (error) {
        console.error("Error sending email: ", error);
      }
  }
};  

module.exports = {
  producer,
  consumer,
};