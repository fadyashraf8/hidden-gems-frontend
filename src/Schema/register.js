import * as zod from "zod";

export const schema = zod.object({
  firstName: zod
    .string()
    .nonempty("firstName-error")
    .min(3, "firstName-error-min")
    .max(20, "firstName-error-max"),
  lastName: zod
    .string()
    .nonempty("lastName-error")
    .min(3, "lastName-error-min")
    .max(20, "lastName-error-max"),
  email: zod
    .string()
    .nonempty("email-error")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "email-error-invalid"
    ),
  password: zod
    .string()
    .nonempty("password-error")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "password-error-enter"
    ),
  phoneNumber: zod
    .string()
    .nonempty("phoneNumber-error")
    .regex(/^01[0125][0-9]{8}$/, "phoneNumber-error"),
  image: zod.any().optional(),
});
