import { Global, Module } from '@nestjs/common';
import { drizzleDb } from 'src/config/database';

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE_DB',
      useValue: drizzleDb,
    },
  ],
  exports: ['DRIZZLE_DB'],
})
export class DrizzleModule {}
