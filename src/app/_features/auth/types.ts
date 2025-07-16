export interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
