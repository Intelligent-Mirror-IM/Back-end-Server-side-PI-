export const activeUsers = {
  users: new Map(),

  getCurrentUser: (userId) => {
    return activeUsers.users.get(userId);
  },

  setCurrentUser: (userId, user) => {
    activeUsers.users.set(userId, user);
  },

  removeUser: (userId) => {
    activeUsers.users.delete(userId);
  },

  isUserActive: (userId) => {
    return activeUsers.users.has(userId);
  },

  getAllActiveUsers: () => {
    return Array.from(activeUsers.users.values());
  },
};

export const clearAllUsers = () => {
  activeUsers.users.clear();
};
