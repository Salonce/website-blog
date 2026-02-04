export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR'
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  roles: Role[]; 
}
