import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './schemas/category.schema';
import { Product, ProductSchema } from 'src/product/schemas/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
            { name: Product.name, schema: ProductSchema },
        ]),
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService],
})
export class CategoryModule {}
