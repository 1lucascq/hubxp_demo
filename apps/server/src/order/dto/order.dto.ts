import { IsNumber, IsDate, IsArray, IsMongoId } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Expose, Transform, Type } from 'class-transformer';
import { SimplifiedProductWithPrice } from 'src/product/dto/product.dto';

export class CreateOrderDto {
    @IsDate()
    @Transform(({ value }) => new Date(value))
    date: Date;

    @IsArray()
    @IsMongoId({ each: true })
    products: string[];

    @IsNumber()
    total: number;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class ResponseOrderDto {
    @Expose()
    @Transform(({ value }) => value.toString())
    _id: string;

    @Expose()
    @Transform(({ value }) => new Date(value))
    date: Date;

    @Expose()
    @Type(() => SimplifiedProductWithPrice)
    products: SimplifiedProductWithPrice[];

    @Expose()
    total: number;
}
