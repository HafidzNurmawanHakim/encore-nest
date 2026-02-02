import { Inject, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  PaginationQueryDto,
  PaginatedUserResponse,
  UserDto,
} from './dto/user.dto';
import type { IUserRepository } from './user.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('I_USER_REPOSITORY') private userRepository: IUserRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDto> {
    const user = await this.userRepository.create(dto);
    return this.toDto(user);
  }

  async getList(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((u) => this.toDto(u));
  }

  async getListPaginated(
    query: PaginationQueryDto,
  ): Promise<PaginatedUserResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const { data, total } = await this.userRepository.findAllPaginated(
      page,
      limit,
    );

    return {
      data: data.map((u) => this.toDto(u)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: number): Promise<UserDto | null> {
    const user = await this.userRepository.findById(id);
    return user ? this.toDto(user) : null;
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserDto | null> {
    const user = await this.userRepository.update(id, dto);
    return user ? this.toDto(user) : null;
  }

  async delete(id: number): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  private toDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    };
  }
}
