import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.model';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly ProductModel: Model<Product>,
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const prodID = (Math.random() + (10000 - 1) + 1).toString();
    const newProduct = await this.ProductModel.create({
      title,
      description: desc,
      price,
    });

    return newProduct.save();
  }

  async getAllProducts(): Promise<any> {
    const products = await this.ProductModel.find().exec();

    return products.map(prod => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));
  }

  async getProduct(productid: string) {
    const product = await this.ProductModel.findById(productid);
    const { id, title, description, price } = product;
    return { id, title, description, price };
  }

  async updateProduct(productid: string, data): Promise<[{}, string]> {
    try {
      const product = await this.ProductModel.findByIdAndUpdate(productid, {
        title: data.title,
        description: data.description,
        price: data.price,
      }).exec();

      //if (!product) {
      const { id, title, description, price } = product;
      return [{ id, title, description, price }, null];
      //}
    } catch (error) {
      console.log(error);
      return [{}, error.message];
    }

    // if (title) {
    //   product.title = title;
    // }

    // if (description) {
    //   product.description = description;
    // }

    // if (price) {
    //   product.price = price;
    // }
    // this.products[index] = product;
    // return { ...product };
  }

  deleteProduct(productid: string) {
    this.products = this.products.filter(prod => prod.id !== productid);
    return null;
  }

  private findProduct(id: string): [Product, number] {
    const index = this.products.findIndex(prod => id === prod.id);
    const product = this.products[index];
    if (!product) {
      throw new NotFoundException('Could not find product');
    }
    return [product, index];
  }
}
