import { Module } from "@nestjs/common";
import { CreateAccountController } from "./create-account.controller";
import { PrimaService } from "src/prisma/prisma.service";



@Module({
        imports: [],
        controllers: [CreateAccountController],
        providers: [PrimaService],
    })
export class AccountModule {}