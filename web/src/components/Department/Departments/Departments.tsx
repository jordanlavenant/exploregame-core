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
  DeleteDepartmentMutation,
  DeleteDepartmentMutationVariables,
  FindDepartments,
  FindColorSets,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'

import { QUERY as COLOR_SETS_QUERY } from 'src/components/ColorSet/ColorSetsCell'
import { QUERY as DEPARTMENTS_QUERY } from 'src/components/Department/DepartmentsCell'
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

const DELETE_DEPARTMENT_MUTATION: TypedDocumentNode<
  DeleteDepartmentMutation,
  DeleteDepartmentMutationVariables
> = gql`
  mutation DeleteDepartmentMutation($id: String!) {
    deleteDepartment(id: $id) {
      id
    }
  }
`

const DepartmentsList = ({
  departments: initialDepartments,
}: FindDepartments) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [departments, setDepartments] = useState(initialDepartments)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedColorSet, setSelectedColorSet] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'description'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(
    null
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  const { data: colorSetsData } = useQuery<FindColorSets>(COLOR_SETS_QUERY)

  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT_MUTATION, {
    onCompleted: () => {
      toast.success('Filière supprimée', {
        description: 'La filière a été supprimée avec succès',
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
    refetchQueries: [{ query: DEPARTMENTS_QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteDepartmentMutationVariables['id']) => {
    setDepartmentToDelete(id)
    setDialogOpen(true)
  }

  const confirmDelete = () => {
    if (departmentToDelete) {
      deleteDepartment({ variables: { id: departmentToDelete } })
    }
  }

  const getColorSet = (colorSetId: string) => {
    const colorSet = colorSetsData?.colorSets.find(
      (set) => set.id === colorSetId
    )
    return colorSet
      ? colorSet
      : { primary: '#cccccc', secondary: '#dddddd', tertiary: '#eeeeee' }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedColorSet(null)
    setSortBy('name')
    setSortDirection('asc')
  }

  // Update the count of active filters
  useEffect(() => {
    let count = 0
    if (searchTerm) count++
    if (selectedColorSet) count++
    if (sortBy !== 'name' || sortDirection !== 'asc') count++

    setActiveFilters(count)
  }, [searchTerm, selectedColorSet, sortBy, sortDirection])

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    let filtered = [...initialDepartments]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (dept) =>
          dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply color set filter
    if (selectedColorSet) {
      filtered = filtered.filter((dept) => dept.colorSetId === selectedColorSet)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const valueA = a[sortBy].toLowerCase()
      const valueB = b[sortBy].toLowerCase()

      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB)
      } else {
        return valueB.localeCompare(valueA)
      }
    })

    setDepartments(filtered)
  }, [initialDepartments, searchTerm, selectedColorSet, sortBy, sortDirection])

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  const colorSets = colorSetsData?.colorSets || []

  return (
    <div className="space-y-6">
      {/* Header with title and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Filières</h2>
          <p className="text-muted-foreground mt-1">
            Gérez les filières de formation disponibles
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
                  Filtrer et trier la liste des filières
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="mobile-search">Rechercher</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mobile-search"
                      placeholder="Nom ou description..."
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
                  <Label htmlFor="mobile-colorset">Palette de couleurs</Label>
                  <Select
                    value={selectedColorSet || 'all'}
                    onValueChange={(value) =>
                      setSelectedColorSet(value === 'all' ? null : value)
                    }
                  >
                    <SelectTrigger id="mobile-colorset">
                      <SelectValue placeholder="Toutes les palettes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les palettes</SelectItem>
                      {colorSets.map((set) => (
                        <SelectItem key={set.id} value={set.id}>
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: set.primary }}
                              ></div>
                              <div
                                className="w-3 h-3 mx-0.5 rounded-full"
                                style={{ backgroundColor: set.secondary }}
                              ></div>
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: set.tertiary }}
                              ></div>
                            </div>
                            {set.id || 'Sans nom'}
                          </div>
                        </SelectItem>
                      ))}
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
                      variant={sortBy === 'description' ? 'default' : 'outline'}
                      onClick={() => setSortBy('description')}
                      className="justify-start"
                    >
                      Description
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
                      placeholder="Nom ou description..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desktop-colorset">Palette de couleurs</Label>
                  <Select
                    value={selectedColorSet || 'all'}
                    onValueChange={(value) =>
                      setSelectedColorSet(value === 'all' ? null : value)
                    }
                  >
                    <SelectTrigger id="desktop-colorset">
                      <SelectValue placeholder="Toutes les palettes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les palettes</SelectItem>
                      {colorSets.map((set) => (
                        <SelectItem key={set.id} value={set.id}>
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: set.primary }}
                              ></div>
                              <div
                                className="w-3 h-3 mx-0.5 rounded-full"
                                style={{ backgroundColor: set.secondary }}
                              ></div>
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: set.tertiary }}
                              ></div>
                            </div>
                            {set.id || 'Sans nom'}
                          </div>
                        </SelectItem>
                      ))}
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
                      variant={sortBy === 'description' ? 'default' : 'outline'}
                      onClick={() => setSortBy('description')}
                    >
                      Description
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

          {/* New department button */}
          <Link to={routes.newDepartment()}>
            <Button>
              <Plus className="sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Nouvelle Filière</span>
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

          {selectedColorSet && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Palette:{' '}
              {colorSets.find((set) => set.id === selectedColorSet)?.id ||
                'Sans nom'}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => setSelectedColorSet(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {(sortBy !== 'name' || sortDirection !== 'asc') && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tri: {sortBy === 'name' ? 'Nom' : 'Description'} (
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
        {departments.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <h3 className="text-lg font-medium">Aucune filière trouvée</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || selectedColorSet
                  ? "Essayez d'ajuster vos filtres."
                  : 'Ajoutez votre première filière pour commencer.'}
              </p>
              {searchTerm || selectedColorSet ? (
                <Button variant="outline" onClick={clearFilters}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Réinitialiser les filtres
                </Button>
              ) : (
                <Link to={routes.newDepartment()}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Filière
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
                      <TableHead className="w-[180px]">Nom</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Description
                      </TableHead>
                      <TableHead className="w-[150px]">Palette</TableHead>
                      <TableHead className="w-[100px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((department) => {
                      const colorSet = getColorSet(department.colorSetId)
                      return (
                        <TableRow key={department.id} className="group">
                          <TableCell className="font-medium">
                            {department.name}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {truncate(department.description)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="flex space-x-1">
                                <div
                                  className="w-5 h-5 rounded"
                                  style={{ backgroundColor: colorSet.primary }}
                                  title="Couleur principale"
                                ></div>
                                <div
                                  className="w-5 h-5 rounded"
                                  style={{
                                    backgroundColor: colorSet.secondary,
                                  }}
                                  title="Couleur secondaire"
                                ></div>
                                <div
                                  className="w-5 h-5 rounded"
                                  style={{ backgroundColor: colorSet.tertiary }}
                                  title="Couleur tertiaire"
                                ></div>
                              </div>
                            </div>
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
                                        to={routes.editDepartment({
                                          id: department.id,
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
                                      onClick={() =>
                                        onDeleteClick(department.id)
                                      }
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
                {departments.map((department) => {
                  const colorSet = getColorSet(department.colorSetId)
                  return (
                    <Card
                      key={department.id}
                      className="overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div
                        className="w-full h-2"
                        style={{
                          background: `linear-gradient(to right, ${colorSet.primary}, ${colorSet.secondary}, ${colorSet.tertiary})`,
                        }}
                      ></div>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="flex justify-between items-start">
                          {department.name}
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
                                  to={routes.editDepartment({
                                    id: department.id,
                                  })}
                                >
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => onDeleteClick(department.id)}
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {department.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="grid grid-cols-3 gap-1 mt-2">
                          <div
                            className="w-full h-8 rounded"
                            style={{ backgroundColor: colorSet.primary }}
                            title="Couleur principale"
                          ></div>
                          <div
                            className="w-full h-8 rounded"
                            style={{ backgroundColor: colorSet.secondary }}
                            title="Couleur secondaire"
                          ></div>
                          <div
                            className="w-full h-8 rounded"
                            style={{ backgroundColor: colorSet.tertiary }}
                            title="Couleur tertiaire"
                          ></div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end p-4 pt-0">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              to={routes.editDepartment({ id: department.id })}
                            >
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
              Êtes-vous sûr de vouloir supprimer cette filière ? Cette action
              est irréversible.
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

export default DepartmentsList
