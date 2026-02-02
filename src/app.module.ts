import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { DrizzleModule } from './module/db/db.module';

@Module({
  providers: [AppService],
  imports: [DrizzleModule, UserModule],
})
export class AppModule {}
