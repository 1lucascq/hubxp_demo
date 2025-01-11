import { Inject, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Multer } from 'multer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
    constructor(@Inject('S3_CLIENT') private readonly s3Client: S3Client) {}

    async uploadImage(file: Multer.File): Promise<string> {
        const configService = new ConfigService();
        const LOCALSTACK_PORT = configService.get<string>('LOCALSTACK_PORT');
		const bucketName = 'hubxp';
        const key = `hubxp-key-${file.originalname}`;
        const command = new PutObjectCommand({
            Bucket: 'hubxp',
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3Client.send(command);

        const url = `http://localhost:${LOCALSTACK_PORT}/${bucketName}/${key}`;
        return url;
    }
}
