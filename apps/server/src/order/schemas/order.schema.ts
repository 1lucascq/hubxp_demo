import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';

@Schema()
export class Order extends Document {
    _id: Types.ObjectId;

    @Prop({ required: true })
    date: Date;

    @Prop({
        type: [{ type: Types.ObjectId, ref: 'Product' }],
        required: true,
    })
    products: Product[];

    @Prop({ required: true })
    total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
