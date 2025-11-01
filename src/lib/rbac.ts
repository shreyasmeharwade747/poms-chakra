export const checkRole = (userRole: string, allowedRoles: string[]) => {
  if (!allowedRoles.includes(userRole)) {
    throw new Error("Unauthorized Access");
  }
};
