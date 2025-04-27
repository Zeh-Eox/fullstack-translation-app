import React, { useState, useEffect, useCallback, memo } from 'react';
import DataTable from 'react-data-table-component';
import {
  getAllTranslations,
  createTranslation,
  updateTranslation,
  deleteTranslation,
} from '../../api/requests/translationsRequest';
import { getLanguages, createLanguage } from '../../api/requests/languagesRequest';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal = memo(({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
});

const TranslationModalContent = memo(({
  editingTranslation,
  isSubmitting,
  newTranslation,
  handleInputChange,
  handleCreateTranslation,
  languages,
  onClose
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {editingTranslation ? 'Modifier la traduction' : 'Ajouter une nouvelle traduction'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleCreateTranslation} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Langue source
            </label>
            <select
              name="source_language"
              value={newTranslation.source_language}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={`source-${code}`} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Langue cible
            </label>
            <select
              name="target_language"
              value={newTranslation.target_language}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={`target-${code}`} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Texte source
            </label>
            <span className="text-xs text-gray-500">
              {newTranslation.source_text.length} caractères
            </span>
          </div>
          <textarea
            name="source_text"
            value={newTranslation.source_text}
            onChange={handleInputChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors min-h-[120px]"
            placeholder="Entrez le texte à traduire"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Texte traduit
            </label>
            <span className="text-xs text-gray-500">
              {newTranslation.target_text.length} caractères
            </span>
          </div>
          <textarea
            name="target_text"
            value={newTranslation.target_text}
            onChange={handleInputChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors min-h-[120px]"
            placeholder="Entrez la traduction"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? 'En cours...' : editingTranslation ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
});

const LanguageModalContent = memo(({
  isSubmitting,
  newLanguage,
  handleLanguageInputChange,
  handleAddLanguage,
  onClose
}) => {
  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Ajouter une nouvelle langue</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleAddLanguage} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de la langue
          </label>
          <input
            name="language"
            type="text"
            value={newLanguage.language}
            onChange={handleLanguageInputChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
            placeholder="Ex: Français"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code de la langue
          </label>
          <input
            name="language_code"
            type="text"
            value={newLanguage.language_code}
            onChange={handleLanguageInputChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
            placeholder="Ex: fr"
            required
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? 'En cours...' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
});

const Translations = () => {
  const [translations, setTranslations] = useState([]);
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterLang, setFilterLang] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddLanguageModal, setShowAddLanguageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [translationToDelete, setTranslationToDelete] = useState(null);
  const [newTranslation, setNewTranslation] = useState({
    source_text: '',
    target_text: '',
    source_language: 'fr',
    target_language: 'en',
  });
  const [newLanguage, setNewLanguage] = useState({
    language: '',
    language_code: '',
  });
  const [editingTranslation, setEditingTranslation] = useState(null);

  const fetchLanguages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getLanguages();
      if (response?.data?.success && Array.isArray(response.data.data)) {
        const languagesMap = response.data.data.reduce((acc, lang) => {
          acc[lang.language_code] = lang.language;
          return acc;
        }, {});
        setLanguages(languagesMap);
      } else {
        throw new Error('Format de données incorrect');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur de chargement des langues');
      setLanguages({});
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTranslations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllTranslations();
      if (response?.success && Array.isArray(response?.data)) {
        setTranslations(response.data);
      } else {
        throw new Error(response?.error?.message || 'Format de données incorrect');
      }
    } catch (err) {
      console.error('Erreur:', err);
      toast.error(err.message || 'Erreur de chargement des traductions');
      setTranslations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetTranslationForm = useCallback(() => {
    setNewTranslation({
      source_text: '',
      target_text: '',
      source_language: 'fr',
      target_language: 'en',
    });
    setEditingTranslation(null);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewTranslation(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleLanguageInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewLanguage(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleEditTranslation = useCallback((translation) => {
    setEditingTranslation(translation);
    setNewTranslation({
      source_text: translation.source_text,
      target_text: translation.target_text,
      source_language: translation.source_language,
      target_language: translation.target_language,
    });
    setShowAddModal(true);
  }, []);

  const handleCreateTranslation = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!newTranslation.source_text.trim() || !newTranslation.target_text.trim()) {
        toast.error('Les champs de texte ne peuvent pas être vides');
        setIsSubmitting(false);
        return;
      }

      if (newTranslation.source_language === newTranslation.target_language) {
        toast.error('Les langues source et cible doivent être différentes');
        setIsSubmitting(false);
        return;
      }

      let response;
      if (editingTranslation) {
        response = await updateTranslation(editingTranslation.id, newTranslation);
      } else {
        response = await createTranslation(newTranslation);
      }

      if (response.status_code === 200 || response.success) {
        toast.success(response.status_message || (editingTranslation ? 'Traduction mise à jour avec succès!' : 'Traduction créée avec succès!'));
        await fetchTranslations();
        resetTranslationForm();
        setShowAddModal(false);
      } else {
        toast.error(response.status_message || response.message || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error('Erreur:', err);
      toast.error(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  }, [newTranslation, editingTranslation, resetTranslationForm, fetchTranslations]);

  const handleAddLanguage = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!newLanguage.language.trim() || !newLanguage.language_code.trim()) {
        toast.error('Veuillez remplir tous les champs');
        setIsSubmitting(false);
        return;
      }

      const response = await createLanguage(newLanguage);

      if (response?.data?.success) {
        toast.success('Langue ajoutée avec succès');
        setShowAddLanguageModal(false);
        setNewLanguage({ language: '', language_code: '' });
        await fetchLanguages();
      } else {
        throw new Error(response?.data?.status_message || 'Erreur lors de l\'ajout de la langue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de l\'ajout de la langue');
    } finally {
      setIsSubmitting(false);
    }
  }, [newLanguage, fetchLanguages]);

  const handleDeleteTranslation = useCallback(async (id) => {
    try {
      setIsSubmitting(true);
      const response = await deleteTranslation(id);
      if (response?.success) {
        toast.success('Traduction supprimée avec succès');
        await fetchTranslations();
        setShowDeleteModal(false);
        setTranslationToDelete(null);
      } else {
        throw new Error(response?.error?.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la suppression de la traduction');
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchTranslations]);

  const confirmDeleteTranslation = useCallback((translation) => {
    setTranslationToDelete(translation);
    setShowDeleteModal(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
    resetTranslationForm();
  }, [resetTranslationForm]);

  useEffect(() => {
    fetchLanguages();
    fetchTranslations();
  }, [fetchLanguages, fetchTranslations]);

  const columns = [
    {
      name: 'Langues',
      selector: (row) => `${languages[row.source_language]} → ${languages[row.target_language]}`,
      sortable: true,
      cell: (row) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          {languages[row.source_language]} → {languages[row.target_language]}
        </span>
      ),
      width: '180px',
    },
    {
      name: 'Texte source',
      selector: (row) => row.source_text,
      sortable: true,
      cell: (row) => (
        <div className="p-2 max-w-md">
          <p className="text-gray-800 line-clamp-2">{row.source_text}</p>
        </div>
      ),
      grow: 2,
    },
    {
      name: 'Texte traduit',
      selector: (row) => row.target_text,
      sortable: true,
      cell: (row) => (
        <div className="p-2 max-w-md">
          <p className="text-gray-800 line-clamp-2">{row.target_text}</p>
        </div>
      ),
      grow: 2,
    },
    {
      name: 'Ajouté par',
      selector: (row) => row.user?.name || 'Anonyme',
      sortable: true,
      cell: (row) => (
        <div className="p-2">
          <p className="text-gray-700 font-medium">{row.user?.name || 'Anonyme'}</p>
        </div>
      ),
      width: "240px",
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleEditTranslation(row)}
            className="px-3 py-1.5 bg-transparent border border-green-500 text-green-500 rounded-md hover:bg-green-600 hover:text-white transition-colors shadow-sm"
          >
            Modifier
          </button>
          <button
            type="button"
            onClick={() => confirmDeleteTranslation(row)}
            className="px-3 py-1.5 bg-transparent border border-red-500 text-red-500 rounded-md hover:bg-red-600 hover:text-white transition-colors shadow-sm"
          >
            Supprimer
          </button>
        </div>
      ),
      width: '240px',
    },
  ];

  const filteredTranslations = translations.filter((translation) => {
    if (filterLang === 'all') return true;
    return (
      translation.source_language === filterLang ||
      translation.target_language === filterLang
    );
  });

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des traductions</h1>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowAddLanguageModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouvelle langue
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouvelle traduction
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">Liste des traductions</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Filtrer par langue:
            </span>
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              disabled={loading}
            >
              <option value="all">Toutes les langues</option>
              {loading ? (
                <option disabled>Chargement des langues...</option>
              ) : (
                Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredTranslations}
          progressPending={loading}
          pagination
          paginationPerPage={10}
          highlightOnHover
          noDataComponent={
            <div className="p-6 text-center text-gray-500">
              Aucune traduction trouvée
            </div>
          }
          customStyles={{
            headRow: {
              style: {
                backgroundColor: '#f9fafb',
                borderBottomWidth: '2px',
                borderColor: '#e5e7eb',
                fontWeight: 'bold',
              },
            },
            rows: {
              style: {
                minHeight: '72px',
                '&:not(:last-of-type)': {
                  borderBottomWidth: '1px',
                  borderColor: '#f3f4f6',
                },
                '&:hover': {
                  backgroundColor: '#f9fafb',
                },
              },
            },
            pagination: {
              style: {
                borderTopWidth: '1px',
                borderColor: '#e5e7eb',
              },
            },
          }}
        />
      </div>

      {/* Modal pour ajouter une langue */}
      <Modal isOpen={showAddLanguageModal} onClose={() => setShowAddLanguageModal(false)}>
        <LanguageModalContent
          isSubmitting={isSubmitting}
          newLanguage={newLanguage}
          handleLanguageInputChange={handleLanguageInputChange}
          handleAddLanguage={handleAddLanguage}
          onClose={() => setShowAddLanguageModal(false)}
        />
      </Modal>

      {/* Modal pour ajouter/modifier une traduction */}
      <Modal isOpen={showAddModal} onClose={closeAddModal}>
        <TranslationModalContent
          key={editingTranslation ? `edit-${editingTranslation.id}` : 'add-new'}
          editingTranslation={editingTranslation}
          isSubmitting={isSubmitting}
          newTranslation={newTranslation}
          handleInputChange={handleInputChange}
          handleCreateTranslation={handleCreateTranslation}
          languages={languages}
          onClose={closeAddModal}
        />
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-rose-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmer la suppression</h3>

          {translationToDelete && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700">Langues :</p>
                <p className="text-sm text-gray-900">
                  {languages[translationToDelete.source_language]} → {languages[translationToDelete.target_language]}
                </p>
              </div>
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700">Texte source :</p>
                <p className="text-sm text-gray-900 line-clamp-2">{translationToDelete.source_text}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Texte traduit :</p>
                <p className="text-sm text-gray-900 line-clamp-2">{translationToDelete.target_text}</p>
              </div>
            </div>
          )}

          <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer cette traduction ? Cette action est irréversible.
          </p>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => translationToDelete && handleDeleteTranslation(translationToDelete.id)}
              disabled={isSubmitting}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Translations;
