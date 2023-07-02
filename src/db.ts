import { Error400, Error404 } from './errors';
import utils from './utils';

type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

type UserForPost = {
  username: string;
  age: number;
  hobbies: string[];
};

const users: User[] = [];

const getAllUsers = async () => users;
// for check 500 status code Internal server error
// const getAllUsers = async () => {
//   throw new Error('test error message');
// };

const getUserById = async (userId: string) => {
  const user = users.find((user) => user.id === userId);
  if (!user) {
    throw new Error404(`user with id ${userId} doesn't exist`);
  }
  return user;
};

const addNewUser = async (user: Object) => {
  validateNewUser(user);
  const bodyData = user as UserForPost;

  const newUser: User = {
    id: utils.getNewUserId(),
    username: bodyData.username,
    age: bodyData.age,
    hobbies: bodyData.hobbies,
  };

  users.push(newUser);
  return newUser;
};

const validateNewUser = (user: Partial<UserForPost>) => {
  let errors = [];
  const isNameValid = user.username && typeof user.username === 'string';
  if (!isNameValid) errors.push('username');

  const isAgeValid = user.age && typeof user.age === 'number' && user.age >= 0;
  if (!isAgeValid) errors.push('age');

  const isHobbiesValid =
    Array.isArray(user.hobbies) &&
    user.hobbies.every((hobby) => typeof hobby === 'string');
  if (!isHobbiesValid) errors.push('hobbies');

  if (!isNameValid || !isAgeValid || !isHobbiesValid) {
    throw new Error400('missing or incorrect - ' + errors.join(', '));
  }
};

const deleteUser = async (userId: string) => {
  await getUserById(userId);
  const index = users.findIndex((user) => user.id === userId);
  users.splice(index, 1);
};

const updateUser = async (userId: string, userData: Object) => {
  let userForUpdate = await getUserById(userId);
  validateNewUser(userData);
  const bodyData = userData as UserForPost;

  userForUpdate.username = bodyData.username;
  userForUpdate.age = bodyData.age;
  userForUpdate.hobbies = bodyData.hobbies;

  return userForUpdate;
};

export default {
  getAllUsers,
  getUserById,
  addNewUser,
  deleteUser,
  updateUser,
};
