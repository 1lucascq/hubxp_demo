import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';
import { OrderModule } from '../order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/product/schemas/product.schema';
import { Category, CategorySchema } from 'src/category/schemas/category.schema';
import { Order, OrderSchema } from 'src/order/schemas/order.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: Category.name, schema: CategorySchema },
            { name: Order.name, schema: OrderSchema },
        ]),
        ProductModule,
        CategoryModule,
        OrderModule,
    ],
    providers: [SeedService],
})
export class SeedModule {}
