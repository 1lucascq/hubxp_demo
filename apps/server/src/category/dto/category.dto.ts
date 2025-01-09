import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { SimplifiedProductDto } from 'src/product/dto/product.dto';

export class CreateCategoryDto {
    @IsString()
    name: string;
}

export class ResponseCategoryDto {
    @Expose()
    @Transform(({ value }) => value.toString())
    _id: string;

    @Expose()
    name: string;

    @Expose()
	@IsOptional()
    @Type(() => SimplifiedProductDto)
    products: SimplifiedProductDto[];
}

export class SimplifiedCategoryDto {
    @Expose()
    @Transform(({ value }) => value.toString())
    _id: string;

    @Expose()
    name: string;
}
