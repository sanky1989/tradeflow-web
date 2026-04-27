const EMAIL_REGEX = /\S+@\S+\.\S+/;

export const validateSupplierForm = (form) => {
  const errors = {};
  if (!form.Name?.trim()) errors.Name = "Supplier name is required";
  if (!form.ContactName?.trim()) errors.ContactName = "Contact name is required";
  if (!form.Email?.trim()) errors.Email = "Email is required";
  else if (!EMAIL_REGEX.test(form.Email)) errors.Email = "Enter a valid email";
  if (!form.Phone?.trim()) errors.Phone = "Phone is required";
  return errors;
};
