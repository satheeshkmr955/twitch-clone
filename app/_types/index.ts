import { toast } from "sonner";
import type { GraphQLErrorExtensions } from "graphql/error";

export interface Success {
  toast?: Toast;
  isEmailExists?: boolean;
}

export interface Error {
  errors?: Errors;
  toast?: Toast;
}

export type ToastTypes = keyof Pick<
  typeof toast,
  "success" | "info" | "warning" | "error"
>;

export interface CustomerExtensions extends GraphQLErrorExtensions {
  toast?: Toast;
}

export interface Toast {
  text?: string;
  type?: ToastTypes;
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

export interface TriggerToastProps {
  toast?: Toast | undefined;
}
