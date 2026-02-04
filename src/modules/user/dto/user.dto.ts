import {
  PaginationQuery,
  PaginationMeta,
  PaginationQueryDto,
} from 'src/common/dto/pagination.dto';
import { IsEmail, MaxLen, MinLen } from 'encore.dev/validate';
export type { PaginationQuery, PaginationMeta };
export { PaginationQueryDto };

// ─────────────────────────────────────────────────────────────────────────────
// Encore API Types (Interfaces - required by Encore)
// ─────────────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  fullname: string;
  email: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  name: string & MinLen<3> & MaxLen<50>;
  fullname?: string & MinLen<3> & MaxLen<50>;
  email: string & IsEmail;
  role?: string;
}

export interface UpdateUserRequest {
  name?: string & MinLen<3> & MaxLen<50>;
  fullname?: string & MinLen<3> & MaxLen<50>;
  role?: string;
}
