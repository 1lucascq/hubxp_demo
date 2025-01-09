import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { OrderService } from './order.service';
import { CreateOrderDto, ResponseOrderDto, UpdateOrderDto } from './dto/order.dto';
import { MongoIdValidationPipe } from '../common/pipes/mongoId.pipe';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    create(@Body() orderDto: CreateOrderDto): Promise<ResponseOrderDto> {
        return this.orderService.create(orderDto);
    }

    @Get()
    findAll(): Promise<ResponseOrderDto[]> {
        return this.orderService.findAll();
    }

    @Get(':id')
    findById(@Param('id', MongoIdValidationPipe) id: string): Promise<ResponseOrderDto> {
        return this.orderService.findById(id);
    }

    @Put(':id')
    updateOrder(@Param('id', MongoIdValidationPipe) id: string, @Body() orderDto: UpdateOrderDto): Promise<ResponseOrderDto> {
        return this.orderService.updateOrder(id, orderDto);
    }

    @Delete(':id')
    deleteOrder(@Param('id', MongoIdValidationPipe) id: string): Promise<ResponseOrderDto> {
        return this.orderService.deleteOrder(id);
    }
}
