import { APIGatewayProxyHandler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DashboardService } from 'src/dashboard/dashboard.service';

let dashboardService: DashboardService;

const bootstrap = async () => {
    if (!dashboardService) {
        const app = await NestFactory.createApplicationContext(AppModule);
        dashboardService = app.get(DashboardService);
    }
};

export const salesReport: APIGatewayProxyHandler = async (event, context) => {
    await bootstrap();

    try {
        const reportData = await dashboardService.getDashboardData();
        const report = {
            timestamp: new Date().toISOString(),
            report: reportData,
        };

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Sales report generated successfully',
                report,
            }),
        };
    } catch (error) {
        console.error('Error processing sales report:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An error occurred while processing the sales report.',
                error: error.message,
            }),
        };
    }
};
