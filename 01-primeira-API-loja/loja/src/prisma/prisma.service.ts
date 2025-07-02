import { PrismaClient } from "../../generated/prisma/client"
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common"



@Injectable()
export class PrimaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super(
            { log: ['error', 'warn'] }
        )
    }


    onModuleInit() {
        return this.$connect()
    }

    onModuleDestroy() {
        return this.$disconnect()
    }
}