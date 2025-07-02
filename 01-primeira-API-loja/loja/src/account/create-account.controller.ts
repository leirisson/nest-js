import { Body, Controller, Post, Get, ConflictException, UsePipes } from "@nestjs/common"
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library"
import { PrimaService } from "src/prisma/prisma.service"
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from "src/pipes/zod-validations.pipe"
import {CreacAccountDTO, createAccountBodySchema} from './dto/acreate-account'


@Controller('/accounts')
export class CreateAccountController {

    constructor(private prisma: PrimaService) { }

    @Post()
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async handle(@Body() body: CreacAccountDTO) {

        const { name, email, password } = body

        // verificando se o email ja existe
        const userWithSameEmail = await this.prisma.user.findUnique({
            where: {
                email
            }
        })


        if (userWithSameEmail) {
            throw new ConflictException('Email already in use.')
        }

        const hashPassWord = await hash(password, 8)

        await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashPassWord
            }
        })


    }

    @Get()
    async getUsers() {
        try {
            const listUsers = await this.prisma.user.findMany()
            return listUsers
        } catch (error) {
            console.log('Error ao tentar buscar usuarios.')
        }
    }
}