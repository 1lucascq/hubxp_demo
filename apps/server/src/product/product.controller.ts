import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    HttpCode,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, ResponseProducteDto } from './dto/product.dto';
import { MongoIdValidationPipe } from '../common/pipes/mongoId.pipe';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() productDto: CreateProductDto): Promise<ResponseProducteDto> {
        return this.productService.create(productDto);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createMany(@Body() productsDto: CreateProductDto[]): Promise<ResponseProducteDto[]> {
        return this.productService.createMany(productsDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<ResponseProducteDto[]> {
        return this.productService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id', MongoIdValidationPipe) id: string): Promise<ResponseProducteDto> {
        return this.productService.findById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateProduct(
        @Param('id', MongoIdValidationPipe) id: string,
        @Body() productDto: UpdateProductDto,
    ): Promise<ResponseProducteDto> {
        return this.productService.updateProduct(id, productDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteProduct(@Param('id', MongoIdValidationPipe) id: string): Promise<ResponseProducteDto> {
        return this.productService.deleteProduct(id);
    }
}
