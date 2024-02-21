export type CheckEmailsExistsInput = {
  email: string;
};

export type CheckEmailExistsSuccess = {
  isEmailExists: boolean;
};

export type CheckEmailExistsError = {
  errors: CheckEmailExistsErrors;
};

export type CheckEmailExistsErrors = {
  email?: string[];
};

export type SignupInput = {
  email: string;
  password: string;
  name: string;
};

export type SignupSuccess = {
  toast: Toast;
};

export type SignupError = {
  errors: SignupErrors;
};

export type Toast = {
  text: string;
  type: string;
};

export type SignupErrors = {
  name?: string[];
  email?: string[];
  password?: string[];
};
