import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto, ResponseOrderDto, UpdateOrderDto } from './dto/order.dto';
import { Product } from 'src/product/schemas/product.schema';
// import * as AWS from 'aws-sdk';

@Injectable()
export class OrderService {
    // private readonly lambda: AWS.Lambda;

    constructor(
        @InjectModel(Order.name)
        private readonly orderModel: Model<Order>,
    ) {
        // AWS.config.update({
        //     region: 'us-east-1',
        // });
        // this.lambda = new AWS.Lambda({
        //     endpoint: 'http://localhost:3004',
        // });
    }

    private getResponseOrderDto(order: Order): ResponseOrderDto {
        let products: { _id: string; name: string; price: number }[];
        if (order.products?.length > 0) {
            products = order.products.map((product) => ({
                _id: product._id.toString(),
                name: product.name,
                price: product.price,
            }));
        } else {
            products = [];
        }

        return {
            _id: order._id.toString(),
            date: order.date,
            products: products,
            total: order.total,
        };
    }

    async create(orderDto: CreateOrderDto): Promise<ResponseOrderDto> {
        const createdOrder = await new this.orderModel(orderDto).populate({
            path: 'products',
            model: Product.name,
            select: 'name price',
        });
        createdOrder.save();

        // await this.lambda
        //     .invoke({
        //         FunctionName: 'sales-report-lambda-dev-sendNotification',
        //         Payload: JSON.stringify({
        //             orderId: createdOrder._id.toString(),
        //             message: 'A new order has been created.',
        //         }),
        //     })
        //     .promise();

        return this.getResponseOrderDto(createdOrder);
    }

    async findAll(): Promise<ResponseOrderDto[]> {
        const orders = await this.orderModel
            .find()
            .populate({
                path: 'products',
                model: Product.name,
                select: 'name price',
            })
            .lean()
            .exec();

        return orders.map((order) => this.getResponseOrderDto(order));
    }

    async findById(id: string): Promise<ResponseOrderDto> {
        const order = await this.orderModel
            .findById(id)
            .populate({
                path: 'products',
                model: Product.name,
                select: 'name price',
            })
            .lean()
            .exec();

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        return this.getResponseOrderDto(order);
    }

    async updateOrder(id: string, orderDto: UpdateOrderDto): Promise<ResponseOrderDto> {
        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(id, orderDto, { new: true })
            .populate({
                path: 'products',
                model: Product.name,
                select: 'name price',
            })
            .exec();

        if (!updatedOrder) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        return this.getResponseOrderDto(updatedOrder);
    }

    async deleteOrder(id: string): Promise<ResponseOrderDto> {
        const deletedOrder = await this.orderModel
            .findByIdAndDelete(id)
            .populate({
                path: 'products',
                model: Product.name,
                select: 'name price',
            })
            .exec();

        if (!deletedOrder) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        return this.getResponseOrderDto(deletedOrder);
    }
}
