export const getApiErrorMessage = (err, fallback = "Something went wrong.") => {
  const data = err?.response?.data;

  if (data) {
    if (data.Message) return data.Message;
    if (data.message) return data.message;

    if (data.errors && typeof data.errors === "object") {
      const flattened = Object.values(data.errors)
        .flat()
        .filter(Boolean);
      if (flattened.length) return flattened.join(" ");
    }

    if (data.detail) return data.detail;
    if (data.title) return data.title;
  }

  if (err?.message && !err.message.startsWith("Request failed with status")) {
    return err.message;
  }

  return fallback;
};
