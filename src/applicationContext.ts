import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserModule } from './modules/user/user.module';
import { UploaderService } from './modules/uploader/uploader.service';
import { UploaderModule } from './modules/uploader/uploader.module';
import { UserService } from './modules/user/services/user.service';

const applicationContext: Promise<{
  userService: UserService;
  uploaderService: UploaderService;
}> = NestFactory.createApplicationContext(AppModule).then((app) => {
  return {
    userService: app.select(UserModule).get(UserService, { strict: true }),
    uploaderService: app
      .select(UploaderModule)
      .get(UploaderService, { strict: true }),
  };
});

export default applicationContext;
