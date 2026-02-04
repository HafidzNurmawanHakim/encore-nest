import { Inject, Injectable } from '@nestjs/common';
import { users } from 'src/modules/user/schema/user.schema';
import { eq, count } from 'drizzle-orm';
import { drizzleDb } from 'src/config/database';
import { User } from '../dto/user.dto';
import { IUserRepository } from '../interface/user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@Inject('DRIZZLE_DB') private db = drizzleDb) {}

  async create(data: Partial<User>): Promise<User> {
    const [newUser] = await this.db
      .insert(users)
      .values({
        name: data.name!,
        fullname: data.fullname!,
        email: data.email!,
        role: data.role || 'user',
      })
      .returning();
    return newUser;
  }

  async findAll(): Promise<User[]> {
    const result = await this.db.select().from(users);
    return result.map((u) => u);
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: User[]; total: number }> {
    const offset = (page - 1) * limit;

    const [countResult] = await this.db.select({ value: count() }).from(users);
    const total = Number(countResult?.value || 0);

    const result = await this.db
      .select()
      .from(users)
      .limit(limit)
      .offset(offset);

    return {
      data: result.map((u) => u),
      total,
    };
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result.length ? result[0] : null;
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const [updatedUser] = await this.db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser ? updatedUser : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    return result.length > 0;
  }
}
