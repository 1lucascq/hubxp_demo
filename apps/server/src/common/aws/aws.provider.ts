import { Provider } from '@nestjs/common';
import { s3Client } from '../aws/aws.config';

export const S3_CLIENT = 'S3_CLIENT';

export const AwsProvider: Provider = {
    provide: S3_CLIENT,
    useValue: s3Client,
};
