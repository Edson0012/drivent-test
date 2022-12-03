import { ApplicationError } from "@/protocols";

export function forbidden(): ApplicationError {
  return {
    name: "FORBIDDEN",
    message: "Forbidden",
  };
}
