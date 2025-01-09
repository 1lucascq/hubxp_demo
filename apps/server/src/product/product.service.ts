import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto, ResponseProducteDto, UpdateProductDto } from './dto/product.dto';
import { Category } from 'src/category/schemas/category.schema';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>,
        @InjectModel(Category.name)
        private readonly categoryModel: Model<Category>,
    ) {}

    private getCategoryDiff(existingProduct: Product, productDto: UpdateProductDto): [string[], string[]] {
        const oldCategories = existingProduct.categories.map((category) => category.toString());
        const newCategories = productDto.categories.map((category) => category.toString());
        const categoriesToRemove = oldCategories.filter((category) => !newCategories.includes(category));
        const categoriesToAdd = newCategories.filter((category) => !oldCategories.includes(category));
        return [categoriesToRemove, categoriesToAdd];
    }

    private async findProductByIdOrFail(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    private async validateCategories(categoryIds: string[]): Promise<void> {
        const categories = await this.categoryModel.find({ _id: { $in: categoryIds } }).exec();

        if (categories.length !== categoryIds.length) {
            const foundIds = categories.map((category) => category._id.toString());
            const invalidIds = categoryIds.filter((id) => !foundIds.includes(id));
            throw new BadRequestException(`Invalid category IDs: ${invalidIds.join(', ')}`);
        }
    }

    private getResponseProductDto(product: Product): ResponseProducteDto {
        let categories: { _id: string; name: string }[];
        if (product.categories.length > 0) {
            categories = product.categories.map((category) => ({
                _id: category._id.toString(),
                name: category.name,
            }));
        } else {
            categories = [];
        }

        const responseCategoryDto = {
            _id: product._id.toString(),
            name: product.name,
            categories: categories,
            price: product.price,
            description: product.description,
            imageUrl: product.imageUrl,
        };

        return responseCategoryDto;
    }

    async create(productDto: CreateProductDto): Promise<ResponseProducteDto> {
        await this.validateCategories(productDto.categories);
        const session = await this.productModel.db.startSession();
        session.startTransaction();

        try {
            const newProduct = await new this.productModel(productDto).populate({
                path: 'categories',
                model: Category.name,
                select: 'name',
            });

            const createdProduct = await newProduct.save({ session });

            await this.categoryModel.updateMany(
                { _id: { $in: productDto.categories } },
                { $push: { products: createdProduct._id } },
                { session },
            );

            await session.commitTransaction();
            return this.getResponseProductDto(createdProduct);
        } catch (error) {
            await session.abortTransaction();
            throw new Error(`Failed to create product: ${error.message}`);
        } finally {
            session.endSession();
        }
    }

    async createMany(productsDto: CreateProductDto[]): Promise<ResponseProducteDto[]> {
        await Promise.all(productsDto.map((product) => this.validateCategories(product.categories)));
        const session = await this.productModel.db.startSession();
        session.startTransaction();

        try {
            const createdProducts = await this.productModel.create(productsDto, { session });

            const categoryUpdates = createdProducts.flatMap((product) =>
                product.categories.map((categoryId) =>
                    this.categoryModel.updateMany({ _id: categoryId }, { $push: { products: product._id } }, { session }),
                ),
            );

            await Promise.all(categoryUpdates);

            const populated = await Promise.all(
                createdProducts.map((product) =>
                    product.populate({
                        path: 'categories',
                        model: Category.name,
                        select: 'name',
                    }),
                ),
            );

            await session.commitTransaction();
            return populated.map((product) => this.getResponseProductDto(product));
        } catch (error) {
            await session.abortTransaction();
            throw new Error(`Failed to create products: ${error.message}`);
        } finally {
            session.endSession();
        }
    }

    async findAll(): Promise<ResponseProducteDto[]> {
        const products = await this.productModel
            .find()
            .populate({
                path: 'categories',
                model: Category.name,
                select: 'name',
            })
            .lean()
            .exec();

        return products.map((product) => this.getResponseProductDto(product));
    }

    async findById(id: string): Promise<ResponseProducteDto> {
        const product = await this.productModel
            .findById(id)
            .populate({
                path: 'categories',
                model: Category.name,
                select: 'name',
            })
            .lean()
            .exec();

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return this.getResponseProductDto(product);
    }

    async updateProduct(id: string, productDto: UpdateProductDto): Promise<ResponseProducteDto> {
        const session = await this.productModel.db.startSession();
        session.startTransaction();

        try {
            const existingProduct = await this.findProductByIdOrFail(id);

            if (productDto.categories?.length) {
                await this.validateCategories(productDto.categories);

                const [categoriesToRemove, categoriesToAdd] = this.getCategoryDiff(existingProduct, productDto);
                if (categoriesToRemove.length > 0) {
                    await this.categoryModel.updateMany(
                        { _id: { $in: categoriesToRemove } },
                        { $pull: { products: existingProduct._id } },
                        { session },
                    );
                }

                if (categoriesToAdd.length > 0) {
                    await this.categoryModel.updateMany(
                        { _id: { $in: categoriesToAdd } },
                        { $push: { products: existingProduct._id } },
                        { session },
                    );
                }
            }
            const updatedProduct = await this.productModel
                .findByIdAndUpdate(id, productDto, { new: true, session })
                .populate({
                    path: 'categories',
                    model: Category.name,
                    select: 'name',
                })
                .exec();

            await session.commitTransaction();
            return this.getResponseProductDto(updatedProduct);
        } catch (error) {
            await session.abortTransaction();
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update product: ${error.message}`);
        } finally {
            session.endSession();
        }
    }

    async deleteProduct(id: string): Promise<ResponseProducteDto> {
        const session = await this.productModel.db.startSession();
        session.startTransaction();

        try {
            const deletedProduct = await this.productModel
                .findByIdAndDelete(id)
                .session(session)
                .populate({ path: 'categories', model: Category.name, select: 'name' })
                .exec();

            if (!deletedProduct) {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }

            await this.categoryModel.updateMany(
                { _id: { $in: deletedProduct.categories } },
                { $pull: { products: deletedProduct._id } },
                { session },
            );

            await session.commitTransaction();

            return this.getResponseProductDto(deletedProduct);
        } catch (error) {
            await session.abortTransaction();
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete product: ${error.message}`);
        } finally {
            session.endSession();
        }
    }
}
