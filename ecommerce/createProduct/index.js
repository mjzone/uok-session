const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDBClient = new DynamoDBClient({ region: "us-east-1" });
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);
const tableName = process.env.PRODUCTS_TABLE_NAME;

const writeToDynamoDB = async (tableName, item) => {
  try {
    const params = {
      TableName: tableName,
      Item: item,
    };
    const command = new PutCommand(params);
    const result = await documentClient.send(command);

    console.log("Data written successfully:", result);
    return result;
  } catch (error) {
    console.error("Error writing data to DynamoDB:", error);
    throw error;
  }
};

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));
  
  let product = JSON.parse(event.body);
  try {
    const result = await writeToDynamoDB(tableName, product);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data written successfully!",
        result,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to write data to DynamoDB.",
        error: error.message,
      }),
    };
  }
};
