export AWS_ACCESS_KEY_ID ?= test
export AWS_SECRET_ACCESS_KEY ?= test
export AWS_DEFAULT_REGION=us-east-1
SHELL := /bin/bash

## Show this help
usage:
		@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

## Install dependencies
install:
		@which localstack || pip install localstack
		@which awslocal || pip install awscli-local
		@which serverless || npm install -g serverless
		npm install

## Deploy the Transcribe sample
deploy:
	sls deploy --stage local --verbose
	make configure

## adds configuration for cors and ses
configure:    
	awslocal s3api put-bucket-cors --bucket aws-node-sample-transcribe-s3-local-records  --cors-configuration file://etc/cors.json
	awslocal s3api put-bucket-cors --bucket aws-node-sample-transcribe-s3-local-transcriptions  --cors-configuration file://etc/cors.json
	awslocal ses verify-email-identity --email-address sender@example.com

## Start LocalStack in detached mode
start:
	localstack start -d

## Stop the Running LocalStack container
stop:
	@echo
	localstack stop

## Make sure the LocalStack container is up
ready:
	@echo Waiting on the LocalStack container...
	@localstack wait -t 30 && echo LocalStack is ready to use! || (echo Gave up waiting on LocalStack, exiting. && exit 1)

## Save the logs in a separate file, since the LS container will only contain the logs of the last sample run.
logs:
	@localstack logs > logs.txt

.PHONY: usage install deploy configure start stop ready logs
