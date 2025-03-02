import { useCallback, useEffect, useRef, useState } from 'react'

import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown, GripVertical } from 'lucide-react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useForm } from 'react-hook-form'
import type {
  EditScriptStepById,
  Location,
  Script,
  ScriptStep,
  UpdateScriptStepInput,
} from 'types/graphql'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

import type { RWGqlError } from '@redwoodjs/forms'
import { back } from '@redwoodjs/router'

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

const DraggableItem = ({
  scriptStep,
  index,
  moveCard,
  current,
}: {
  scriptStep: Partial<ScriptStep>
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
  current: boolean
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'CARD',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const [, drop] = useDrop({
    accept: 'CARD',
    hover(item: { index: number }) {
      if (!ref.current) return

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      moveCard(dragIndex, hoverIndex)
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
          current && 'border-blue-500'
        )}
      >
        <CardContent className="p-3 flex items-center gap-3">
          <div ref={ref} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
          </div>
          <div
            className={cn(
              'font-mono text-sm w-6',
              current ? 'text-blue-500' : 'text-muted-foreground'
            )}
          >
            {scriptStep?.lettre || '?'}
          </div>
          <div className="flex-grow">
            <div className={cn('font-medium', current && 'text-blue-500')}>
              {scriptStep?.Step?.name}
            </div>
          </div>
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

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const newScriptSteps = [...currScriptSteps]
      const dragCard = { ...newScriptSteps[dragIndex] }
      const hoverCard = { ...newScriptSteps[hoverIndex] }

      // Swap the order values
      const tempOrder = dragCard.order
      dragCard.order = hoverCard.order
      hoverCard.order = tempOrder

      // Swap the positions in the array
      newScriptSteps[dragIndex] = hoverCard
      newScriptSteps[hoverIndex] = dragCard

      setCurrScriptSteps(newScriptSteps)
    },
    [currScriptSteps]
  )

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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const { stepId, stepName, locationId } = data
    // création d'une nouvelle étape
    if (!stepId) {
      saveScriptSteps({
        currScriptSteps: currScriptSteps,
        updateScriptStep: updateScriptStep,
      }).then(() => {
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
      })
    } else {
      // modification d'une étape existante
      const previous = {
        id: stepId,
        name: props.scriptStep?.Step?.name,
        locationId: props.scriptStep?.Step?.Location?.id,
      }
      saveScriptSteps({
        currScriptSteps: currScriptSteps,
        updateScriptStep: updateScriptStep,
      }).then(() => {
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
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-4 mb-24"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l&apos;étape</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
              <CardTitle>Placement de l&apos;étape</CardTitle>
              <H4 className="text-muted-foreground">
                <span className="text-blue-500">{currScriptSteps.length}</span>{' '}
                étape(s)
              </H4>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto pr-1">
                <DndProvider backend={HTML5Backend}>
                  {currScriptSteps.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Aucune étape associée à ce scénario.</p>
                    </div>
                  ) : (
                    currScriptSteps.map((scriptStep, index) => (
                      <DraggableItem
                        key={index}
                        index={index}
                        scriptStep={scriptStep}
                        moveCard={moveCard}
                        current={
                          scriptStep?.id === props.scriptStep?.id ||
                          scriptStep?.id === currScriptStep?.id
                        }
                      />
                    ))
                  )}
                </DndProvider>
              </div>
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
