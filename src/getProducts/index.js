const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDBClient = new DynamoDBClient({ region: "us-east-1" });
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);
const tableName = process.env.PRODUCTS_TABLE_NAME; 

const scanDynamoDB = async (tableName) => {
  try {
    const params = {
      TableName: tableName,
    };

    const command = new ScanCommand(params);
    const result = await documentClient.send(command);

    console.log("Data retrieved successfully:", result);
    return result.Items;
  } catch (error) {
    console.error("Error scanning DynamoDB table:", error);
    throw error;
  }
};

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  try {
    const items = await scanDynamoDB(tableName);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data retrieved successfully!",
        items,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to retrieve data from DynamoDB.",
        error: error.message,
      }),
    };
  }
};
