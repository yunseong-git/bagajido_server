export interface UpsertOAuthUserInput {
  oauth_provider: string;
  oauth_subject: string;
  email?: string | null;
  display_name?: string | null;
}

export interface UsersRepository {
  upsertFromOAuth(input: UpsertOAuthUserInput): Promise<{ id: string }>;
}
