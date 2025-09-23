export type RoleType = "STUDENT" | "TEACHER";

export type LoginFormInputs = {
  email: string;
  password: string;
};

export type RegisterFormInputs = {
  fullName: string;
  registerEmail: string;
  role: RoleType
  registerPassword: string;
  confirmPassword: string;
};