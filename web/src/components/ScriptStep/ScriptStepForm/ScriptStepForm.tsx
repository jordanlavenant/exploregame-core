import { useCallback, useEffect, useRef, useState } from 'react'

import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronRight, ChevronsUpDown, GripVertical } from 'lucide-react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useForm } from 'react-hook-form'
import type {
  EditScriptStepById,
  Location,
  Question,
  Script,
  ScriptStep,
  UpdateScriptStepInput,
} from 'types/graphql'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

import type { RWGqlError } from '@redwoodjs/forms'
import { back, navigate } from '@redwoodjs/router'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { H4 } from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import { saveScriptSteps } from '@/utils/scriptSteps'
import { changeStep, saveStep } from '@/utils/steps'

type FormScriptStep = NonNullable<EditScriptStepById['scriptStep']>

interface ScriptStepFormProps {
  scriptStep?: EditScriptStepById['scriptStep']
  onSave: (data: UpdateScriptStepInput, id?: FormScriptStep['id']) => void
  error: RWGqlError
  loading: boolean
}

const SCRIPTSTEP_FORM_QUERY = gql`
  query ScriptForm {
    scripts {
      id
      name
      ScriptStep {
        id
        order
        lettre
        Step {
          name
        }
      }
    }
    locations {
      id
      name
    }
  }
`

const STEP_QUESTIONS_QUERY = gql`
  query StepQuestionsQuery($stepId: String!) {
    step(id: $stepId) {
      id
      name
      Questions {
        id
        question
        description
        order
        questionTypeId
        QuestionType {
          type
        }
      }
    }
  }
`

const UPDATE_QUESTION_ORDER_MUTATION = gql`
  mutation UpdateQuestionOrder($id: String!, $input: UpdateQuestionInput!) {
    updateQuestion(id: $id, input: $input) {
      id
      order
    }
  }
`

const CREATE_STEP_MUTATION = gql`
  mutation CreateStepFunc($input: CreateStepInput!) {
    createStep(input: $input) {
      id
      name
      locationId
    }
  }
`

const UPDATE_STEP_MUTATION = gql`
  mutation UpdateStepFunc($id: String!, $input: UpdateStepInput!) {
    updateStep(id: $id, input: $input) {
      id
    }
  }
`

const UPDATE_SCRIPT_STEP_MUTATION = gql`
  mutation UpdateScriptStepFunc($id: String!, $input: UpdateScriptStepInput!) {
    updateScriptStep(id: $id, input: $input) {
      id
    }
  }
`

export const formSchema = z.object({
  scriptId: z.string().nonempty(),
  stepId: z.string().optional(),
  stepName: z.string().nonempty(),
  locationId: z.string().nonempty(),
  lettre: z.string().nonempty(),
  order: z.number().int(),
})

const DraggableQuestion = ({
  question,
  index,
  moveQuestion,
  onClick,
}: {
  question: Partial<Question>
  index: number
  moveQuestion: (dragIndex: number, hoverIndex: number) => void
  onClick: () => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'QUESTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const [, drop] = useDrop({
    accept: 'QUESTION',
    hover(item: { index: number }) {
      if (!ref.current) return

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      moveQuestion(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={dragPreview}
      className={cn('transition-all duration-200', isDragging && 'opacity-50')}
      onClick={onClick}
    >
      <Card className="mb-2 hover:border-primary cursor-pointer group">
        <CardContent className="p-3 flex items-center gap-3">
          <div ref={ref} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
          </div>
          <div className="flex-grow">
            <div className="font-medium">{question?.question}</div>
            <div className="text-xs text-muted-foreground">
              {question?.QuestionType?.type}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
        </CardContent>
      </Card>
    </div>
  )
}

const DraggableScriptStep = ({
  scriptStep,
  index,
  moveScriptStep,
  isCurrent,
}: {
  scriptStep: Partial<ScriptStep>
  index: number
  moveScriptStep: (dragIndex: number, hoverIndex: number) => void
  isCurrent: boolean
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'SCRIPT_STEP',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const [, drop] = useDrop({
    accept: 'SCRIPT_STEP',
    hover(item: { index: number }) {
      if (!ref.current) return

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      moveScriptStep(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={dragPreview}
      className={cn('transition-all duration-200', isDragging && 'opacity-50')}
    >
      <Card
        className={cn(
          'mb-2 hover:border-primary cursor-pointer group',
          isCurrent && 'border-primary'
        )}
      >
        <CardContent className="p-3 flex items-center gap-3">
          <div ref={ref} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
          </div>
          <div className="font-mono text-sm text-muted-foreground w-6">
            {scriptStep.lettre}
          </div>
          <div className="flex-grow">
            <div className="font-medium">{scriptStep.Step?.name}</div>
          </div>
          {isCurrent && (
            <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
              Actuelle
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const ScriptStepForm = (props: ScriptStepFormProps) => {
  const { data, loading, error } = useQuery(SCRIPTSTEP_FORM_QUERY)
  const [createStep] = useMutation(CREATE_STEP_MUTATION)
  const [updateStep] = useMutation(UPDATE_STEP_MUTATION)
  const [updateScriptStep] = useMutation(UPDATE_SCRIPT_STEP_MUTATION)
  const [updateQuestionOrder] = useMutation(UPDATE_QUESTION_ORDER_MUTATION)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scriptId: props.scriptStep?.scriptId || '',
      stepId: props.scriptStep?.stepId || '',
      stepName: props.scriptStep?.Step?.name || '',
      locationId: props.scriptStep?.Step?.Location?.id || '',
      lettre: props.scriptStep?.lettre || '',
      order: props.scriptStep?.order || 0,
    },
  })

  const [currScriptSteps, setCurrScriptSteps] = useState<Partial<ScriptStep>[]>(
    []
  )
  const [currScriptStep, setCurrScriptStep] =
    useState<Partial<ScriptStep> | null>(null)
  const [questions, setQuestions] = useState<Partial<Question>[]>([])

  // Fetch questions when stepId changes
  const { data: _stepQuestionsData, loading: questionsLoading } = useQuery(
    STEP_QUESTIONS_QUERY,
    {
      variables: {
        stepId: form.watch('stepId') || props.scriptStep?.stepId,
      },
      skip: !form.watch('stepId') && !props.scriptStep?.stepId,
      onCompleted: (data) => {
        if (data?.step?.Questions) {
          setQuestions(
            [...data.step.Questions].sort((a, b) => a.order - b.order)
          )
        }
      },
    }
  )

  useEffect(() => {
    const currScriptId = form.watch('scriptId')
    if (!currScriptId) return
    setCurrScriptSteps(
      data?.scripts.find((script) => script.id === currScriptId)?.ScriptStep ||
        []
    )
  }, [form.watch('scriptId'), data])

  useEffect(() => {
    const stepName = form.watch('stepName')
    const lettre = form.watch('lettre')
    if (!props.scriptStep) {
      if (!currScriptStep) {
        setCurrScriptStep({
          id: uuidv4(),
          order: currScriptSteps.length + 1,
          lettre: lettre,
          Step: {
            name: stepName,
          },
        })
      } else {
        setCurrScriptStep({
          ...currScriptStep,
          lettre: lettre,
          Step: {
            name: stepName,
          },
        })
      }
    }
  }, [form.watch('scriptId'), form.watch('stepName'), form.watch('lettre')])

  useEffect(() => {
    if (currScriptStep) {
      const newScriptSteps = currScriptSteps.map((scriptStep) => {
        if (scriptStep.id === currScriptStep.id) {
          return {
            ...currScriptStep,
            order: scriptStep.order,
          }
        }
        return scriptStep
      })
      if (
        !newScriptSteps.find(
          (scriptStep) => scriptStep.id === currScriptStep.id
        )
      ) {
        setCurrScriptSteps([
          ...newScriptSteps,
          {
            ...currScriptStep,
            order: newScriptSteps.length,
          },
        ])
      } else {
        setCurrScriptSteps(newScriptSteps)
      }
    }
  }, [currScriptStep])

  useEffect(() => {
    if (props.scriptStep) {
      const scriptStep = currScriptSteps.find(
        (scriptStep) => scriptStep.id === props.scriptStep?.id
      )
      form.setValue('order', scriptStep?.order)
    } else {
      const scriptStep = currScriptSteps.find(
        (scriptStep) => scriptStep.id === currScriptStep?.id
      )
      form.setValue('order', scriptStep?.order)
    }
  }, [currScriptSteps])

  const moveQuestion = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragQuestion = questions[dragIndex]
      const newQuestions = [...questions]

      // Remove the dragged item
      newQuestions.splice(dragIndex, 1)
      // Insert it at the new position
      newQuestions.splice(hoverIndex, 0, dragQuestion)

      // Update the order value for each question
      const updatedQuestions = newQuestions.map((question, idx) => ({
        ...question,
        order: idx,
      }))

      setQuestions(updatedQuestions)
    },
    [questions]
  )

  const moveScriptStep = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragStep = currScriptSteps[dragIndex]
      const newSteps = [...currScriptSteps]

      // Remove the dragged item
      newSteps.splice(dragIndex, 1)
      // Insert it at the new position
      newSteps.splice(hoverIndex, 0, dragStep)

      // Update the order value for each step
      const updatedSteps = newSteps.map((step, idx) => ({
        ...step,
        order: idx,
      }))

      setCurrScriptSteps(updatedSteps)
    },
    [currScriptSteps]
  )

  const saveQuestionOrder = async () => {
    try {
      const promises = questions.map((question) =>
        updateQuestionOrder({
          variables: {
            id: question.id,
            input: {
              order: question.order,
            },
          },
        })
      )
      await Promise.all(promises)
    } catch (error) {
      console.error('Error updating question order:', error)
    }
  }

  const navigateToQuestion = (id: string) => {
    navigate(`/questions/${id}/edit`)
  }

  if (loading)
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )

  if (error)
    return (
      <div className="p-8 text-red-500">
        Erreur de chargement: {error.message}
      </div>
    )

  const scripts: Script[] = data.scripts
  const locations: Location[] = data.locations

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { stepId, stepName, locationId } = data

    // Save script steps order
    await saveScriptSteps({
      currScriptSteps: currScriptSteps,
      updateScriptStep: updateScriptStep,
    })

    // Save question order if there are questions
    if (questions.length > 0) {
      await saveQuestionOrder()
    }

    // création d'une nouvelle étape
    if (!stepId) {
      saveStep({
        name: stepName,
        locationId: locationId,
        createStep: createStep,
      }).then((stepId) => {
        props.onSave(
          {
            scriptId: data.scriptId,
            stepId: stepId,
            lettre: data.lettre,
            order: data.order,
          },
          props?.scriptStep?.id
        )
      })
    } else {
      // modification d'une étape existante
      const previous = {
        id: stepId,
        name: props.scriptStep?.Step?.name,
        locationId: props.scriptStep?.Step?.Location?.id,
      }
      changeStep({
        previous: previous,
        name: stepName,
        locationId: locationId,
        updateStep: updateStep,
      }).then(() => {
        props.onSave(
          {
            scriptId: data.scriptId,
            stepId: data.stepId,
            lettre: data.lettre,
            order: data.order,
          },
          props?.scriptStep?.id
        )
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-4 mb-24"
      >
        <div className="grid md:grid-cols-3 gap-4 *:p-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l&apos;étape</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="stepName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intitulé de l&apos;étape</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Intitulé de l'étape" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu associé</FormLabel>
                    {loading || !locations ? (
                      <Skeleton className="w-full h-10" />
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? locations.find(
                                    (location) => location.id === field.value
                                  )?.name
                                : 'Choisir un lieu...'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandList>
                              <CommandEmpty>Aucun lieu trouvé.</CommandEmpty>
                              <CommandGroup>
                                {locations.map((location: Location) => (
                                  <CommandItem
                                    className="cursor-pointer"
                                    value={location.id}
                                    key={location.id}
                                    onSelect={() => {
                                      form.setValue('locationId', location.id)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        location.id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {location.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lettre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lettre associée</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={1}
                        className="w-20"
                        placeholder="A"
                      />
                    </FormControl>
                    <FormDescription>
                      Une lettre unique pour identifier cette étape
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scriptId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scénario associé</FormLabel>
                    {loading || !scripts ? (
                      <Skeleton className="w-full h-10" />
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? scripts.find(
                                    (script) => script.id === field.value
                                  )?.name
                                : 'Choisir un scénario...'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandList>
                              <CommandEmpty>
                                Aucun scénario trouvé.
                              </CommandEmpty>
                              <CommandGroup>
                                {scripts.map((script: Script) => (
                                  <CommandItem
                                    className="cursor-pointer"
                                    value={script.id}
                                    key={script.id}
                                    onSelect={() => {
                                      form.setValue('scriptId', script.id)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        script.id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {script.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Ordre des étapes du scénario</CardTitle>
              <div className="text-sm text-muted-foreground">
                {currScriptSteps.length} étape(s)
              </div>
            </CardHeader>
            <CardContent className="max-h-72 overflow-y-auto pr-1">
              {form.watch('scriptId') ? (
                <DndProvider backend={HTML5Backend}>
                  <div>
                    {currScriptSteps.map((scriptStep, index) => (
                      <DraggableScriptStep
                        key={scriptStep.id}
                        scriptStep={scriptStep}
                        index={index}
                        moveScriptStep={moveScriptStep}
                        isCurrent={
                          props.scriptStep?.id === scriptStep.id ||
                          currScriptStep?.id === scriptStep.id
                        }
                      />
                    ))}
                  </div>
                </DndProvider>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Sélectionnez un scénario pour voir ses étapes</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Questions associées</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/questions/new')}
              >
                Ajouter une question
              </Button>
            </CardHeader>
            <CardContent>
              {questionsLoading || !form.watch('stepId') ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Aucune question associée à cette étape.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate('/questions/new')}
                  >
                    Créer une première question
                  </Button>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto pr-1">
                  <H4 className="mb-4 text-muted-foreground">
                    <span className="text-blue-500">{questions.length}</span>{' '}
                    question(s)
                  </H4>
                  <DndProvider backend={HTML5Backend}>
                    <div>
                      {questions.map((question, index) => (
                        <DraggableQuestion
                          key={question.id}
                          question={question}
                          index={index}
                          moveQuestion={moveQuestion}
                          onClick={() => navigateToQuestion(question.id)}
                        />
                      ))}
                    </div>
                  </DndProvider>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <footer
          className="border-t-2 py-6 fixed left-0 bottom-0 w-full flex justify-center items-center gap-4 bg-background z-10"
          style={{
            backdropFilter: 'blur(8px)',
          }}
        >
          <Button variant="outline" onClick={() => back()} type="button">
            Annuler
          </Button>
          <Button type="submit" disabled={props.loading}>
            Sauvegarder
          </Button>
        </footer>
      </form>
    </Form>
  )
}

export default ScriptStepForm
