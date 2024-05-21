'use strict';

import { Transcribe, StartTranscriptionJobCommand } from "@aws-sdk/client-transcribe";

const endpoint_url = process.env.AWS_ENDPOINT_URL
const endpoint = new URL(endpoint_url);
const endpointConfig = {
  endpoint: endpoint_url,
  credentials: {
    accessKeyId:'test',
    secretAccessKey:'test'
},
};

const transcribeClient = new Transcribe(endpointConfig);

// This function is triggered by an S3 event.
// It starts a transcription job given an audio file.
export const transcribe_process = async (event, context, callback) => { 
  const records = event.Records;
  console.log("Processing records: ", records);

  const transcribingPromises = records.map(async (record) => {
    const TranscriptionJobName = record.s3.object.key;

    // Start Transcription Job
    try {
      const command = new StartTranscriptionJobCommand({
        LanguageCode: process.env.LANGUAGE_CODE,
        Media: {
          MediaFileUri: `s3://${process.env.S3_AUDIO_BUCKET}/${record.s3.object.key}`  // s3 media file uri
        },
        MediaFormat: 'wav',
        TranscriptionJobName: TranscriptionJobName,
        MediaSampleRateHertz: 8000, // normally 8000 if you are using wav file
        OutputBucketName: process.env.S3_TRANSCRIPTION_BUCKET, // s3 bucket to store the transcription result
      });
      console.log('Starting transcription job');
      await transcribeClient.send(command);
    } catch (err) {
      console.log('Error starting transcription job', err);
      throw err;
    }
  });

  try {
    await Promise.all(transcribingPromises);
    callback(null, { message: 'Start transcription job successfully' });
  } catch (err) {
    callback(err, { message: 'Error start transcription job' });
  }
};
