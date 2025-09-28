export type User = {
  firstName: string;
  fullName: string;
  jobTitle: string;
  bio: string;
  avatar: string;
};

export type UserState = {
  user: User | null;
  isLoading: boolean;
  error: boolean;
};


