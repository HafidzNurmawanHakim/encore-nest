import { api } from 'encore.dev/api';
import applicationContext from './applicationContext';

export const getHello = api(
  { expose: true, method: 'GET', path: '/' },
  async () => {
    const { appService } = await applicationContext;
    const hello = appService.getHello();
    return { hello };
  },
);
