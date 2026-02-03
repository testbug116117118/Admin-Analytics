const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.logActivity = async (event) => {
  try {
    // Extract user info and query params
    const userId = event.headers['x-user-id'] || 'anonymous';
    const query = event.queryStringParameters.query || '';
    const timestamp = new Date().toISOString();
    
    // Log to DynamoDB for later analysis
    await dynamodb.put({
      TableName: 'UserActivityLogs',
      Item: {
        logId: `${userId}-${Date.now()}`,
        userId: userId,
        query: query,
        timestamp: timestamp
      }
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Activity logged' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to log activity' })
    };
  }
};
