const EMAIL_REGEX = /\S+@\S+\.\S+/;

export const validateUserForm = (form) => {
  const errors = {};
  if (!form.FirstName?.trim()) errors.FirstName = "First name is required";
  if (!form.LastName?.trim()) errors.LastName = "Last name is required";
  if (!form.Email?.trim()) errors.Email = "Email is required";
  else if (!EMAIL_REGEX.test(form.Email)) errors.Email = "Enter a valid email";
  if (!form.Phone?.trim()) errors.Phone = "Phone is required";
  if (!form.Password?.trim()) errors.Password = "Password is required";
  else if (form.Password.length < 8)
    errors.Password = "Password must be at least 8 characters";
  if (!form.UserType) errors.UserType = "User type is required";
  if (!form.RoleIds?.length) errors.RoleIds = "Select at least one role";
  return errors;
};
