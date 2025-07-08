import { Injectable } from '@nestjs/common';
import { environments } from 'src/settings/environments/environments';

@Injectable()
export class AppService {
  home(): string {
    return `Hello World!`;
  }
}
