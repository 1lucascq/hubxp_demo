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

    async runSeed(retries = 5) {
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
                        name: 'Cell phone',
                        description: 'Latest model',
                        price: 1000,
                        categories: [categories[0]._id],
                        imageUrl: 'https://img.olx.com.br/images/93/934828117788589.jpg',
                    },
                    {
                        name: 'T-Shirt',
                        description: 'Cotton t-shirt',
                        price: 30,
                        categories: [categories[1]._id],
                        imageUrl:
                            'https://colorfulstandard.com/cdn/shop/files/CS2056_Female_OversizedOrganicT-Shirt-MarineBlue_1.jpg?v=1702562308&width=2048',
                    },
                    {
                        name: 'Microwave',
                        description: 'Kitchen appliance',
                        price: 150,
                        categories: [categories[2]._id],
                        imageUrl:
                            'https://res.cloudinary.com/sharp-consumer-eu/image/fetch/w_3000,f_auto/https://s3.infra.brandquad.io/accounts-media/SHRP/DAM/origin/05023154-b723-11ec-9abf-eecbf35dfbeb.jpg',
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
                        products: [products[0]._id],
                        total: 1000,
                    },
                    {
                        date: new Date(),
                        products: [products[1]._id, products[2]._id],
                        total: 180,
                    },
                    {
                        date: new Date(),
                        products: [products[0]._id, products[1]._id, products[2]._id],
                        total: 1180,
                    },
                ],
                { session },
            );

            await session.commitTransaction();
        } catch (error) {
            console.error('Failed to seed database:', error);
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            if (retries > 0) {
                console.log(`Retrying... (${retries} retries left)`);
                await new Promise((resolve) => setTimeout(resolve, 5000));
                await this.runSeed(retries - 1);
            } else {
                console.error('Max retries reached. Seed failed.');
            }
        } finally {
            session.endSession();
        }
    }
}
