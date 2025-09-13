export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "TEACHER";
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}
