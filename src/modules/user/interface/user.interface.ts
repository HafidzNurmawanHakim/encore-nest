import { User } from '../dto/user.dto';

// Repository Interface (consolidated here for simplicity)
export interface IUserRepository {
  create(data: Partial<User>): Promise<User>;
  findAll(): Promise<User[]>;
  findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: User[]; total: number }>;
  findById(id: number): Promise<User | null>;
  update(id: number, data: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}
