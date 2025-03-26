import { useState, useEffect } from 'react'

import {
  MoreHorizontal,
  Search,
  Plus,
  ArrowUpDown,
  Grid,
  LayoutList,
  Filter,
  Trash2,
  Edit,
  X,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import type {
  DeleteScriptStepMutation,
  DeleteScriptStepMutationVariables,
  FindScriptSteps,
  UpdateScriptStepMutation,
  UpdateScriptStepMutationVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'

import { QUERY } from 'src/components/ScriptStep/ScriptStepsCell'
import { truncate } from 'src/lib/formatters'

// Shadcn UI components
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { saveScriptSteps } from '@/utils/scriptSteps'

const DELETE_SCRIPT_STEP_MUTATION: TypedDocumentNode<
  DeleteScriptStepMutation,
  DeleteScriptStepMutationVariables
> = gql`
  mutation DeleteScriptStepMutation($id: String!) {
    deleteScriptStep(id: $id) {
      id
    }
  }
`

const UPDATE_SCRIPT_STEP_MUTATION: TypedDocumentNode<
  UpdateScriptStepMutation,
  UpdateScriptStepMutationVariables
> = gql`
  mutation UpdateScriptStepAfterDeletation(
    $id: String!
    $input: UpdateScriptStepInput!
  ) {
    updateScriptStep(id: $id, input: $input) {
      id
      order
    }
  }
`

const ScriptStepsList = ({ scriptSteps }: FindScriptSteps) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [filteredScriptSteps, setFilteredScriptSteps] = useState(scriptSteps)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedScript, setSelectedScript] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<
    'Step.name' | 'Script.name' | 'lettre' | 'order'
  >('order')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [stepToDelete, setStepToDelete] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  const [updateScriptStep] = useMutation(UPDATE_SCRIPT_STEP_MUTATION)
  const [deleteScriptStep] = useMutation(DELETE_SCRIPT_STEP_MUTATION, {
    onCompleted: () => {
      toast.success('Étape supprimée', {
        description: "L'étape a été supprimée avec succès",
        action: {
          label: 'Fermer',
          onClick: () => console.log('Toast fermé'),
        },
      })
      setDialogOpen(false)
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression', {
        description: error.message,
      })
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteScriptStepMutationVariables['id']) => {
    setStepToDelete(id)
    setDialogOpen(true)
  }

  const confirmDelete = () => {
    if (stepToDelete) {
      deleteScriptStep({ variables: { id: stepToDelete } }).then(() => {
        const currScriptStep = scriptSteps.find((s) => s.id === stepToDelete)
        const scriptStepsSameScript = scriptSteps.filter(
          (s) => s.scriptId === currScriptStep.scriptId && s.id !== stepToDelete
        )
        const newScriptSteps = []
        scriptStepsSameScript.forEach((scriptStep, index) => {
          newScriptSteps.push({
            id: scriptStep.id,
            order: index,
          })
        })
        saveScriptSteps({
          currScriptSteps: newScriptSteps,
          updateScriptStep,
        })
      })
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedScript(null)
    setSortBy('order')
    setSortDirection('asc')
  }

  // Get unique scripts from scriptSteps for filtering
  const scripts = Array.from(
    new Set(scriptSteps.map((step) => step.Script.id))
  ).map((scriptId) => {
    const step = scriptSteps.find((s) => s.Script.id === scriptId)
    return {
      id: scriptId,
      name: step?.Script.name || 'Unknown',
    }
  })

  // Update the count of active filters
  useEffect(() => {
    let count = 0
    if (searchTerm) count++
    if (selectedScript) count++
    if (sortBy !== 'order' || sortDirection !== 'asc') count++

    setActiveFilters(count)
  }, [searchTerm, selectedScript, sortBy, sortDirection])

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    let filtered = [...scriptSteps]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (step) =>
          step.Step.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          step.Script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          step.lettre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply script filter
    if (selectedScript) {
      filtered = filtered.filter((step) => step.Script.id === selectedScript)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB

      if (sortBy === 'Step.name') {
        valueA = a.Step.name.toLowerCase()
        valueB = b.Step.name.toLowerCase()
      } else if (sortBy === 'Script.name') {
        valueA = a.Script.name.toLowerCase()
        valueB = b.Script.name.toLowerCase()
      } else if (sortBy === 'lettre') {
        valueA = a.lettre.toLowerCase()
        valueB = b.lettre.toLowerCase()
      } else {
        // order
        valueA = a.order
        valueB = b.order
        // Sort numerically for order
        if (sortDirection === 'asc') {
          return valueA - valueB
        } else {
          return valueB - valueA
        }
      }

      // For string comparisons
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB)
      } else {
        return valueB.localeCompare(valueA)
      }
    })

    setFilteredScriptSteps(filtered)
  }, [scriptSteps, searchTerm, selectedScript, sortBy, sortDirection])

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <div className="space-y-6">
      {/* Header with title and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Étapes de scénario
          </h2>
          <p className="text-muted-foreground mt-1">
            Gérez les différentes étapes utilisées dans les scénarios
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile filter button */}
          <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden relative">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
                {activeFilters > 0 && (
                  <Badge className="ml-2 bg-primary absolute -top-2 -right-2">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtres et recherche</SheetTitle>
                <SheetDescription>
                  Filtrer et trier la liste des étapes
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="mobile-search">Rechercher</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mobile-search"
                      placeholder="Nom ou lettre..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="mobile-script">Scénario</Label>
                  <Select
                    value={selectedScript || 'all'}
                    onValueChange={(value) =>
                      setSelectedScript(value === 'all' ? null : value)
                    }
                  >
                    <SelectTrigger id="mobile-script">
                      <SelectValue placeholder="Tous les scénarios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les scénarios</SelectItem>
                      {scripts.map((script) => (
                        <SelectItem key={script.id} value={script.id}>
                          {script.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Trier par</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={sortBy === 'order' ? 'default' : 'outline'}
                      onClick={() => setSortBy('order')}
                      className="justify-start"
                    >
                      Ordre
                    </Button>
                    <Button
                      variant={sortBy === 'Step.name' ? 'default' : 'outline'}
                      onClick={() => setSortBy('Step.name')}
                      className="justify-start"
                    >
                      Nom de l&apos;étape
                    </Button>
                    <Button
                      variant={sortBy === 'Script.name' ? 'default' : 'outline'}
                      onClick={() => setSortBy('Script.name')}
                      className="justify-start"
                    >
                      Nom du scénario
                    </Button>
                    <Button
                      variant={sortBy === 'lettre' ? 'default' : 'outline'}
                      onClick={() => setSortBy('lettre')}
                      className="justify-start"
                    >
                      Lettre
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Direction de tri</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={sortDirection === 'asc' ? 'default' : 'outline'}
                      onClick={() => setSortDirection('asc')}
                      className="justify-start"
                    >
                      Ascendant
                    </Button>
                    <Button
                      variant={sortDirection === 'desc' ? 'default' : 'outline'}
                      onClick={() => setSortDirection('desc')}
                      className="justify-start"
                    >
                      Descendant
                    </Button>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={clearFilters}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
                <Button onClick={() => setFilterSheetOpen(false)}>
                  Appliquer
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Desktop view toggle buttons */}
          <div className="hidden md:flex border rounded-md">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-r-none"
                    onClick={() => setViewMode('table')}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Vue tableau</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-l-none"
                    onClick={() => setViewMode('cards')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Vue cartes</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Desktop filter button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="hidden sm:flex relative">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtres
                {activeFilters > 0 && (
                  <Badge className="ml-2 bg-primary absolute -top-2 -right-2">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filtres et tri</h4>

                <div className="space-y-2">
                  <Label htmlFor="desktop-search">Rechercher</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="desktop-search"
                      placeholder="Nom ou lettre..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desktop-script">Scénario</Label>
                  <Select
                    value={selectedScript || 'all'}
                    onValueChange={(value) =>
                      setSelectedScript(value === 'all' ? null : value)
                    }
                  >
                    <SelectTrigger id="desktop-script">
                      <SelectValue placeholder="Tous les scénarios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les scénarios</SelectItem>
                      {scripts.map((script) => (
                        <SelectItem key={script.id} value={script.id}>
                          {script.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Trier par</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={sortBy === 'order' ? 'default' : 'outline'}
                      onClick={() => setSortBy('order')}
                    >
                      Ordre
                    </Button>
                    <Button
                      size="sm"
                      variant={sortBy === 'Step.name' ? 'default' : 'outline'}
                      onClick={() => setSortBy('Step.name')}
                    >
                      Étape
                    </Button>
                    <Button
                      size="sm"
                      variant={sortBy === 'Script.name' ? 'default' : 'outline'}
                      onClick={() => setSortBy('Script.name')}
                    >
                      Scénario
                    </Button>
                    <Button
                      size="sm"
                      variant={sortBy === 'lettre' ? 'default' : 'outline'}
                      onClick={() => setSortBy('lettre')}
                    >
                      Lettre
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleSortDirection}
                    >
                      <ArrowUpDown
                        className={`h-4 w-4 ${sortDirection === 'asc' ? '' : 'rotate-180'}`}
                      />
                    </Button>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-3 w-3" />
                    Réinitialiser les filtres
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Mobile view toggle */}
          <div className="md:hidden border rounded-md">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="icon"
              className="rounded-r-none h-9 w-9"
              onClick={() => setViewMode('table')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="icon"
              className="rounded-l-none h-9 w-9"
              onClick={() => setViewMode('cards')}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>

          {/* New scriptStep button */}
          <Link to={routes.newScriptStep()}>
            <Button>
              <Plus className="sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Nouvelle Étape</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Active filters */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>

          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Recherche:{' '}
              {searchTerm.length > 15 ? truncate(searchTerm) : searchTerm}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {selectedScript && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Scénario:{' '}
              {scripts.find((s) => s.id === selectedScript)?.name || 'Unknown'}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => setSelectedScript(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {(sortBy !== 'order' || sortDirection !== 'asc') && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tri:{' '}
              {sortBy === 'order'
                ? 'Ordre'
                : sortBy === 'Step.name'
                  ? 'Étape'
                  : sortBy === 'Script.name'
                    ? 'Scénario'
                    : 'Lettre'}{' '}
              ({sortDirection === 'asc' ? '↑' : '↓'})
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => {
                  setSortBy('order')
                  setSortDirection('asc')
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={clearFilters}
          >
            Effacer tout
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="mt-2">
        {filteredScriptSteps.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <h3 className="text-lg font-medium">Aucune étape trouvée</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || selectedScript
                  ? "Essayez d'ajuster vos filtres."
                  : 'Ajoutez votre première étape pour commencer.'}
              </p>
              {searchTerm || selectedScript ? (
                <Button variant="outline" onClick={clearFilters}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Réinitialiser les filtres
                </Button>
              ) : (
                <Link to={routes.newScriptStep()}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Étape
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ) : (
          <>
            {/* Table view */}
            {viewMode === 'table' && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] text-center">
                        Ordre
                      </TableHead>
                      <TableHead className="w-[200px]">Étape</TableHead>
                      <TableHead>Scénario</TableHead>
                      <TableHead className="w-[80px] text-center">
                        Lettre
                      </TableHead>
                      <TableHead className="w-[100px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScriptSteps.map((scriptStep) => (
                      <TableRow key={scriptStep.id} className="group">
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-mono">
                            {scriptStep.order + 1}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link
                            to={routes.editScriptStep({ id: scriptStep.id })}
                            className="hover:underline focus:underline focus:outline-none"
                          >
                            {scriptStep.Step.name}
                          </Link>
                        </TableCell>
                        <TableCell>{scriptStep.Script.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="default"
                            className="font-mono text-lg"
                          >
                            {scriptStep.lettre}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-70 group-hover:opacity-100"
                                    asChild
                                  >
                                    <Link
                                      to={routes.editScriptStep({
                                        id: scriptStep.id,
                                      })}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Modifier</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive opacity-70 group-hover:opacity-100"
                                    onClick={() => onDeleteClick(scriptStep.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Supprimer</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Cards view */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredScriptSteps.map((scriptStep) => (
                  <Card
                    key={scriptStep.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <Badge variant="outline" className="font-mono">
                          Ordre: {scriptStep.order}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link
                                to={routes.editScriptStep({
                                  id: scriptStep.id,
                                })}
                              >
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => onDeleteClick(scriptStep.id)}
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">
                        {scriptStep.Step.name}
                      </CardTitle>
                      <CardDescription>
                        Scénario: {scriptStep.Script.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                      <div className="flex flex-col items-center bg-muted rounded-md p-4">
                        <div className="text-xs text-muted-foreground mb-2">
                          Lettre
                        </div>
                        <div className="text-4xl font-bold font-mono">
                          {scriptStep.lettre || '-'}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end p-4 pt-0">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            to={routes.editScriptStep({ id: scriptStep.id })}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Éditer
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeleteClick(scriptStep.id)}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Supprimer
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette étape ? Cette action est
              irréversible et les ordres des étapes suivantes seront réajustés.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ScriptStepsList
