import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { ClientSession, Model } from 'mongoose';
import { CreateCategoryDto, ResponseCategoryDto } from './dto/category.dto';
import { Product } from 'src/product/schemas/product.schema';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name)
        private readonly categoryModel: Model<Category>,
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>,
    ) {}

    private getResponseCategoryDto(category: Category): ResponseCategoryDto {
        let products: { _id: string; name: string }[];
        if (category.products.length > 0) {
            products = category.products.map((product) => ({
                _id: product._id.toString(),
                name: product.name,
            }));
        } else {
            products = [];
        }

        const responseCategoryDto = {
            _id: category._id.toString(),
            name: category.name,
            products: products,
        };

        return responseCategoryDto;
    }

    private async findCategoryByIdOrFail(id: string, session?: ClientSession): Promise<Category> {
        const category = await this.categoryModel.findById(id).session(session).exec();
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }

    async create(categoryDto: CreateCategoryDto): Promise<ResponseCategoryDto> {
        const createdCategory = await this.categoryModel.create(categoryDto);
        return this.getResponseCategoryDto(createdCategory);
    }

    async createMany(categoriesDto: CreateCategoryDto[]): Promise<ResponseCategoryDto[]> {
        const session = await this.categoryModel.db.startSession();
        session.startTransaction();
        try {
            const createdCategories = await this.categoryModel.create([...categoriesDto], { session });
            await session.commitTransaction();

            return createdCategories.map((category) => this.getResponseCategoryDto(category));
        } catch (error) {
            await session.abortTransaction();
            throw new Error(`Failed to create categories: ${error.message}`);
        } finally {
            session.endSession();
        }
    }

    async findAll(): Promise<ResponseCategoryDto[]> {
        const categories = await this.categoryModel
            .find()
            .populate({
                path: 'products',
                model: Product.name,
                select: 'name',
            })
            .lean()
            .exec();

        return categories.map((category) => this.getResponseCategoryDto(category));
    }

    async findById(id: string): Promise<ResponseCategoryDto> {
        const category = await this.categoryModel
            .findById(id)
            .populate({
                path: 'products',
                model: Product.name,
                select: 'name',
            })
            .lean()
            .exec();

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return this.getResponseCategoryDto(category);
    }

    async updateCategory(id: string, categoryDto: CreateCategoryDto): Promise<ResponseCategoryDto> {
        const session = await this.categoryModel.db.startSession();
        session.startTransaction();

        try {
            await this.findCategoryByIdOrFail(id, session);

            const updatedCategory = await this.categoryModel
                .findByIdAndUpdate(id, categoryDto, { new: true, session })
                .populate({
                    path: 'products',
                    model: Product.name,
                    select: 'name',
                })
                .exec();

            await session.commitTransaction();
            return this.getResponseCategoryDto(updatedCategory);
        } catch (error) {
            await session.abortTransaction();
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update category: ${error.message}`);
        } finally {
            session.endSession();
        }
    }

    async deleteCategory(id: string): Promise<ResponseCategoryDto> {
        const session = await this.categoryModel.db.startSession();
        session.startTransaction();

        try {
            const deletedCategory = await this.categoryModel
                .findByIdAndDelete(id)
                .session(session)
                .populate({
                    path: 'products',
                    model: Product.name,
                    select: 'name',
                })
                .exec();

            if (!deletedCategory) {
                throw new NotFoundException(`Category with ID ${id} not found`);
            }

            await this.productModel.updateMany({ categories: id }, { $pull: { categories: id } }, { session });

            await session.commitTransaction();
            return this.getResponseCategoryDto(deletedCategory);
        } catch (error) {
            await session.abortTransaction();
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete category: ${error.message}`);
        } finally {
            session.endSession();
        }
    }
}
