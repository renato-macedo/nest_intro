import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async addProduct(
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ): Promise<any> {
    console.log(prodTitle);
    try {
      const product = await this.productsService.insertProduct(
        prodTitle,
        prodDesc,
        prodPrice,
      );
      return product;
    } catch (error) {
      throw new InternalServerErrorException('Try again later');
    }
  }

  @Get()
  findAll() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() data) {
    const [product, errMessage] = await this.productsService.updateProduct(
      id,
      data,
    );
    if (errMessage) {
      throw new NotFoundException(errMessage);
    }
    return product;
  }

  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
