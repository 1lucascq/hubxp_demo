import { APIGatewayProxyHandler } from 'aws-lambda';

export const sendNotification: APIGatewayProxyHandler = async (event) => {
    const { orderId, message } = JSON.parse(event.body);

    console.log(`Sending notification for order ${orderId}: ${message}`);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Notification sent successfully',
        }),
    };
};
