import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { appConfig } from '../config';

@Injectable()
export class PriceService {
  private readonly symbol = 'BTCUSDT';

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
      console.error(`Error fetching BTC price: ${error.message}`);
      throw new HttpException(
        'Error fetching BTC price',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
