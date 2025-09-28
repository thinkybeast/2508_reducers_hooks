import z from "zod";

export const userSchema = z.object({
  firstName: z.string(),
  fullName: z.string(),
  jobTitle: z.string(),
  bio: z.string(),
  avatar: z.string(),
});

export type User = z.infer<typeof userSchema>;

import z from "zod";

export const userSchema = z.object({
  firstName: z.string(),
  fullName: z.string(),
  jobTitle: z.string(),
  bio: z.string(),
  avatar: z.string(),
});

export type User = z.infer<typeof userSchema>;

export type UserState = {
  user: User | null;
  isLoading: boolean;
  error: boolean;
};
