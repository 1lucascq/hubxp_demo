import { Module } from '@nestjs/common';
import { AwsModule } from '../common/aws/aws.module';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
    imports: [AwsModule],
    providers: [UploadService],
    controllers: [UploadController],
    exports: [UploadService],
})
export class UploadModule {}
