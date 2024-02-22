export interface Success {
  toast?: Toast;
  isEmailExists?: boolean;
}

export interface Error {
  errors?: Errors;
  toast?: Toast;
}

export interface Toast {
  text?: string;
  type?: string;
}

export interface Errors {
  name?: string[];
  email?: string[];
  password?: string[];
}

export type CheckEmailsExistsInput = {
  email: string;
};

export type SignupInput = {
  email: string;
  password: string;
  name: string;
};
