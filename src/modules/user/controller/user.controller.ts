import { api, APIError } from 'encore.dev/api';
import applicationContext from 'src/applicationContext';
import {
  CreateUserRequest,
  UpdateUserRequest,
  PaginationQuery,
  PaginationQueryDto,
  User,
} from '../dto/user.dto';
import { plainToInstance } from 'class-transformer';
import {
  ApiResponse,
  DeleteResponse,
  okResponse,
  paginatedResponse,
} from 'src/common/middleware/responseWrapper';

// Helper to get service
const getService = async () => {
  const { userService } = await applicationContext;
  return userService;
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────────────────────
export const createUser = api<CreateUserRequest>(
  { expose: true, method: 'POST', path: '/users' },
  async (data): Promise<ApiResponse<User>> => {
    const service = await getService();
    const user = await service.create(data);
    return okResponse(user);
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// READ (paginated)
// ─────────────────────────────────────────────────────────────────────────────
export const getListUser = api(
  { expose: true, method: 'GET', path: '/users' },
  async (query: PaginationQuery): Promise<ApiResponse<User[]>> => {
    const dto = plainToInstance(PaginationQueryDto, query);
    const service = await getService();
    const result = await service.getListPaginated(dto);
    return paginatedResponse(result.data, result.meta);
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// READ (by ID)
// ─────────────────────────────────────────────────────────────────────────────
export const getUserById = api(
  { expose: true, method: 'GET', path: '/users/:id' },
  async ({ id }: { id: number }): Promise<ApiResponse<User | null>> => {
    const service = await getService();
    const user = await service.getById(id);
    if (!user) throw APIError.notFound('User not found');
    return okResponse(user);
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────────────────────
export const updateUser = api<UpdateUserRequest>(
  { expose: true, method: 'PUT', path: '/users/:id' },
  async ({
    id,
    ...data
  }: { id: number } & UpdateUserRequest): Promise<ApiResponse<User>> => {
    const service = await getService();
    const user = await service.update(id, data);
    if (!user) throw APIError.notFound('User not found');
    return okResponse(user);
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────────────────────
export const deleteUser = api(
  { expose: true, method: 'DELETE', path: '/users/:id' },
  async ({ id }: { id: number }): Promise<ApiResponse<DeleteResponse>> => {
    const service = await getService();
    const success = await service.delete(id);
    if (!success) throw APIError.notFound('User not found');
    return okResponse({ success });
  },
);
