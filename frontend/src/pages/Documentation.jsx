import React from 'react';

const Documentation = () => {
  const endpoints = [
    {
      endpoint: 'api/users',
      method: 'GET',
      description: 'Obtenir la liste de tous les utilisateurs',
      color: 'bg-blue-500'
    },
    {
      endpoint: 'api/users/register',
      method: 'POST',
      description: 'Créer un nouvel utilisateur',
      color: 'bg-green-500'
    },
    {
      endpoint: 'api/users/login',
      method: 'POST',
      description: 'Connexion utilisateur',
      color: 'bg-green-500'
    },
    {
      endpoint: 'api/user',
      method: 'GET',
      description: 'Obtenir les infos de l\'utilisateur connecté',
      color: 'bg-blue-500'
    },
    {
      endpoint: 'api/translations',
      method: 'GET',
      description: 'Obtenir toutes les correspondances',
      color: 'bg-blue-500'
    },
    {
      endpoint: 'api/translations',
      method: 'POST',
      description: 'Créer une nouvelle correspondance',
      color: 'bg-green-500'
    },
    {
      endpoint: 'api/translations/{translation}',
      method: 'PUT',
      description: 'Modifier une correspondance',
      color: 'bg-yellow-500'
    },
    {
      endpoint: 'api/translations/{translation}',
      method: 'DELETE',
      description: 'Supprimer une correspondance',
      color: 'bg-red-500'
    },
    {
      endpoint: 'api/translations/lang/{source_language}/{target_language}',
      method: 'GET',
      description: 'Obtenir les correspondances entre deux langues',
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Documentation de l'API de correspondance de langues
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Les paramètres dynamiques sont indiqués entre <span className="font-semibold text-gray-900">{'{'}</span> et <span className="font-semibold text-gray-900">{'}'}</span>.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {endpoints.map((endpoint, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {endpoint.endpoint}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${endpoint.color}`}>
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {endpoint.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-white shadow-xl rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes importantes</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
              <span className="ml-2">Toutes les requêtes nécessitent un token d'authentification dans le header Authorization (Bearer token)</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
              <span className="ml-2">Les paramètres dynamiques doivent être remplacés par les valeurs appropriées</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
              <span className="ml-2">Les réponses sont au format JSON</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
