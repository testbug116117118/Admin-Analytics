const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Verify admin authorization
  if (!event.headers.authorization || 
      !verifyAdminToken(event.headers.authorization)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    const date = event.queryStringParameters.date || new Date().toISOString().split('T')[0];
    const startTime = `${date}T00:00:00.000Z`;
    const endTime = `${date}T23:59:59.999Z`;
    
    const params = {
      TableName: 'UserActivityLogs',
      FilterExpression: 'timestamp BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':start': startTime,
        ':end': endTime
      }
    };
    
    const result = await dynamodb.scan(params).promise();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ logs: result.Items })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve logs' })
    };
  }
};

function verifyAdminToken(token) {
  // In a real app, this would verify the JWT token
  // For the challenge, we're simplifying this
  return token.startsWith('AdminToken');
}
