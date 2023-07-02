import { Error404 } from './errors';

type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

const users: User[] = [];

const getAllUsers = async () => users;

const getUserById = async (userId: string) => {
  const user = users.find((user) => user.id === userId);
  if (!user) {
    throw new Error404(`user with id ${userId} doesn't exist`);
  }
  return user;
};

export default {
  getAllUsers,
  getUserById,
};
