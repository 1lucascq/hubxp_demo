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

import { CategoryService } from './category.service';
import { CreateCategoryDto, ResponseCategoryDto } from './dto/category.dto';
import { MongoIdValidationPipe } from '../common/pipes/mongoId.pipe';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() category: CreateCategoryDto): Promise<ResponseCategoryDto> {
        return this.categoryService.create(category);
    }

    @Post('bulk')
    @HttpCode(HttpStatus.CREATED)
    async createMany(@Body() categories: CreateCategoryDto[]): Promise<ResponseCategoryDto[]> {
        return this.categoryService.createMany(categories);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<ResponseCategoryDto[]> {
        return this.categoryService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id', MongoIdValidationPipe) id: string): Promise<ResponseCategoryDto> {
        return this.categoryService.findById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateCategory(
        @Param('id', MongoIdValidationPipe) id: string,
        @Body() categoryDto: CreateCategoryDto,
    ): Promise<ResponseCategoryDto> {
        return this.categoryService.updateCategory(id, categoryDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteCategory(@Param('id', MongoIdValidationPipe) id: string): Promise<ResponseCategoryDto> {
        return this.categoryService.deleteCategory(id);
    }
}
