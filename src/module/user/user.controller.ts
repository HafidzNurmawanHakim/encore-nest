import { api, APIError } from 'encore.dev/api';
import applicationContext from 'src/applicationContext';
import {
  CreateUserDto,
  UpdateUserDto,
  CreateUserRequest,
  UpdateUserRequest,
  UserDto,
  PaginationQuery,
  PaginatedUserResponse,
  DeleteResponse,
  PaginationQueryDto,
} from './dto/user.dto';
import { validateDto } from 'src/common/helpers/validation.helper';
import { plainToInstance } from 'class-transformer';

// Helper to get service
const getService = async () => {
  const { userService } = await applicationContext;
  return userService;
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────────────────────
export const createUser = api(
  { expose: true, method: 'POST', path: '/users' },
  async (data: CreateUserRequest): Promise<UserDto> => {
    const dto = await validateDto(CreateUserDto, data);
    const service = await getService();
    return service.create(dto);
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// READ (paginated)
// ─────────────────────────────────────────────────────────────────────────────
export const getListUser = api(
  { expose: true, method: 'GET', path: '/users' },
  async (query: PaginationQuery): Promise<PaginatedUserResponse> => {
    const dto = plainToInstance(PaginationQueryDto, query);
    const service = await getService();
    return service.getListPaginated(dto);
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// READ (by ID)
// ─────────────────────────────────────────────────────────────────────────────
export const getUserById = api(
  { expose: true, method: 'GET', path: '/users/:id' },
  async ({ id }: { id: number }): Promise<UserDto> => {
    const service = await getService();
    const user = await service.getById(id);
    if (!user) throw APIError.notFound('User not found');
    return user;
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────────────────────
export const updateUser = api(
  { expose: true, method: 'PUT', path: '/users/:id' },
  async ({
    id,
    ...data
  }: { id: number } & UpdateUserRequest): Promise<UserDto> => {
    const dto = await validateDto(UpdateUserDto, data);
    const service = await getService();
    const user = await service.update(id, dto);
    if (!user) throw APIError.notFound('User not found');
    return user;
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────────────────────
export const deleteUser = api(
  { expose: true, method: 'DELETE', path: '/users/:id' },
  async ({ id }: { id: number }): Promise<DeleteResponse> => {
    const service = await getService();
    const success = await service.delete(id);
    if (!success) throw APIError.notFound('User not found');
    return { success };
  },
);
