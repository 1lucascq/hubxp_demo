import { S3Client } from '@aws-sdk/client-s3';

export const s3Config = {
    endpoint: 'http://localhost:4566',
    region: 'us-east-1',
    s3ForcePathStyle: true,
	forcePathStyle: true,
    credentials: {
        accessKeyId: 'fakeAccessKey',
        secretAccessKey: 'fakeSecretKey',
    },
};

export const s3Client = new S3Client(s3Config);
