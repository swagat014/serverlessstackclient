const config = {
    
    MAX_ATTACHMENT_SIZE: 5000000,

    s3: {
        REGION: "us-east-1", // Ensure the region is correct for your S3 bucket
        BUCKET: "notes-api-uploads", // Ensure this matches your S3 bucket name
    },
    apiGateway: {
        REGION: "us-east-1", // Ensure the region matches your API Gateway region
        URL: "https://f0jqytcvk2.execute-api.us-east-1.amazonaws.com/prod", // Ensure this is the correct API Gateway endpoint URL
    },
    cognito: {
        REGION: "us-east-1", // Ensure the region matches your Cognito setup
        USER_POOL_ID: "us-east-1_sdvsDmFvv", // Ensure this is your actual User Pool ID
        APP_CLIENT_ID: "4b01bncsafru52jdeoievq1ois", // Ensure this is your actual App Client ID
        IDENTITY_POOL_ID: "us-east-1:201046d8-ed52-4eda-bdb3-1b0bfdd10b4e", // Ensure this is your actual Identity Pool ID
    },
};

export default config;
