import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import {
  getAllTranslations,
  createTranslation,
  updateTranslation,
  deleteTranslation,
} from '../../api/requests/translationsRequest';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configuration des langues disponibles
const LANGUAGE_OPTIONS = {
  fr: 'Français',
  en: 'Anglais',
  es: 'Espagnol',
  Mo: 'Moore',
  Di: 'Dioula',
  Go: 'Gourma'
};

const Translations = () => {
  const [translations, setTranslations] = useState([]);
  const [newTranslation, setNewTranslation] = useState({
    source_text: '',
    target_text: '',
    source_language: 'fr',
    target_language: 'en'
  });
  const [editingTranslation, setEditingTranslation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterLang, setFilterLang] = useState('all');
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [translationToDelete, setTranslationToDelete] = useState(null);

  // Récupérer les traductions
  const fetchTranslations = async () => {
    setLoading(true);
    try {
      const response = await getAllTranslations();

      if (response?.success && Array.isArray(response?.data)) {
        setTranslations(response.data);
      } else {
        throw new Error(response?.error?.message || 'Format de données incorrect');
      }
    } catch (err) {
      console.error("Erreur:", err);
      toast.error(err.message || 'Erreur de chargement des traductions');
      setTranslations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  // Créer une nouvelle traduction
  const handleCreateTranslation = async (e) => {
    e.preventDefault();

    // Validations
    if (!newTranslation.source_text.trim() || !newTranslation.target_text.trim()) {
      toast.error('Les champs de texte ne peuvent pas être vides');
      return;
    }

    if (newTranslation.source_language === newTranslation.target_language) {
      toast.error('Les langues source et cible doivent être différentes');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createTranslation(newTranslation);

      if (response.status_code === 200 || response.success) {
        toast.success(response.status_message || 'Traduction créée avec succès!');

        // Rafraîchir la liste complète
        await fetchTranslations();

        setNewTranslation({
          source_text: '',
          target_text: '',
          source_language: 'fr',
          target_language: 'en'
        });
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
  };

  // Supprimer une traduction
  const handleDelete = (translationId) => {
    setTranslationToDelete(translationId);
    setConfirmDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!translationToDelete) return;

    setLoading(true);
    try {
      const response = await deleteTranslation(translationToDelete);

      if (response.success) {
        await fetchTranslations();
        toast.success(response.message || 'Traduction supprimée avec succès!');
      } else {
        toast.error(response.error?.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error("Erreur:", err);
      toast.error('Une erreur est survenue lors de la suppression');
    } finally {
      setLoading(false);
      setConfirmDeleteModal(false);
      setTranslationToDelete(null);
    }
  };

  // Modifier une traduction
  const handleEdit = (translation) => {
    setEditingTranslation({ ...translation });
  };

  const handleUpdate = async () => {
    if (!editingTranslation) return;

    if (!editingTranslation.source_text.trim() || !editingTranslation.target_text.trim()) {
      toast.error('Les champs de texte ne peuvent pas être vides');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateTranslation(editingTranslation.id, editingTranslation);

      if (response.success) {
        await fetchTranslations();
        setEditingTranslation(null);
        toast.success('Traduction mise à jour avec succès!');
      } else {
        toast.error(response.error?.message || 'Erreur lors de la modification');
      }
    } catch (err) {
      toast.error('Une erreur est survenue lors de la modification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrer les traductions
  const filteredTranslations = translations.filter(translation => {
    if (filterLang === 'all') return true;
    return translation.source_language === filterLang ||
           translation.target_language === filterLang;
  });

  // Configuration des colonnes
  const columns = [
    {
      name: 'Langues',
      selector: row => `${LANGUAGE_OPTIONS[row.source_language]} → ${LANGUAGE_OPTIONS[row.target_language]}`,
      sortable: true,
      cell: row => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {LANGUAGE_OPTIONS[row.source_language]} → {LANGUAGE_OPTIONS[row.target_language]}
        </span>
      ),
      width: '180px',
    },
    {
      name: 'Texte source',
      selector: row => row.source_text,
      sortable: true,
      cell: row => (
        <div className="p-2 max-w-md">
          <p className="text-gray-700 line-clamp-2">{row.source_text}</p>
        </div>
      ),
      grow: 2,
    },
    {
      name: 'Texte traduit',
      selector: row => row.target_text,
      sortable: true,
      cell: row => (
        <div className="p-2 max-w-md">
          <p className="text-gray-700 line-clamp-2">{row.target_text}</p>
        </div>
      ),
      grow: 2,
    },
    {
      name: 'Ajouté par',
      selector: row => row.user?.name || 'Utilisateur',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Date',
      selector: row => new Date(row.created_at).toLocaleDateString('fr-FR'),
      sortable: true,
      width: '100px',
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="px-3 py-1 text-xs border border-transparent rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            Modifier
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-3 py-1 text-xs border border-transparent rounded-md text-red-700 bg-red-100 hover:bg-red-200"
          >
            Supprimer
          </button>
        </div>
      ),
      width: '200px',
    },
  ];

  // Styles personnalisés
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f3f4f6',
        color: '#374151',
        fontSize: '0.875rem',
        fontWeight: '600',
      },
    },
    rows: {
      style: {
        minHeight: '72px',
        fontSize: '0.875rem',
        '&:nth-of-type(odd)': {
          backgroundColor: '#f9fafb',
        },
        '&:hover': {
          backgroundColor: '#f3f4f6',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestionnaire de Traductions</h1>
            <p className="mt-2 text-gray-600">Gérez et créez vos traductions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouvelle traduction
          </button>
        </div>

        {/* Filtre */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filtrer par langue:</span>
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">Toutes les langues</option>
              {Object.entries(LANGUAGE_OPTIONS).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredTranslations}
            pagination
            paginationPerPage={10}
            keyField="id"
            progressPending={loading}
            customStyles={customStyles}
            noDataComponent={
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune traduction</h3>
                <p className="mt-1 text-gray-500">Ajoutez votre première traduction</p>
              </div>
            }
          />
        </div>
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Ajouter une traduction</h3>
            <form onSubmit={handleCreateTranslation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Langue source</label>
                  <select
                    value={newTranslation.source_language}
                    onChange={(e) => setNewTranslation({ ...newTranslation, source_language: e.target.value })}
                    className="w-full p-2 rounded-lg border-gray-300 shadow-sm"
                  >
                    {Object.entries(LANGUAGE_OPTIONS).map(([code, name]) => (
                      <option key={`src-${code}`} value={code}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Langue cible</label>
                  <select
                    value={newTranslation.target_language}
                    onChange={(e) => setNewTranslation({ ...newTranslation, target_language: e.target.value })}
                    className="w-full p-2 rounded-lg border-gray-300 shadow-sm"
                  >
                    {Object.entries(LANGUAGE_OPTIONS).map(([code, name]) => (
                      <option key={`tgt-${code}`} value={code}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texte source</label>
                <textarea
                  value={newTranslation.source_text}
                  onChange={(e) => setNewTranslation({ ...newTranslation, source_text: e.target.value })}
                  className="w-full p-2 rounded-lg border-gray-300 shadow-sm"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texte traduit</label>
                <textarea
                  value={newTranslation.target_text}
                  onChange={(e) => setNewTranslation({ ...newTranslation, target_text: e.target.value })}
                  className="w-full p-2 rounded-lg border-gray-300 shadow-sm"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'En cours...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {editingTranslation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Modifier la traduction</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Langue source</label>
                  <select
                    value={editingTranslation.source_language}
                    onChange={(e) => setEditingTranslation({ ...editingTranslation, source_language: e.target.value })}
                    className="w-full p-2 rounded-lg border-gray-300 shadow-sm"
                  >
                    {Object.entries(LANGUAGE_OPTIONS).map(([code, name]) => (
                      <option key={`edit-src-${code}`} value={code}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Langue cible</label>
                  <select
                    value={editingTranslation.target_language}
                    onChange={(e) => setEditingTranslation({ ...editingTranslation, target_language: e.target.value })}
                    className="w-full p-2 rounded-lg border-gray-300 shadow-sm"
                  >
                    {Object.entries(LANGUAGE_OPTIONS).map(([code, name]) => (
                      <option key={`edit-tgt-${code}`} value={code}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texte source</label>
                <textarea
                  value={editingTranslation.source_text}
                  onChange={(e) => setEditingTranslation({ ...editingTranslation, source_text: e.target.value })}
                  className="w-full p-2 rounded-lg border-gray-300 shadow-sm"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texte traduit</label>
                <textarea
                  value={editingTranslation.target_text}
                  onChange={(e) => setEditingTranslation({ ...editingTranslation, target_text: e.target.value })}
                  className="w-full p-2 rounded-lg border-gray-300 shadow-sm"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setEditingTranslation(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'En cours...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmer la suppression</h3>
              <p className="text-sm text-gray-500 mb-6">
                Êtes-vous sûr de vouloir supprimer cette traduction ?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setConfirmDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Translations;
