export const capitalizeFields = (obj, fields = []) => {
  if (!obj || typeof obj !== "object") {
    throw new Error("Invalid object provided to capitalizeFields");
  }

  const updatedObj = { ...obj };

  fields.forEach((field) => {
    if (updatedObj[field] && typeof updatedObj[field] === "string") {
      updatedObj[field] =
        updatedObj[field].charAt(0).toUpperCase() + updatedObj[field].slice(1).toLowerCase();
    }
  });

  return updatedObj;
};
