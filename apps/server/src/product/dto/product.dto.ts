import { IsString, IsNumber, IsArray, IsMongoId } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Expose, Transform, Type } from 'class-transformer';
import { SimplifiedCategoryDto } from 'src/category/dto/category.dto';
import { Types } from 'mongoose';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsArray()
    @IsMongoId({ each: true })
    categories: string[];

    @IsString()
    imageUrl: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ResponseProducteDto {
    @Expose()
    @Transform(({ value }) => value.toString())
    _id: string;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    price: number;

    @Expose()
    @Type(() => SimplifiedCategoryDto)
    categories: SimplifiedCategoryDto[];

    @Expose()
    imageUrl: string;
}

export class SimplifiedProductDto {
    @Expose()
    @Transform(({ value }) => value.toString())
    _id: string;

    @Expose()
    name: string;
}

export class SimplifiedProductWithPrice {
    @Expose()
    @Transform(({ value }) => value.toString())
    _id: string;

    @Expose()
    name: string;

    @Expose()
    price: number;
}
