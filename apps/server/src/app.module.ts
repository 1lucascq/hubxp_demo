import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedModule } from './seed/seed.module';
import { DashboardModule } from './dashboard/dashboard.module';


const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/hubxp_demo?directConnection=true&replicaSet=rs0';

@Module({
    imports: [ProductModule, CategoryModule, OrderModule, MongooseModule.forRoot(MONGODB_URL), SeedModule, DashboardModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
