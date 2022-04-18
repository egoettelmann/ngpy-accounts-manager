#!/bin/bash

# Exit when any command fails
set -e

########################
# Variables
########################

# Loading variables from '.env' file
source ./.scripts/dotenv-shell-loader.sh
dotenv

# Defining base path for AWS files
basepath="./.aws"

########################
# Documentation
########################
usage() {
  echo "$(basename "$0") [COMMAND] -- performs admin operations on AWS

     Following commands are supported:
         -h|--help          show this help text
         iam                update IAM policies required by the CI job
         cloudformation     deploy the Cloudformation template

     "
}

########################
# Functions
########################

# List the 'non-default' versions of a policy
iam-list-versions() {
  aws iam list-policy-versions \
    --query "Versions[?@.IsDefaultVersion == \`false\`].VersionId" \
    --policy-arn $1 \
    --output text
}

# Update the IAM roles
update_iam() {
  echo "Updating policy for Release: NgPyAccountsManagerRelease"
  RELEASE_POLICY=$(envsubst < "${basepath}/iam/NgPyAccountsManagerRelease.json")
  RELEASE_POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/NgPyAccountsManagerRelease"
  echo " - deleting unused versions"
  iam-list-versions "${RELEASE_POLICY_ARN}" | xargs -n 1 -I{} aws iam delete-policy-version --policy-arn "${RELEASE_POLICY_ARN}" --version-id {}
  echo " - creating new version"
  aws iam create-policy-version \
    --policy-arn "${RELEASE_POLICY_ARN}" \
    --policy-document "${RELEASE_POLICY}" \
    --set-as-default

  echo "Updating policy for Deploy: NgPyAccountsManagerDeploy"
  DEPLOY_POLICY=$(envsubst < "${basepath}/iam/NgPyAccountsManagerDeploy.json")
  DEPLOY_POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/NgPyAccountsManagerDeploy"
  echo " - deleting unused versions"
  iam-list-versions "${DEPLOY_POLICY_ARN}" | xargs -n 1 -I{} aws iam delete-policy-version --policy-arn "${DEPLOY_POLICY_ARN}" --version-id {}
  echo " - creating new version"
  aws iam create-policy-version \
    --policy-arn "${DEPLOY_POLICY_ARN}" \
    --policy-document "${DEPLOY_POLICY}" \
    --set-as-default
}

# Update the cloudformation template
update_cloudformation() {
  echo "Deploying CloudFormation template"
  aws cloudformation deploy \
    --stack-name NgPyAccountsManager \
    --template-file ./.aws/cloudformation.yaml \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
      AppName=NgPyAccountsManager \
      ArtifactsBucket="${ARTIFACTS_BUCKET}" \
      WebBucket="${WEB_BUCKET}" \
      LambdaImage="${LAMBDA_IMAGE}" \
      EnvironmentProfile="${ENV_PROFILE}" \
      SessionSecretKey="${SESSION_SECRET_KEY}" \
      DomainNameApi="${DOMAIN_NAME_API}" \
      DomainNameUi="${DOMAIN_NAME_UI}" \
      HostedZoneId="${HOSTED_ZONE_ID}" \
      CertificateArn="${CERTIFICATE_ARN}" \
      DBUsername="${DATABASE_USERNAME}" \
      DBPassword="${DATABASE_PASSWORD}" \
    || exit
  echo "CloudFormation template deployed"
}


########################
# Main process
########################

# Loop through arguments and process them
case "$1" in
    -h|--help)
    usage # Displaying help message
    exit 0
    ;;
    iam)
    update_iam
    exit 0
    ;;
    cloudformation)
    update_cloudformation
    exit 0
    ;;
    *)
    echo "Unknown command"
    exit 0
    ;;
esac
