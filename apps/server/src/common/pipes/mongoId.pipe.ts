import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform<string> {
    transform(value: string) {
        if (!Types.ObjectId.isValid(value)) {
            throw new BadRequestException('Invalid MongoDB ID format');
        }
        return value;
    }
}
