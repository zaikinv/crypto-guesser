import { Module } from '@nestjs/common';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PriceController],
  providers: [PriceService],
})
export class PriceModule {}
