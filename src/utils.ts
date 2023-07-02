import { validate as isUserIdValid } from 'uuid';

const apiUrl = /^\/api\/users\/?$/;
const apiUrlWithId = /^\/api\/users\/[^\/]+$/;
const apiUserId = /\/api\/users\/([\w-]+)/;

const urlIsValid = (url: string) => {
  if (!url.match(apiUrl) && !url.match(apiUrlWithId)) return false;
  return true;
};

const getId = (url: string) => {
  const groups = url.match(apiUserId);
  return groups ? groups[1] : null;
};

export default {
    urlIsValid,
    getId,
    isUserIdValid
}