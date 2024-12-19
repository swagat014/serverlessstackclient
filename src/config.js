const config = {
    s3: {
        REGION: "us-eat-1",
        BUCKET: "notes-api-uploads",
    },
    apiGateway: {
        REGION: "us-east-1",
        URL: "https://f0jqytcvk2.execute-api.us-east-1.amazonaws.com/prod",
    },
    cognito: {
        REGION: "us-east-1",
        USER_POOL_ID: "us-east-1_sdvsDmFvv",
        APP_CLIENT_ID: "4b01bncsafru52jdeoievq1ois",
        IDENTITY_POOL_ID: "us-east-1:201046d8-ed52-4eda-bdb3-1b0bfdd10b4e",
    },
};
export default config;
