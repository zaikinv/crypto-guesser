import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { appConfig } from '../config';

@Injectable()
export class PriceService {
  private readonly symbol = appConfig.symbol;

  async getCurrentBTCPrice(): Promise<number> {
    try {
      const response = await axios.get(
        `${appConfig.priceApiBaseUrl}/ticker/price`,
        {
          params: {
            symbol: this.symbol,
          },
        },
      );
      return parseFloat(response.data.price);
    } catch (error) {
      console.log(`Error fetching price: ${error.message}`);
      throw new HttpException(
        'Error fetching price',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
