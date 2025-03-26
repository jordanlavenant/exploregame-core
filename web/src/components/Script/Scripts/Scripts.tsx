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
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import type {
  DeleteScriptMutation,
  DeleteScriptMutationVariables,
  FindScripts,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'

import { QUERY } from 'src/components/Script/ScriptsCell'
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
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

const DELETE_SCRIPT_MUTATION: TypedDocumentNode<
  DeleteScriptMutation,
  DeleteScriptMutationVariables
> = gql`
  mutation DeleteScriptMutation($id: String!) {
    deleteScript(id: $id) {
      id
    }
  }
`

const ScriptsList = ({ scripts: initialScripts }: FindScripts) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [scripts, setScripts] = useState(initialScripts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  )
  const [visibilityFilter, setVisibilityFilter] = useState<boolean | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'department'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [scriptToDelete, setScriptToDelete] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  const [deleteScript] = useMutation(DELETE_SCRIPT_MUTATION, {
    onCompleted: () => {
      toast.success('Scénario supprimé', {
        description: 'Le scénario a été supprimé avec succès',
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

  const onDeleteClick = (id: DeleteScriptMutationVariables['id']) => {
    setScriptToDelete(id)
    setDialogOpen(true)
  }

  const confirmDelete = () => {
    if (scriptToDelete) {
      deleteScript({ variables: { id: scriptToDelete } })
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedDepartment(null)
    setVisibilityFilter(null)
    setSortBy('name')
    setSortDirection('asc')
  }

  // Get unique departments from scripts for filtering
  const departments = Array.from(
    new Set(initialScripts.map((script) => script.Department.id))
  ).map((deptId) => {
    const script = initialScripts.find((s) => s.Department.id === deptId)
    return {
      id: deptId,
      name: script?.Department.name || 'Unknown',
    }
  })

  // Update the count of active filters
  useEffect(() => {
    let count = 0
    if (searchTerm) count++
    if (selectedDepartment) count++
    if (visibilityFilter !== null) count++
    if (sortBy !== 'name' || sortDirection !== 'asc') count++

    setActiveFilters(count)
  }, [searchTerm, selectedDepartment, visibilityFilter, sortBy, sortDirection])

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    let filtered = [...initialScripts]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((script) =>
        script.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply department filter
    if (selectedDepartment) {
      filtered = filtered.filter(
        (script) => script.Department.id === selectedDepartment
      )
    }

    // Apply visibility filter
    if (visibilityFilter !== null) {
      filtered = filtered.filter(
        (script) => script.visible === visibilityFilter
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB

      if (sortBy === 'name') {
        valueA = a.name.toLowerCase()
        valueB = b.name.toLowerCase()
      } else {
        // department
        valueA = a.Department.name.toLowerCase()
        valueB = b.Department.name.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB)
      } else {
        return valueB.localeCompare(valueA)
      }
    })

    setScripts(filtered)
  }, [
    initialScripts,
    searchTerm,
    selectedDepartment,
    visibilityFilter,
    sortBy,
    sortDirection,
  ])

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  // Helper function to get secret word from script steps
  const getSecretWord = (script) => {
    return script.ScriptStep.reduce((acc, step) => acc + step.lettre, '')
  }

  return (
    <div className="space-y-6">
      {/* Header with title and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scénarios</h2>
          <p className="text-muted-foreground mt-1">
            Gérez les scénarios de jeu disponibles
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
                  Filtrer et trier la liste des scénarios
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="mobile-search">Rechercher</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mobile-search"
                      placeholder="Nom du scénario..."
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
                  <Label htmlFor="mobile-department">Filière</Label>
                  <Select
                    value={selectedDepartment || 'all'}
                    onValueChange={(value) =>
                      setSelectedDepartment(value === 'all' ? null : value)
                    }
                  >
                    <SelectTrigger id="mobile-department">
                      <SelectValue placeholder="Toutes les filières" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les filières</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="mobile-visibility">Visibilité</Label>
                  <Select
                    value={
                      visibilityFilter === null
                        ? 'all'
                        : visibilityFilter
                          ? 'visible'
                          : 'hidden'
                    }
                    onValueChange={(value) => {
                      if (value === 'all') setVisibilityFilter(null)
                      else if (value === 'visible') setVisibilityFilter(true)
                      else setVisibilityFilter(false)
                    }}
                  >
                    <SelectTrigger id="mobile-visibility">
                      <SelectValue placeholder="Tous les scénarios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les scénarios</SelectItem>
                      <SelectItem value="visible">Visible</SelectItem>
                      <SelectItem value="hidden">Masqué</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Trier par</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={sortBy === 'name' ? 'default' : 'outline'}
                      onClick={() => setSortBy('name')}
                      className="justify-start"
                    >
                      Nom
                    </Button>
                    <Button
                      variant={sortBy === 'department' ? 'default' : 'outline'}
                      onClick={() => setSortBy('department')}
                      className="justify-start"
                    >
                      Filière
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
                      placeholder="Nom du scénario..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desktop-department">Filière</Label>
                  <Select
                    value={selectedDepartment || 'all'}
                    onValueChange={(value) =>
                      setSelectedDepartment(value === 'all' ? null : value)
                    }
                  >
                    <SelectTrigger id="desktop-department">
                      <SelectValue placeholder="Toutes les filières" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les filières</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desktop-visibility">Visibilité</Label>
                  <Select
                    value={
                      visibilityFilter === null
                        ? 'all'
                        : visibilityFilter
                          ? 'visible'
                          : 'hidden'
                    }
                    onValueChange={(value) => {
                      if (value === 'all') setVisibilityFilter(null)
                      else if (value === 'visible') setVisibilityFilter(true)
                      else setVisibilityFilter(false)
                    }}
                  >
                    <SelectTrigger id="desktop-visibility">
                      <SelectValue placeholder="Tous les scénarios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les scénarios</SelectItem>
                      <SelectItem value="visible">Visible</SelectItem>
                      <SelectItem value="hidden">Masqué</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Trier par</Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={sortBy === 'name' ? 'default' : 'outline'}
                      onClick={() => setSortBy('name')}
                    >
                      Nom
                    </Button>
                    <Button
                      size="sm"
                      variant={sortBy === 'department' ? 'default' : 'outline'}
                      onClick={() => setSortBy('department')}
                    >
                      Filière
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

          {/* New script button */}
          <Link to={routes.newScript()}>
            <Button>
              <Plus className="sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Nouveau Scénario</span>
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

          {selectedDepartment && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Filière:{' '}
              {departments.find((d) => d.id === selectedDepartment)?.name ||
                'Unknown'}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => setSelectedDepartment(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {visibilityFilter !== null && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {visibilityFilter ? 'Visible uniquement' : 'Masqué uniquement'}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => setVisibilityFilter(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {(sortBy !== 'name' || sortDirection !== 'asc') && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tri: {sortBy === 'name' ? 'Nom' : 'Filière'} (
              {sortDirection === 'asc' ? '↑' : '↓'})
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => {
                  setSortBy('name')
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
        {scripts.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <h3 className="text-lg font-medium">Aucun scénario trouvé</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || selectedDepartment || visibilityFilter !== null
                  ? "Essayez d'ajuster vos filtres."
                  : 'Ajoutez votre premier scénario pour commencer.'}
              </p>
              {searchTerm || selectedDepartment || visibilityFilter !== null ? (
                <Button variant="outline" onClick={clearFilters}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Réinitialiser les filtres
                </Button>
              ) : (
                <Link to={routes.newScript()}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Scénario
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
                      <TableHead className="w-[200px]">Nom</TableHead>
                      <TableHead className="w-[100px] text-center">
                        Visible
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Filière
                      </TableHead>
                      <TableHead className="w-[120px]">Mot secret</TableHead>
                      <TableHead className="w-[100px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scripts.map((script) => {
                      const secretWord = getSecretWord(script)
                      return (
                        <TableRow key={script.id} className="group">
                          <TableCell className="font-medium">
                            <Link
                              to={routes.editScript({ id: script.id })}
                              className="hover:underline focus:underline focus:outline-none"
                            >
                              {script.name}
                            </Link>
                          </TableCell>
                          <TableCell className="text-center">
                            {script.visible ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-400 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {script.Department.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {secretWord || 'Aucun'}
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
                                        to={routes.editScript({
                                          id: script.id,
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
                                      onClick={() => onDeleteClick(script.id)}
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
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Cards view */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {scripts.map((script) => {
                  const secretWord = getSecretWord(script)
                  return (
                    <Card
                      key={script.id}
                      className="overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-center mb-1">
                          <Badge
                            variant={script.visible ? 'default' : 'secondary'}
                            className="mb-2"
                          >
                            {script.visible ? 'Visible' : 'Masqué'}
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
                                  to={routes.editScript({
                                    id: script.id,
                                  })}
                                >
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => onDeleteClick(script.id)}
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardTitle className="text-lg">
                          <Link
                            to={routes.editScript({ id: script.id })}
                            className="hover:underline focus:underline focus:outline-none"
                          >
                            {script.name}
                          </Link>
                        </CardTitle>
                        <CardDescription>
                          Filière: {script.Department.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-1">
                        <div className="bg-muted rounded-md p-2 font-mono text-center">
                          <div className="text-xs text-muted-foreground mb-1">
                            Mot secret
                          </div>
                          <div className="text-lg tracking-wider">
                            {secretWord || (
                              <span className="text-muted-foreground text-sm">
                                Aucun
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end p-4 pt-0">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={routes.editScript({ id: script.id })}>
                              <Edit className="mr-1 h-3 w-3" />
                              Éditer
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
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
              Êtes-vous sûr de vouloir supprimer ce scénario ? Cette action est
              irréversible.
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

export default ScriptsList
