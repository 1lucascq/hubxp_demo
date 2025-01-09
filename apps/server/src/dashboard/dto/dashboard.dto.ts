import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class DashboardFilterDto {
    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsString()
    productId?: string;

    @IsOptional()
    @IsDateString()
    fromDate?: string;
}

export class ResponseDashboardDto {
    @Expose()
    totalOrders: number;

    @Expose()
    totalRevenue: number;

    @Expose()
    averageOrderValue: number;

}
