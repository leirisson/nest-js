import { Module } from "@nestjs/common";
import { CreateProductController } from "./create-product.controller";
import { PrimaService } from "src/prisma/prisma.service";


@Module({
  imports: [],
  controllers: [CreateProductController],
  providers: [PrimaService],
})
export class ProductModule {}