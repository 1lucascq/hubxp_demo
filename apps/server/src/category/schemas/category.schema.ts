import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';

@Schema()
export class Category extends Document {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop([{ type: Types.ObjectId, ref: 'Product' }])
    products: Product[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
