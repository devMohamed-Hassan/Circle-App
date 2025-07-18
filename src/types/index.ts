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

export interface Props {
  userPhoto: string;
  uploading: boolean;
  onUpload: (file: File, preview: string) => void;
}