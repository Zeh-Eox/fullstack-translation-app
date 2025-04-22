import HTTP_CLIENT from '../client/api';

export const getConnectedUser = async () => {
  const response = await HTTP_CLIENT.get('/user');
  return response.data;
};
