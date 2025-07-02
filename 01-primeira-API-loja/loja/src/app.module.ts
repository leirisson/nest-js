import { Module } from '@nestjs/common'
import { AccountModule } from './account/account.module'
import { ProductModule } from './product/product.module'

@Module({
  imports: [AccountModule, ProductModule],
})
export class AppModule {}
