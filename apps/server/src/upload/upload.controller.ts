import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Multer.File) {
        const imageUrl = await this.uploadService.uploadImage(file);
        return { imageUrl: imageUrl };
    }
}