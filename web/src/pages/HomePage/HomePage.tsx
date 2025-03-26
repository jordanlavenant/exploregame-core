import { useState } from 'react'

import {
  BarChart3,
  CalendarIcon,
  FileText,
  Info,
  Layers,
  LayoutDashboard,
  Pencil,
  RefreshCw,
  School,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react'
import type {
  DeleteNewsMutation,
  DeleteNewsMutationVariables,
  DeleteScriptMutation,
  DeleteScriptMutationVariables,
  UpdateScriptMutation,
  UpdateScriptMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import {
  Metadata,
  TypedDocumentNode,
  useMutation,
  useQuery,
} from '@redwoodjs/web'

import NavBar from 'src/components/NavBar'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const HOME_QUERY = gql`
  query HOME_QUERY {
    scripts {
      id
      name
      visible
      departmentId
      Department {
        name
        ColorSet {
          primary
          secondary
          tertiary
        }
      }
      ScriptStep {
        id
      }
    }
    departments {
      id
      name
      description
      ColorSet {
        primary
        secondary
        tertiary
      }
      Script {
        id
        visible
      }
      Player {
        id
      }
    }
    newses {
      id
      title
      description
      date
      tags {
        id
        title
      }
    }
    players {
      id
      username
      Department {
        name
      }
      PlayerScript {
        id
        completed
        score
      }
    }
    steps {
      id
      Questions {
        id
      }
    }
    questions {
      id
    }
  }
`

const UPDATE_SCRIPT_VISIBILITY: TypedDocumentNode<
  UpdateScriptMutation,
  UpdateScriptMutationVariables
> = gql`
  mutation UpdateScriptVisibility($id: String!, $input: UpdateScriptInput!) {
    updateScript(id: $id, input: $input) {
      id
      visible
    }
  }
`

const DELETE_SCRIPT: TypedDocumentNode<
  DeleteScriptMutation,
  DeleteScriptMutationVariables
> = gql`
  mutation DeleteScript($id: String!) {
    deleteScript(id: $id) {
      id
    }
  }
`

const DELETE_NEWS: TypedDocumentNode<
  DeleteNewsMutation,
  DeleteNewsMutationVariables
> = gql`
  mutation DeleteNews($id: String!) {
    deleteNews(id: $id) {
      id
    }
  }
`

const HomePage = () => {
  // Requêtes
  const { data, loading, error, refetch } = useQuery(HOME_QUERY)
  const [updateScript] = useMutation(UPDATE_SCRIPT_VISIBILITY)
  const [deleteScript] = useMutation(DELETE_SCRIPT)
  const [deleteNews] = useMutation(DELETE_NEWS)

  // États
  const [activeTab, setActiveTab] = useState('overview')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteNewsDialogOpen, setDeleteNewsDialogOpen] = useState(false)
  const [selectedScript, setSelectedScript] = useState(null)
  const [selectedNews, setSelectedNews] = useState(null)

  // Calculs des statistiques du dashboard
  const calculateStats = () => {
    if (!data) return {}

    const visibleScripts = data.scripts.filter((s) => s.visible).length
    const hiddenScripts = data.scripts.length - visibleScripts

    const totalPlayers = data.players?.length || 0
    const completedGames =
      data.players?.reduce((total, player) => {
        return (
          total +
          (player.PlayerScript?.filter((ps) => ps.completed)?.length || 0)
        )
      }, 0) || 0

    const totalQuestions = data.questions?.length || 0

    const departmentsWithScripts = data.departments?.reduce((acc, dept) => {
      const scriptCount = dept.Script?.length || 0
      return { ...acc, [dept.name]: scriptCount }
    }, {})

    return {
      totalScripts: data.scripts.length,
      visibleScripts,
      hiddenScripts,
      totalDepartments: data.departments.length,
      totalNews: data.newses.length,
      totalPlayers,
      completedGames,
      totalQuestions,
      departmentsWithScripts,
    }
  }

  const stats = calculateStats()

  // Gestion de la visibilité des scénarios
  const handleToggleVisibility = (id, visible) => {
    updateScript({
      variables: {
        id,
        input: { visible: !visible },
      },
      onCompleted: () => refetch(),
    })
  }

  // Gestion de la suppression des scénarios
  const handleDeleteScript = () => {
    deleteScript({
      variables: {
        id: selectedScript.id,
      },
      onCompleted: () => {
        setDeleteDialogOpen(false)
        setSelectedScript(null)
        refetch()
      },
    })
  }

  // Gestion de la suppression des actualités
  const handleDeleteNews = () => {
    deleteNews({
      variables: { id: selectedNews.id },
      onCompleted: () => {
        setDeleteNewsDialogOpen(false)
        setSelectedNews(null)
        refetch()
      },
    })
  }

  // Formatage de la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('fr-FR', options)
  }

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="h-16 w-16 animate-spin text-primary" />
            <h2 className="text-2xl font-semibold">
              Chargement du tableau de bord...
            </h2>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="flex justify-center items-center h-[80vh]">
          <Card className="w-[500px] max-w-[90%]">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Info className="h-5 w-5" />
                Erreur de chargement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Une erreur s&apos;est produite lors du chargement des données:{' '}
                {error.message}
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </CardFooter>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Metadata
        title="Tableau de bord"
        description="Tableau de bord Explore Game"
      />
      <NavBar />

      <div className="container mx-auto py-6 space-y-8">
        {/* En-tête et logo */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Tableau de bord administrateur
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez les scénarios, départements et actualités de votre
              plateforme
            </p>
          </div>
          <img
            alt="Logo Explore-Game"
            src="/explore-game-logo.png"
            className="w-32 sm:w-36 mt-4 sm:mt-0"
          />
        </div>

        {/* Statistiques générales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Scénarios
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalScripts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.visibleScripts} visibles, {stats.hiddenScripts} masqués
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Départements
              </CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDepartments}</div>
              <p className="text-xs text-muted-foreground">
                Avec leurs couleurs et spécialités
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actualités</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNews}</div>
              <p className="text-xs text-muted-foreground">
                Dernière publication:{' '}
                {data.newses[0] && formatDate(data.newses[0].date)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuestions}</div>
              <p className="text-xs text-muted-foreground">
                Réparties sur {data.steps?.length || 0} étapes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Onglets principaux */}
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Vue d&apos;ensemble</span>
              <span className="sm:hidden">Vue</span>
            </TabsTrigger>
            <TabsTrigger value="scripts">
              <FileText className="h-4 w-4 mr-2" />
              <span>Scénarios</span>
            </TabsTrigger>
            <TabsTrigger value="news">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span>Actualités</span>
            </TabsTrigger>
            <TabsTrigger value="departments">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Départements</span>
              <span className="sm:hidden">Dép.</span>
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Scénarios récents */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Scénarios récents
                  </CardTitle>
                  <CardDescription>
                    Les derniers scénarios visibles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.scripts
                    .filter((script) => script.visible)
                    .slice(0, 4)
                    .map((script) => (
                      <div
                        key={script.id}
                        className="flex items-center justify-between p-2 rounded-md border"
                        style={{
                          borderLeftColor: script.Department.ColorSet.primary,
                          borderLeftWidth: '4px',
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{script.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {script.Department.name}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant={script.visible ? 'default' : 'outline'}
                          >
                            {script.visible ? 'Visible' : 'Masqué'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(routes.scripts())}
                  >
                    Voir tous les scénarios
                  </Button>
                </CardFooter>
              </Card>

              {/* Actualités récentes */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Dernières actualités
                  </CardTitle>
                  <CardDescription>Les actualités récentes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.newses.slice(0, 4).map((news) => (
                    <div
                      key={news.id}
                      className="flex flex-col p-2 rounded-md border"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium truncate">{news.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {formatDate(news.date)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {news.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(routes.newses())}
                  >
                    Voir toutes les actualités
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Départements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <School className="mr-2 h-4 w-4" />
                  Aperçu des départements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {data.departments.map((department) => {
                    const scriptCount = department.Script?.length || 0

                    return (
                      <Card
                        key={department.id}
                        className="overflow-hidden border-t-4 hover:shadow-md transition-shadow cursor-pointer"
                        style={{ borderTopColor: department.ColorSet.primary }}
                        onClick={() =>
                          navigate(routes.department({ id: department.id }))
                        }
                      >
                        <CardContent className="p-3">
                          <h3 className="font-medium text-center truncate mb-1">
                            {department.name}
                          </h3>
                          <div className="flex justify-center items-center gap-1 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            <span>
                              {scriptCount} scénario{scriptCount > 1 ? 's' : ''}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(routes.departments())}
                >
                  Gérer les départements
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Onglet Scénarios */}
          <TabsContent value="scripts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des scénarios</CardTitle>
                <CardDescription>
                  Tous les scénarios disponibles sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.scripts.map((script) => (
                  <div
                    key={script.id}
                    className="p-3 border rounded-lg flex flex-col sm:flex-row sm:items-center gap-3"
                    style={{
                      borderLeftColor: script.Department.ColorSet.primary,
                      borderLeftWidth: '4px',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{script.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Département: {script.Department.name} • Étapes:{' '}
                        {script.ScriptStep?.length || 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 justify-between sm:justify-end">
                      <div className="flex items-center gap-2">
                        <span className="text-sm whitespace-nowrap">
                          Visibilité:
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Switch
                                checked={script.visible}
                                onCheckedChange={() =>
                                  handleToggleVisibility(
                                    script.id,
                                    script.visible
                                  )
                                }
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              {script.visible
                                ? 'Masquer le scénario'
                                : 'Rendre visible'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(routes.editScript({ id: script.id }))
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedScript(script)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate(routes.scripts())}
                >
                  Gérer en détail
                </Button>
                <Button onClick={() => navigate(routes.newScript())}>
                  Nouveau scénario
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Onglet Actualités */}
          <TabsContent value="news" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Actualités récentes</CardTitle>
                <CardDescription>
                  Gérez les actualités de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.newses.map((news) => (
                    <Card key={news.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {news.title}
                          </CardTitle>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                navigate(routes.editNews({ id: news.id }))
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedNews(news)
                                setDeleteNewsDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {formatDate(news.date)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm line-clamp-3">
                          {news.description}
                        </p>
                        {news.tags && news.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {news.tags.map((tag) => (
                              <Badge key={tag.id} variant="outline">
                                {tag.title}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate(routes.newses())}
                >
                  Toutes les actualités
                </Button>
                <Button onClick={() => navigate(routes.newNews())}>
                  Nouvelle actualité
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Onglet Départements */}
          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle>Départements</CardTitle>
                <CardDescription>
                  Tous les départements disponibles sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.departments.map((department) => {
                    const scriptCount = department.Script?.length || 0
                    const playerCount = department.Player?.length || 0

                    return (
                      <Card
                        key={department.id}
                        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() =>
                          navigate(routes.department({ id: department.id }))
                        }
                      >
                        <div
                          className="h-2"
                          style={{
                            backgroundColor: department.ColorSet.primary,
                          }}
                        />
                        <CardHeader className="pb-2">
                          <CardTitle>{department.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm line-clamp-2 mb-4">
                            {department.description || 'Pas de description'}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {scriptCount} scénario
                                {scriptCount > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {playerCount} joueur{playerCount > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="flex gap-1">
                            <div
                              className="w-5 h-5 rounded-full"
                              style={{
                                backgroundColor: department.ColorSet.primary,
                              }}
                              title="Couleur primaire"
                            />
                            <div
                              className="w-5 h-5 rounded-full"
                              style={{
                                backgroundColor: department.ColorSet.secondary,
                              }}
                              title="Couleur secondaire"
                            />
                            <div
                              className="w-5 h-5 rounded-full"
                              style={{
                                backgroundColor: department.ColorSet.tertiary,
                              }}
                              title="Couleur tertiaire"
                            />
                          </div>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate(routes.departments())}
                >
                  Gérer en détail
                </Button>
                <Button onClick={() => navigate(routes.newDepartment())}>
                  Nouveau département
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de confirmation de suppression de scénario */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le scénario &quot;
              {selectedScript?.name}&quot; ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteScript}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression d'actualité */}
      <Dialog
        open={deleteNewsDialogOpen}
        onOpenChange={setDeleteNewsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;actualité &quot;
              {selectedNews?.title}&quot; ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteNewsDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteNews}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default HomePage
