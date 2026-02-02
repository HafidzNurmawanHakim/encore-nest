import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// ─────────────────────────────────────────────────────────────────────────────
// Encore API Types (Interfaces - required by Encore)
// ─────────────────────────────────────────────────────────────────────────────

export interface UserDto {
  id: number;
  name: string;
  fullname: string;
  email: string;
  role: string;
}

export interface CreateUserRequest {
  name: string;
  fullname: string;
  email: string;
  role?: string;
}

export interface UpdateUserRequest {
  name?: string;
  fullname?: string;
  role?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedUserResponse {
  data: UserDto[];
  meta: PaginationMeta;
}

export interface DeleteResponse {
  success: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation Classes (for class-validator)
// ─────────────────────────────────────────────────────────────────────────────

export class CreateUserDto implements CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  role?: string;
}

export class UpdateUserDto implements UpdateUserRequest {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  fullname?: string;

  @IsString()
  @IsOptional()
  role?: string;
}

export class PaginationQueryDto implements PaginationQuery {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
