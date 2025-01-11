import { Module } from '@nestjs/common';
import { AwsProvider } from './aws.provider';

@Module({
    providers: [AwsProvider],
    exports: [AwsProvider],
})
export class AwsModule {}
