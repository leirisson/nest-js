import { Body, Controller, Post } from "@nestjs/common";
import { PrimaService } from "src/prisma/prisma.service";


@Controller('/products')
export class CreateProductController {
    constructor(private prisma: PrimaService) { }

    @Post()
    async hendle(@Body() body: any) {
        const { name, price, description } = body

        try {
            await this.prisma.product.create({
                data: {
                    name,
                    description,
                    price
                }
            })
        } catch (error) {
            console.log('Erro ao tentar criar um produto ')
        }
    }
}