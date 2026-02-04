import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserService } from './services/user.service';

@Module({
  providers: [
    UserService,
    {
      provide: 'I_USER_REPOSITORY',
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
