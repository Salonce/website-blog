export enum Role {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  EDITOR = 'EDITOR',
  USER = 'USER'
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  roles: Role[]; 
}
