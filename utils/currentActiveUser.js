export const currentActiveUser = {
  currentUser: "",
  getCurrentUser: () => {
    return currentActiveUser.currentUser;
  },
  setCurrentUser: (user) => {
    currentActiveUser.currentUser = user;
  },
};
export const clearCurrentUser = () => {
  currentActiveUser.currentUser = "";
};
export const isUserActive = () => {
  return currentActiveUser.currentUser !== "";
};
