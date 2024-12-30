const config = {
    
    MAX_ATTACHMENT_SIZE: 50000000,

    s3: {
        REGION: "us-east-1", // Ensure the region is correct for your S3 bucket
        BUCKET: "note-api-uploads", // Ensure this matches your S3 bucket name
    },
    apiGateway: {
        REGION: "us-east-1", // Ensure the region matches your API Gateway region
        URL: "https://je1eb2dpf5.execute-api.us-east-1.amazonaws.com/dev", // Ensure this is the correct API Gateway endpoint URL
    },
    cognito: {
        REGION: "us-east-1", // Ensure the region matches your Cognito setup
        USER_POOL_ID: "us-east-1_nYAHK7oOC", // Ensure this is your actual User Pool ID
        APP_CLIENT_ID: "3cmhsef0nciiij89bd7etuka0p", // Ensure this is your actual App Client ID
        IDENTITY_POOL_ID: "us-east-1:896b0402-2679-4b18-9493-64ded0c7871a", // Ensure this is your actual Identity Pool ID
    },
};

export default config;
