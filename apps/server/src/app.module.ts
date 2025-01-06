import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedModule } from './seed/seed.module';

const URL = 'mongodb://localhost:27017/hubxp_demo';

@Module({
  imports: [ProductModule, CategoryModule, OrderModule, MongooseModule.forRoot(URL), SeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
