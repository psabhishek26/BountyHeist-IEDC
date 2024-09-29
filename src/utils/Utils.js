export const generateCodeSix = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};

export const generateCodeSeven = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 7 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};
