import * as zod from "zod";

export const schema = zod.object({
  email: zod
    .string()
    .nonempty({ message: "errors.emailRequired" })
    .email({ message: "errors.invalidEmail" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "errors.invalidEmailFormat",
    }),
  newPassword: zod
    .string()
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
      message: "errors.weakPasswordFormat",
    })
    .min(6, { message: "errors.weakPassword" })
    .nonempty({ message: "errors.passwordRequired" }),
  code: zod
    .string()
    .nonempty({ message: "errors.codeRequired" })
    .min(6, { message: "errors.invalidCode" }),
});
