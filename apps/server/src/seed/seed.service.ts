import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/product/schemas/product.schema';
import { Model } from 'mongoose';
import { Category } from 'src/category/schemas/category.schema';
import { Order } from 'src/order/schemas/order.schema';

@Injectable()
export class SeedService {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>,
        @InjectModel(Category.name)
        private readonly categoryModel: Model<Category>,
        @InjectModel(Order.name)
        private readonly orderModel: Model<Order>,
    ) {}

    async runSeed() {
        const session = await this.categoryModel.db.startSession();
        session.startTransaction();

        try {
            await Promise.all([
                this.productModel.deleteMany({}, { session }),
                this.categoryModel.deleteMany({}, { session }),
                this.orderModel.deleteMany({}, { session }),
            ]);

            const categories = await this.categoryModel.create(
                [{ name: 'Electronics' }, { name: 'Clothing' }, { name: 'Home Appliances' }],
                { session },
            );

            const products = await this.productModel.create(
                [
                    {
                        name: 'Smartphone',
                        description: 'Latest model',
                        price: 1000,
                        categories: [categories[0]._id],
                        imageUrl: 'https://fake-url.com/smartphone.jpg',
                    },
                    {
                        name: 'T-Shirt',
                        description: 'Cotton t-shirt',
                        price: 30,
                        categories: [categories[1]._id],
                        imageUrl: 'https://fake-url.com/tshirt.jpg',
                    },
                    {
                        name: 'Microwave',
                        description: 'Kitchen appliance',
                        price: 150,
                        categories: [categories[2]._id],
                        imageUrl: 'https://fake-url.com/microwave.jpg',
                    },
                ],
                { session },
            );

            await Promise.all(
                products.map((product) =>
                    this.categoryModel.updateMany(
                        { _id: { $in: product.categories } },
                        { $push: { products: product._id } },
                        { session },
                    ),
                ),
            );

            await this.orderModel.create(
                [
                    {
                        date: new Date(),
                        productIds: [products[0]._id],
                        total: 1000,
                    },
                    {
                        date: new Date(),
                        productIds: [products[1]._id, products[2]._id],
                        total: 180,
                    },
                ],
                { session },
            );

            await session.commitTransaction();
            console.log('Seed data populated successfully!');
        } catch (error) {
            await session.abortTransaction();
            console.error('Failed to seed database:', error);
        } finally {
            session.endSession();
        }
    }
}
