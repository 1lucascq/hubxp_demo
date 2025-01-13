// import { NestFactory, Reflector } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
// import { SeedService } from './seed/seed.service';
// import { ConfigService } from '@nestjs/config';
// import { Connection } from 'mongoose';
// import { getConnectionToken } from '@nestjs/mongoose';

// async function bootstrap() {
//     const app = await NestFactory.create(AppModule);
// 	const configService = app.get(ConfigService);
//     // const configService = new ConfigService();
//     const APP_PORT = configService.get<string>('APP_PORT') || 3000;

//     app.enableCors({
//         origin: true,
//         methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//         credentials: true,
//     });

//     app.useGlobalPipes(new ValidationPipe());
//     app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

// 	const connection = app.get<Connection>(getConnectionToken());
// 	console.log('---->1: ', connection.readyState)
//     await connection.asPromise();
// 	console.log('---->2: ', connection.readyState)

//     if (process.argv.includes('--seed')) {
// 		console.log('---->3: ', connection.readyState)

// 		const seedService = app.get(SeedService);
// 		console.log('---->4: ', connection.readyState)
//         await seedService.runSeed();
// 		console.log('Seed data populated successfully!');
// 		await app.close();
//     }

//     await app.listen(APP_PORT);
// }
// bootstrap();


import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = new ConfigService();
    const APP_PORT = configService.get<string>('APP_PORT') || 3000;
	const DOCKER_HEALTHCHECK_PORT = '0.0.0.0';

    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    if (process.argv.includes('--seed')) {
        const seedService = app.get(SeedService);
        await seedService.runSeed();
        console.log('Seed data populated successfully!');
        process.exit();
    }

    await app.listen(APP_PORT, DOCKER_HEALTHCHECK_PORT);
}
bootstrap();
