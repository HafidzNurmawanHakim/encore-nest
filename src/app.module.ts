import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { DrizzleModule } from './modules/db/db.module';
import { UploaderModule } from './modules/uploader/uploader.module';

@Module({
  imports: [DrizzleModule, UserModule, UploaderModule],
})
export class AppModule {}
