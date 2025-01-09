import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PipelineStage } from 'mongoose';
import { Order } from '../order/schemas/order.schema';
import { DashboardFilterDto, ResponseDashboardDto } from './dto/dashboard.dto';
import { Product } from 'src/product/schemas/product.schema';
import { Category } from 'src/category/schemas/category.schema';

export interface DashboardOrderItem {
    _id: Types.ObjectId | string;
    date: Date;
    total: number;
    productDetails: Product[];
    categoryDetails: Category[];
}

export interface DashboardAggregationResult {
    _id: null;
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
}

@Injectable()
export class DashboardService {
    constructor(@InjectModel(Order.name) private readonly orderModel: Model<Order>) {}

    private addProductLookup(): PipelineStage[] {
        return [
            {
                $lookup: {
                    from: 'products',
                    localField: 'products',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            {
                $unwind: {
                    path: '$productDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'productDetails.categories',
                    foreignField: '_id',
                    as: 'categoryDetails',
                },
            },
            {
                $unwind: {
                    path: '$categoryDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    date: { $first: '$date' },
                    total: { $first: '$total' },
                    productDetails: { $push: '$productDetails' },
                    categoryDetails: { $push: '$categoryDetails' },
                },
            },
        ];
    }

    private filterByDateRange(startDate?: string): PipelineStage[] {
        if (!startDate) return [];

        const dateFilter: any = {};

        if (startDate) {
            dateFilter.$gte = new Date(startDate);
        }

        return [
            {
                $match: {
                    date: dateFilter,
                },
            },
        ];
    }

    private filterByProduct(productId?: string): PipelineStage[] {
        if (!productId) return [];

        return [
            {
                $match: {
                    productDetails: {
                        $elemMatch: { _id: new Types.ObjectId(productId) },
                    },
                },
            },
        ];
    }

    private filterByCategory(categoryId?: string): PipelineStage[] {
        if (!categoryId) return [];

        return [
            {
                $match: {
                    categoryDetails: {
                        $elemMatch: { _id: new Types.ObjectId(categoryId) },
                    },
                },
            },
        ];
    }

    private addGroupStage(): PipelineStage[] {
        return [
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$total' },
                    averageOrderValue: { $avg: '$total' },
                    orders: { $push: '$$ROOT' },
                },
            },
        ];
    }

    private getResponseDashboard(): ResponseDashboardDto {
        return {
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
        };
    }

    async getDashboardData(filters?: DashboardFilterDto): Promise<ResponseDashboardDto> {
        const pipeline: PipelineStage[] = [];

        if (filters?.fromDate) {
            pipeline.push(...this.filterByDateRange(filters.fromDate));
        }

        pipeline.push(...this.addProductLookup());

        if (filters?.productId) {
            pipeline.push(...this.filterByProduct(filters.productId));
        }

        if (filters?.categoryId) {
            pipeline.push(...this.filterByCategory(filters.categoryId));
        }

        pipeline.push(...this.addGroupStage());

        const [result] = await this.orderModel.aggregate(pipeline).exec();

        return result
            ? {
                  totalOrders: result.totalOrders,
                  totalRevenue: result.totalRevenue,
                  averageOrderValue: result.averageOrderValue,
              }
            : this.getResponseDashboard();
    }
}
