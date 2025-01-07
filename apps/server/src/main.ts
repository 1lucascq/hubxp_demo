import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    const seedService = app.get(SeedService);
    if (process.argv.includes('--seed')) {
        await seedService.runSeed();
        process.exit();
    }

    await app.listen(3003);
}
bootstrap();
