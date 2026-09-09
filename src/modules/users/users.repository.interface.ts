import type { User } from '@prisma/client';

export interface CreateUserInput {
  authUserId: string;
  username: string;
  displayName: string;

  bio?: string;
  nationalityCode?: string;
  residenceCountryCode?: string;
  preferredLocale?: string;
}

export interface UpdateUserInput {
  username?: string;
  displayName?: string;

  bio?: string | null;

  nationalityCode?: string | null;
  residenceCountryCode?: string | null;

  preferredLocale?: string;
}

export interface UsersRepository {
  findById(
    id: string,
  ): Promise<User | null>;

  findByAuthUserId(
    authUserId: string,
  ): Promise<User | null>;

  findByUsername(
    username: string,
  ): Promise<User | null>;

  create(
    input: CreateUserInput,
  ): Promise<User>;

  updateById(
    id: string,
    input: UpdateUserInput,
  ): Promise<User>;
}