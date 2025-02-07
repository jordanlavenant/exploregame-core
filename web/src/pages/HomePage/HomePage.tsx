import React, { useState } from 'react';
import { Metadata, TypedDocumentNode, useMutation, useQuery } from '@redwoodjs/web';
import { Trash, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { back, navigate, routes } from '@redwoodjs/router';
import { DeleteNewsMutation, DeleteNewsMutationVariables, DeleteScriptMutation, DeleteScriptMutationVariables, UpdateScriptMutation, UpdateScriptMutationVariables } from 'types/graphql';
import NavBar from 'src/components/NavBar'

const HOME_QUERY = gql`
  query HOME_QUERY {
    scripts {
      id
      name
      visible
      Department {
        name
        ColorSet {
          primary
        }
      }
    }
    departments {
      id
      name
      ColorSet {
        primary
      }
    }
    newses {
      id
      title
      description
      date
    }
  }
`;

const UPDATE_SCRIPT_VISIBILITY: TypedDocumentNode<
  UpdateScriptMutation, 
  UpdateScriptMutationVariables
  >= gql`
  mutation UpdateScriptVisibility($id: String!, $input: UpdateScriptInput!) {
    updateScript(id: $id, input: $input) {
      id
      visible
    }
  }
`;

const DELETE_SCRIPT: TypedDocumentNode<
  DeleteScriptMutation,
  DeleteScriptMutationVariables
> = gql`
  mutation DeleteScript($id: String!) {
    deleteScript(id: $id) {
      id
    }
  }
`;

const DELETE_NEWS: TypedDocumentNode<
  DeleteNewsMutation,
  DeleteNewsMutationVariables
> = gql`
  mutation DeleteNews($id: String!) {
    deleteNews(id: $id) {
      id
    }
  }
`;

const HomePage = () => {
  // Requêtes
  const { data, loading, error } = useQuery(HOME_QUERY);
  const [updateScript] = useMutation(UPDATE_SCRIPT_VISIBILITY);
  const [deleteScript] = useMutation(DELETE_SCRIPT);
  const [deleteNews] = useMutation(DELETE_NEWS);

  // Etat des éléments sélectionné pour les modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState(null);
  const [typeModal, setTypeModal] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  // Données récupérées par la requête
  var scripts = data?.scripts;
  const departments = data?.departments;

  const handleUpdateVisibility = (id, visible) => {
    updateScript({
      variables: {
        id,
        input: { visible },
      },
    });
    handleCloseModal();
  };

  const handleDeleteScript = () => {
    deleteScript({
      variables: {
        id: selectedScript.id,
      },
    });
    scripts = scripts.filter((script) => script.id !== selectedScript.id);
    handleCloseModal();
  };

  const handleDeleteNews = () => {
    console.log("🔴 handleDeleteNews appelé !");
  
    deleteNews({
      variables: { id: selectedNews.id },
      update: (cache) => {
        cache.modify({
          fields: {
            newses(existingNewsRefs, { readField }) {
              return existingNewsRefs.filter(
                (newsRef) => readField("id", newsRef) !== selectedNews.id
              );
            },
          },
        });
      },
    })
      .then(() => console.log("✅ Suppression réussie et cache mis à jour !"))
      .catch((error) => console.error("❌ Erreur lors de la suppression :", error));
  
    handleCloseModal();
  };
  

  const handleDeleteClick = (script) => {
    setSelectedScript(script);
    setTypeModal('delete');
    setIsModalOpen(true);
  };

  const handleDeleteClickNews = (news) => {
    setSelectedNews(news);
    setTypeModal('deleteNews');
    setIsModalOpen(true);
  }

  const handleVisibilityClick = (script) => {
    setSelectedScript(script);
    setTypeModal('visibility');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedScript(null);
    setTypeModal(null);
  };

  const createModal = (typeModal) => {
    if (typeModal === 'delete') {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded text-black">
            <h2 className="text-xl font-bold mb-2">Confirmer la suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer le script {selectedScript?.name} ?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="ghost" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteScript}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (typeModal === 'visibility') {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded text-black">
            <h2 className="text-xl font-bold mb-2">Changer la visibilité</h2>
            <p>Êtes-vous sûr de vouloir changer la visibilité du script {selectedScript?.name} ?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="ghost" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={() => handleUpdateVisibility(selectedScript.id, !selectedScript.visible)}>
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      );
    }
    else if (typeModal === 'deleteNews') {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded text-black">
            <h2 className="text-xl font-bold mb-2">Confirmer la suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer l'actualité {selectedNews?.title} ?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="ghost" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteNews}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <Metadata title="Home" description="Home page" />
      {loading && <p>Loading scenarios...</p>}
      {error && <p>Error loading scenarios</p>}
      <NavBar />
      <div className="flex justify-center mb-4">
        <img alt="Logo Explore-Game" src="/explore-game-logo.png" className="w-32 sm:w-48" />
      </div>

      {scripts && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
          {/* Scénarios */}
          <div className="p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-center">Scénarios visible</h2>
            <Card className="p-4 w-full max-w-lg">
              {scripts
                .filter((script) => script.visible)
                .map((script) => (
                  <div
                    key={script.id}
                    className="p-2 border rounded-lg mb-4"
                    style={{
                      borderColor: script.Department.ColorSet.primary,
                    }}
                  >
                    <h2 className="text-center font-bold mb-2">{script.name}</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <p className="text-sm mb-2 sm:mb-0">Département : {script.Department.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm">Visibilité :</p>
                        <Switch
                          checked={script.visible}
                          onCheckedChange={() => handleVisibilityClick(script)}
                        />
                      </div>
                      <div className="flex space-x-2">
                      <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(routes.editScript({ id: script.id }))}
                        >
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(script)}>
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              <div className="flex justify-center mt-4">
                <Button onClick={() => navigate(routes.scripts())}>Gérer tous les scénarios</Button>
              </div>
            </Card>
          </div>

          {/* Actualités */}
            <div className="p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-center">Les actualités</h2>
            <Card className="p-4 w-full max-w-lg">
              {data.newses.slice(0, 3).map((news) => (
              <div key={news.id} className="p-2 border rounded-lg mb-4">
              <h3 className="text-xl font-bold mb-2">{news.title}</h3>
              <p className="text-sm mb-2">{news.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm mb-2 flex-grow text-left">Date : {new Date(news.date).toLocaleDateString()}</p>
                <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => navigate(routes.editNews({ id: news.id }))}>
                <Pencil />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteClickNews(news)}>
                <Trash />
                </Button>
                </div>
              </div>
              </div>
              ))}
              <div className="flex justify-center mt-4">
              <Button onClick={() => navigate(routes.newses())}>Gérer toutes les actualités</Button>
              </div>
            </Card>
            </div>
          {/* Départements */}
          <div className="p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-center">Les départements</h2>
            <Card className="p-4 w-full max-w-lg">
              {departments.map((department) => (
                <div
                  key={department.id}
                  className="p-2 border rounded-lg mb-4 cursor-pointer"
                  onClick={() => navigate(routes.department({ id: department.id }))}
                  style={{
                  borderColor: department.ColorSet.primary,
                  }}
                >
                  <h3 className="text-center">{department.name}</h3>
                </div>
              ))}
              <div className="flex justify-center mt-4">
                <Button onClick={() => navigate(routes.departments())}>Gérer tous les départements</Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {isModalOpen && (
        createModal(typeModal)
      )}
    </>
  );
};

export default HomePage;
