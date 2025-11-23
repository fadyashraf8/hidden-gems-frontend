import * as zod from "zod";

export const schema = zod
  .object({
    email: zod
      .string()
      .nonempty("Email is required"),
    password: zod
      .string().nonempty("Password is required"),
  
  })
