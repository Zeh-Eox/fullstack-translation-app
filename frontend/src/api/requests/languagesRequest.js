import HTTP_CLIENT from '../client/api';

export const getLanguages = async () => {
  const response = await HTTP_CLIENT.get('/languages');
  return response;
};

export const createLanguage = async (languageData) => {
  const response = await HTTP_CLIENT.post('/languages', languageData);
  return response;
};

export const deleteLanguage = async (id) => {
  const response = await HTTP_CLIENT.delete(`/languages/${id}`);
  return response;
}
