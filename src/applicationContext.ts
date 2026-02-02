import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { UserService } from './module/user/user.service';
import { UserModule } from './module/user/user.module';

const applicationContext: Promise<{
  appService: AppService;
  userService: UserService;
}> = NestFactory.createApplicationContext(AppModule).then((app) => {
  return {
    appService: app.select(AppModule).get(AppService, { strict: true }),
    userService: app.select(UserModule).get(UserService, { strict: true }),
  };
});

export default applicationContext;
