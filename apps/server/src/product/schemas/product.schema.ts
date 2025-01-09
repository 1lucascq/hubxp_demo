import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from 'src/category/schemas/category.schema';

@Schema()
export class Product extends Document {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], required: true })
    categories: Category[];

    @Prop({ required: true })
    imageUrl: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
