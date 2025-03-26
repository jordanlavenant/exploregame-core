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
  Eye,
  HelpCircle,
  ListOrdered,
} from 'lucide-react'
import { toast } from 'sonner'
import type {
  DeleteQuestionMutation,
  DeleteQuestionMutationVariables,
  UpdateQuestionMutation,
  UpdateQuestionMutationVariables,
  FindSteps,
  FindQuestions,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'

import { QUERY as QUESTIONS_QUERY } from 'src/components/Question/QuestionsCell'
import { QUERY as STEPS_QUERY } from 'src/components/Step/StepsCell'
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
import { saveQuestions } from '@/utils/questions'

const DELETE_QUESTION_MUTATION: TypedDocumentNode<
  DeleteQuestionMutation,
  DeleteQuestionMutationVariables
> = gql`
  mutation DeleteQuestionMutation($id: String!) {
    deleteQuestion(id: $id) {
      id
    }
  }
`

const UPDATE_QUESTION_MUTATION: TypedDocumentNode<
  UpdateQuestionMutation,
  UpdateQuestionMutationVariables
> = gql`
  mutation UpdateQuestionAfterDeletation(
    $id: String!
    $input: UpdateQuestionInput!
  ) {
    updateQuestion(id: $id, input: $input) {
      id
      order
    }
  }
`

const QuestionsList = ({ questions }: FindQuestions) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [filteredQuestions, setFilteredQuestions] = useState(questions)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<
    'question' | 'QuestionType.type' | 'step.name' | 'order'
  >('order')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  const { data: stepsData } = useQuery<FindSteps>(STEPS_QUERY)
  const [updateQuestion] = useMutation(UPDATE_QUESTION_MUTATION)
  const [deleteQuestion] = useMutation(DELETE_QUESTION_MUTATION, {
    onCompleted: () => {
      toast.success('Question supprimée', {
        description: 'La question a été supprimée avec succès',
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
    refetchQueries: [{ query: QUESTIONS_QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteQuestionMutationVariables['id']) => {
    setQuestionToDelete(id)
    setDialogOpen(true)
  }

  const confirmDelete = () => {
    if (questionToDelete) {
      deleteQuestion({ variables: { id: questionToDelete } }).then(() => {
        const question = questions.find((q) => q.id === questionToDelete)
        const questionsSameStep = questions.filter(
          (q) => q.Step.id === question?.Step.id && q.id !== questionToDelete
        )
        const newQuestions = []
        questionsSameStep.forEach((question, index) => {
          newQuestions.push({
            id: question.id,
            order: index,
          })
        })
        saveQuestions({
          currQuestions: newQuestions,
          updateQuestion,
        })
      })
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedStep(null)
    setSelectedType(null)
    setSortBy('order')
    setSortDirection('asc')
  }

  // Get unique steps and question types for filtering
  const steps = stepsData?.steps || []

  const questionTypes = Array.from(
    new Set(questions.map((q) => q.QuestionType.id))
  ).map((typeId) => {
    const question = questions.find((q) => q.QuestionType.id === typeId)
    return {
      id: typeId,
      type: question?.QuestionType.type || 'Unknown Type',
    }
  })

  // Update the count of active filters
  useEffect(() => {
    let count = 0
    if (searchTerm) count++
    if (selectedStep) count++
    if (selectedType) count++
    if (sortBy !== 'order' || sortDirection !== 'asc') count++

    setActiveFilters(count)
  }, [searchTerm, selectedStep, selectedType, sortBy, sortDirection])

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    let filtered = [...questions]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.QuestionType.type
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          q.Step.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply step filter
    if (selectedStep) {
      filtered = filtered.filter((q) => q.Step.id === selectedStep)
    }

    // Apply question type filter
    if (selectedType) {
      filtered = filtered.filter((q) => q.QuestionType.id === selectedType)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB

      if (sortBy === 'question') {
        valueA = a.question.toLowerCase()
        valueB = b.question.toLowerCase()
      } else if (sortBy === 'QuestionType.type') {
        valueA = a.QuestionType.type.toLowerCase()
        valueB = b.QuestionType.type.toLowerCase()
      } else if (sortBy === 'step.name') {
        valueA = a.Step.name.toLowerCase()
        valueB = b.Step.name.toLowerCase()
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

    setFilteredQuestions(filtered)
  }, [questions, searchTerm, selectedStep, selectedType, sortBy, sortDirection])

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <div className="space-y-6">
      {/* Header with title and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Questions</h2>
          <p className="text-muted-foreground mt-1">
            Gérez les questions utilisées dans les étapes
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
                  Filtrer et trier la liste des questions
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="mobile-search">Rechercher</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mobile-search"
                      placeholder="Rechercher..."
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
                  <Label htmlFor="mobile-step">Étape</Label>
                  <Select
                    value={selectedStep || 'all'}
                    onValueChange={(value) =>
                      setSelectedStep(value === 'all' ? null : value)
                    }
                  >
                    <SelectTrigger id="mobile-step">
                      <SelectValue placeholder="Toutes les étapes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les étapes</SelectItem>
                      {steps.map((step) => (
                        <SelectItem key={step.id} value={step.id}>
                          {step.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="mobile-type">Type de question</Label>
                  <Select
                    value={selectedType || 'all'}
                    onValueChange={(value) =>
                      setSelectedType(value === 'all' ? null : value)
                    }
                  >
                    <SelectTrigger id="mobile-type">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.type}
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
                      variant={sortBy === 'question' ? 'default' : 'outline'}
                      onClick={() => setSortBy('question')}
                      className="justify-start"
                    >
                      Question
                    </Button>
                    <Button
                      variant={
                        sortBy === 'QuestionType.type' ? 'default' : 'outline'
                      }
                      onClick={() => setSortBy('QuestionType.type')}
                      className="justify-start"
                    >
                      Type
                    </Button>
                    <Button
                      variant={sortBy === 'step.name' ? 'default' : 'outline'}
                      onClick={() => setSortBy('step.name')}
                      className="justify-start"
                    >
                      Étape
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
                      placeholder="Rechercher..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desktop-step">Étape</Label>
                  <Select
                    value={selectedStep || 'all'}
                    onValueChange={(value) =>
                      setSelectedStep(value === 'all' ? null : value)
                    }
                  >
                    <SelectTrigger id="desktop-step">
                      <SelectValue placeholder="Toutes les étapes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les étapes</SelectItem>
                      {steps.map((step) => (
                        <SelectItem key={step.id} value={step.id}>
                          {step.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desktop-type">Type de question</Label>
                  <Select
                    value={selectedType || 'all'}
                    onValueChange={(value) =>
                      setSelectedType(value === 'all' ? null : value)
                    }
                  >
                    <SelectTrigger id="desktop-type">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.type}
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
                      variant={sortBy === 'question' ? 'default' : 'outline'}
                      onClick={() => setSortBy('question')}
                    >
                      Question
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        sortBy === 'QuestionType.type' ? 'default' : 'outline'
                      }
                      onClick={() => setSortBy('QuestionType.type')}
                    >
                      Type
                    </Button>
                    <Button
                      size="sm"
                      variant={sortBy === 'step.name' ? 'default' : 'outline'}
                      onClick={() => setSortBy('step.name')}
                    >
                      Étape
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

          {/* New question button */}
          <Link to={routes.newQuestion()}>
            <Button>
              <Plus className="sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Nouvelle Question</span>
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

          {selectedStep && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Étape:{' '}
              {steps.find((s) => s.id === selectedStep)?.name || 'Unknown'}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => setSelectedStep(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {selectedType && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type:{' '}
              {questionTypes.find((t) => t.id === selectedType)?.type ||
                'Unknown'}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => setSelectedType(null)}
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
                : sortBy === 'question'
                  ? 'Question'
                  : sortBy === 'QuestionType.type'
                    ? 'Type'
                    : 'Étape'}{' '}
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
        {filteredQuestions.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <h3 className="text-lg font-medium">Aucune question trouvée</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || selectedStep || selectedType
                  ? "Essayez d'ajuster vos filtres."
                  : 'Ajoutez votre première question pour commencer.'}
              </p>
              {searchTerm || selectedStep || selectedType ? (
                <Button variant="outline" onClick={clearFilters}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Réinitialiser les filtres
                </Button>
              ) : (
                <Link to={routes.newQuestion()}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Question
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
                      <TableHead>Question</TableHead>
                      <TableHead className="w-[150px]">Type</TableHead>
                      <TableHead className="w-[180px]">Étape</TableHead>
                      <TableHead className="w-[80px] text-center">
                        Ordre
                      </TableHead>
                      <TableHead className="w-[100px] text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.map((question) => (
                      <TableRow key={question.id} className="group">
                        <TableCell className="font-medium">
                          {truncate(question.question)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {question.QuestionType.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{question.Step.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="font-mono">
                            {question.order}
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
                                      to={routes.editQuestion({
                                        id: question.id,
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
                                    onClick={() => onDeleteClick(question.id)}
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
                {filteredQuestions.map((question) => (
                  <Card
                    key={question.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start mb-1">
                        <Badge variant="outline">
                          {question.QuestionType.type}
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
                                to={routes.editQuestion({ id: question.id })}
                              >
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => onDeleteClick(question.id)}
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-sm line-clamp-2">
                        {question.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <ListOrdered className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Ordre: {question.order}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <CardDescription className="flex items-center gap-1">
                          <HelpCircle className="h-3.5 w-3.5" />
                          Étape: {question.Step.name}
                        </CardDescription>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end p-4 pt-0">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={routes.editQuestion({ id: question.id })}>
                            <Edit className="mr-1 h-3 w-3" />
                            Éditer
                          </Link>
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
              Êtes-vous sûr de vouloir supprimer cette question ? Cette action
              est irréversible et les ordres des questions suivantes dans la
              même étape seront réajustés.
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

export default QuestionsList
