# Serverless Transcription App 

| Key          | Value                                                                |
| ------------ | -------------------------------------------------------------------- |
| Environment  | <img src="https://img.shields.io/badge/LocalStack-deploys-4D29B4.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAKgAAACoABZrFArwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAALbSURBVHic7ZpNaxNRFIafczNTGIq0G2M7pXWRlRv3Lusf8AMFEQT3guDWhX9BcC/uFAr1B4igLgSF4EYDtsuQ3M5GYrTaj3Tmui2SpMnM3PlK3m1uzjnPw8xw50MoaNrttl+r1e4CNRv1jTG/+v3+c8dG8TSilHoAPLZVX0RYWlraUbYaJI2IuLZ7KKUWCisgq8wF5D1A3rF+EQyCYPHo6Ghh3BrP8wb1en3f9izDYlVAp9O5EkXRB8dxxl7QBoNBpLW+7fv+a5vzDIvVU0BELhpjJrmaK2NMw+YsIxunUaTZbLrdbveZ1vpmGvWyTOJToNlsuqurq1vAdWPMeSDzwzhJEh0Bp+FTmifzxBZQBXiIKaAq8BBDQJXgYUoBVYOHKQRUER4mFFBVeJhAQJXh4QwBVYeHMQJmAR5GCJgVeBgiYJbg4T8BswYPp+4GW63WwvLy8hZwLcd5TudvBj3+OFBIeA4PD596nvc1iiIrD21qtdr+ysrKR8cY42itCwUP0Gg0+sC27T5qb2/vMunB/0ipTmZxfN//orW+BCwmrGV6vd63BP9P2j9WxGbxbrd7B3g14fLfwFsROUlzBmNM33XdR6Meuxfp5eg54IYxJvXCx8fHL4F3w36blTdDI4/0WREwMnMBeQ+Qd+YC8h4g78wF5D1A3rEqwBiT6q4ubpRSI+ewuhP0PO/NwcHBExHJZZ8PICI/e73ep7z6zzNPwWP1djhuOp3OfRG5kLROFEXv19fXP49bU6TbYQDa7XZDRF6kUUtEtoFb49YUbh/gOM7YbwqnyG4URQ/PWlQ4ASllNwzDzY2NDX3WwioKmBgeqidgKnioloCp4aE6AmLBQzUExIaH8gtIBA/lFrCTFB7KK2AnDMOrSeGhnAJSg4fyCUgVHsolIHV4KI8AK/BQDgHW4KH4AqzCQwEfiIRheKKUAvjuuu7m2tpakPdMmcYYI1rre0EQ1LPo9w82qyNziMdZ3AAAAABJRU5ErkJggg=="> |
| Services     | Transcribe, S3, Lambda, SQS, SES                                     |
| Integrations | Serverless Framework, AWS CLI, Serverless Lift Pluglin, AWS SDK      |
| Categories   | Serverless, Event-driven architecture, S3 Trigger, LocalStack developer endpoints |
| Level        | Intermediate                                                         |
| Github       | [Repository link](https://github.com/localstack/sample-transcribe-app) |                                                 

## Introduction

The Transcription sample application simplifies and streamlines the process of transcribing audio files. 
This sample application allows you to upload your audio files and receive a transcript in minutes. 

The sample application exposes a user-friendly web interface that allows you to upload audio files and view completed transcription jobs in an S3 bucket with an email triggered via SES to notify you of the job completion. 
You can further view a list of all your completed transcription jobs and a link to download the transcription JSON file. 
Users can deploy this application setup via the Serverless Framework on LocalStack. 

To test this application sample, we will demonstrate how you use LocalStack to deploy the infrastructure on your developer machine and your CI environment and invoke the transcription job on your local machine.

## Architecture diagram

The following diagram shows the architecture that this sample application builds and deploys:

![Architecture diagram for Serverless Transcription Application](./images/architecture-diagram.png)

We are using the following AWS services to build our infrastructure:

- [Lambda](https://docs.localstack.cloud/user-guide/aws/lambda/) to serve the frontend and process the audio file.
- [Transcribe](https://docs.localstack.cloud/user-guide/aws/transcribe/) to convert the audio file into a transcription JSON file.
- [S3](https://docs.localstack.cloud/user-guide/aws/s3/) to store the audio file and the transcription JSON file.
- [SES](https://docs.localstack.cloud/user-guide/aws/ses/) to send an email notification to the end user.

### Prerequisites

- LocalStack Pro with the [`localstack` CLI](https://docs.localstack.cloud/getting-started/installation/#localstack-cli).
- [AWS CLI](https://docs.localstack.cloud/user-guide/integrations/aws-cli/) with the [`awslocal` wrapper](https://docs.localstack.cloud/user-guide/integrations/aws-cli/#localstack-aws-cli-awslocal).
- [Serverless Framework](https://www.npmjs.com/package/serverless) with [Serverless LocalStack Plugin](https://www.npmjs.com/package/serverless-localstack) and [Serverless Lift Plugin](https://www.npmjs.com/package/serverless-lift)
- [Node.js](https://nodejs.org/en/download/) with `npm` package manager.

Start LocalStack Pro with the `LOCALSTACK_API_KEY` pre-configured:

```shell
export LOCALSTACK_API_KEY=<your-api-key>
localstack start
```

> If you prefer running LocalStack in detached mode, you can add the `-d` flag to the `localstack start` command, and use Docker Desktop to view the logs.

## Instructions

You can build and deploy the sample application on LocalStack by running our `Makefile` commands. Run `make deploy` to create the infrastructure on LocalStack. Run `make stop` to delete the infrastructure by stopping LocalStack.

Alternatively, here are instructions to deploy it manually step-by-step.

### Install the dependencies

We use the [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/) to deploy the sample application. Install the Serverless Framework and other dependencies by running the following commands:

```shell
npm install -g serverless
npm install
```

### Deploy the infrastructure

We will use the `serverless deploy` command to deploy the infrastructure. This command will create the required resources on LocalStack. Run the following command to deploy the infrastructure:

```shell
sls deploy --stage local --verbose
```

> The `--stage` flag is specified to deploy the infrastructure to the `local` stage. It sets up Serverless to use the LocalStack plugin but only for the stage `local` to deploy the infrastructure to LocalStack only.

After a few seconds, the infrastructure should be deployed successfully. 
You will find a `LocalStackSampleAppEndpoint` URL specified in the output. This URL is the endpoint for the frontend application and should look similar to: `https://vmvs1am212p.execute-api.localhost.localstack.cloud:4566/local/upload`.

Next, we need to create configurations for CORS settings for our S3 bucket and verification for SES:

```shell
awslocal s3api put-bucket-cors --bucket aws-node-sample-transcribe-s3-local-records  --cors-configuration file://etc/cors.json
awslocal s3api put-bucket-cors --bucket aws-node-sample-transcribe-s3-local-transcriptions  --cors-configuration file://etc/cors.json
awslocal ses verify-email-identity --email-address sender@example.com
```

### Testing the application

Navigate to the `LocalStackSampleAppEndpoint` URL specified in the output of the `sls deploy` command. 
When accessing the webpage the first time, it will take a few seconds to load.
You should see a web page similar to the following:

![Web interface showing the upload audio file page](./images/upload.png)

Click on the **Upload** button to upload a file. You can choose one of the files from the `sample-audio-files` folder, which will then be uploaded to the designated S3 bucket (`aws-node-sample-transcribe-s3-local-records`). 

> Note: The upload will take a few seconds for the first time, subsequent uploads will be faster, because the Lambda is already warm. 

Allow the Lambda function (`aws-node-sample-transcribe-s3-local-transcribe`) to process the uploaded file. 
The Lambda function will create a transcription job with the record uploaded in the previous step and push the resulting output JSON file to an S3 bucket (`aws-node-sample-transcribe-s3-local-transcriptions`).

Upon completion of the file processing, the user interface will display the transcription output. 
Click the **List all jobs** button to view it.
You might need to reload the page, if it is not visible yet.

![Web interface showing the List transcripted files page](./images/list.png)

The transcription can be downloaded by selecting the **jobname.json** hyperlink. 
To verify that the email has been sent correctly, use the internal LocalStack SES endpoint at `http://localhost.localstack.cloud:4566/_aws/ses`.

### Using SMTP Integration

LocalStack Pro supports [sending messages through an SMTP email server](https://docs.localstack.cloud/user-guide/aws/ses/#smtp-integration).
To test this feature, you could use a mock SMTP server, like [smtp4dev](https://github.com/rnwood/smtp4dev) or [Papercut SMTP](https://github.com/ChangemakerStudios/Papercut-SMTP) to receive the email notifications locally.

For example, when using `smpt4dev` start the SMTP server using:

```shell
docker run --rm -it -p 3000:80 -p 2525:25 rnwood/smtp4dev
```

You can then access the web interface on `http://localhost:3000` where you will see any incoming messages.
Then start LocalStack with the `SMTP_HOST` environment variable, pointing to the host and port where the SMTP server is reachable:

```shell
export LOCALSTACK_API_KEY=<your-api-key>
SMTP_HOST=host.docker.internal:2525 localstack start
```

> If you are using a real SMTP server, you will also need to set the env for `SMTP_USER` and `SMTP_PASS`).

Following the instructions of the deployment above. The emails will show up in the web UI.


### GitHub Actions

This application sample hosts an example GitHub Action workflow that starts up LocalStack, builds the Lambda functions, and deploys the infrastructure on the runner. You can find the workflow in the `.github/workflows/main.yml` file. To run the workflow, you can fork this repository and push a commit to the `main` branch.

Users can adapt this example workflow to run in their own CI environment. LocalStack supports various CI environments, including GitHub Actions, CircleCI, Jenkins, Travis CI, and more. You can find more information about the CI integration in the [LocalStack documentation](https://docs.localstack.cloud/user-guide/ci/).

## Contributing

We appreciate your interest in contributing to our project and are always looking for new ways to improve the developer experience. We welcome feedback, bug reports, and even feature ideas from the community.
Please refer to the [contributing file](CONTRIBUTING.md) for more details on how to get started. 
