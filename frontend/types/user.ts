export interface AuthCredentials {
    username: string;
    password: string;
  }

  export interface User {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    location?: string;
    profileImg?: string;
    roles: string[];
  }