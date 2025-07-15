export type DecodedToken = {
  user: string;
  exp?: number;
  iat?: number;
};

export interface UserProfile {
  name: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  photo: string;
}
