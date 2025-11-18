import * as zod from "zod";

export const schema = zod.object({
  firstName: zod
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must be at most 20 characters long")
    .nonempty("Name is required"),
  lastName: zod
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must be at most 20 characters long")
    .nonempty("Name is required"),
  email: zod
    .string()
    .nonempty("Email is required")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    ),
  password: zod
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must contain at least one letter and one number"
    )
    .min(6)
    .nonempty("Password is required"),
  phoneNumber: zod
    .string()
    .nonempty("Phone number is required")
    .regex(
      /^01[0125][0-9]{8}$/,
      "Invalid phone number"
    ),
  image: zod.any().optional(),
});
  
