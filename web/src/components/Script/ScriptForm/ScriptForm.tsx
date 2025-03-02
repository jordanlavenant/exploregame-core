import { useCallback, useRef, useState } from 'react'

import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronRight, ChevronsUpDown, GripVertical } from 'lucide-react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useForm } from 'react-hook-form'
import type {
  Department,
  EditScriptById,
  ScriptStep,
  UpdateScriptInput,
} from 'types/graphql'
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
import { Switch } from '@/components/ui/switch'
import { H4 } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

type FormScript = NonNullable<EditScriptById['script']>

interface ScriptFormProps {
  script?: EditScriptById['script']
  onSave: (data: UpdateScriptInput, id?: FormScript['id']) => void
  error: RWGqlError
  loading: boolean
}

const SCRIPT_FORM_QUERY = gql`
  query ScriptStepForm {
    departments {
      id
      name
      description
    }
  }
`

const SCRIPT_WITH_STEPS_QUERY = gql`
  query ScriptWithSteps($id: String!) {
    script(id: $id) {
      id
      name
      visible
      departmentId
      ScriptStep {
        id
        scriptId
        stepId
        lettre
        order
        Step {
          id
          name
          Location {
            name
          }
        }
      }
    }
  }
`

const UPDATE_SCRIPT_STEP_ORDER_MUTATION = gql`
  mutation UpdateScriptStepOrder($id: String!, $input: UpdateScriptStepInput!) {
    updateScriptStep(id: $id, input: $input) {
      id
      order
    }
  }
`

export const formSchema = z.object({
  name: z.string().nonempty(),
  visible: z.boolean(),
  departmentId: z.string().nonempty(),
})

const DraggableItem = ({
  scriptStep,
  index,
  moveCard,
}: {
  scriptStep: ScriptStep
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
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
      <Card className="mb-2 hover:border-primary cursor-pointer group">
        <CardContent className="p-3 flex items-center gap-3">
          <div ref={ref} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
          </div>
          <div className="font-mono text-sm text-muted-foreground w-6">
            {scriptStep.lettre}
          </div>
          <div className="flex-grow">
            <div className="font-medium">{scriptStep.Step.name}</div>
            <div className="text-xs text-muted-foreground">
              {scriptStep.Step.Location?.name}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
        </CardContent>
      </Card>
    </div>
  )
}

const ScriptForm = (props: ScriptFormProps) => {
  const {
    data: departmentsData,
    loading: departmentsLoading,
    error: departmentsError,
  } = useQuery(SCRIPT_FORM_QUERY)

  const [scriptSteps, setScriptSteps] = useState<ScriptStep[]>([])
  const [updateScriptStepOrder] = useMutation(UPDATE_SCRIPT_STEP_ORDER_MUTATION)

  const { data: _scriptData, loading: scriptLoading } = useQuery(
    SCRIPT_WITH_STEPS_QUERY,
    {
      variables: { id: props.script?.id },
      skip: !props.script?.id,
      onCompleted: (data) => {
        if (data?.script?.ScriptStep) {
          setScriptSteps(
            [...data.script.ScriptStep].sort((a, b) => a.order - b.order)
          )
        }
      },
    }
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.script?.name || '',
      visible: props.script?.visible || false,
      departmentId: props.script?.departmentId || '',
    },
  })

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = scriptSteps[dragIndex]
      const newSteps = [...scriptSteps]

      // Remove the dragged item
      newSteps.splice(dragIndex, 1)
      // Insert it at the new position
      newSteps.splice(hoverIndex, 0, dragCard)

      // Update the order value for each step
      const updatedSteps = newSteps.map((step, idx) => ({
        ...step,
        order: idx,
      }))

      setScriptSteps(updatedSteps)
    },
    [scriptSteps]
  )

  const saveStepOrder = async () => {
    try {
      const promises = scriptSteps.map((step) =>
        updateScriptStepOrder({
          variables: {
            id: step.id,
            input: {
              order: step.order,
            },
          },
        })
      )
      await Promise.all(promises)
    } catch (error) {
      console.error('Error updating step order:', error)
    }
  }

  const departments: Department[] = departmentsData?.departments || []

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (scriptSteps.length > 0) {
      await saveStepOrder()
    }
    props.onSave(data, props?.script?.id)
  }

  const navigateToScriptStep = (id: string) => {
    navigate(`/script-steps/${id}/edit`)
  }

  if (departmentsLoading)
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )

  if (departmentsError)
    return (
      <div className="p-8 text-red-500">
        Erreur de chargement: {departmentsError.message}
      </div>
    )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-4 mb-24"
      >
        <div className="grid md:grid-cols-2 *:p-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations du scénario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intitulé du scénario</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Intitulé du scénario" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Département associé</FormLabel>
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
                              ? departments.find(
                                  (dept) => dept.id === field.value
                                )?.name
                              : 'Choisir un département...'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandList>
                            <CommandEmpty>
                              Aucun département trouvé.
                            </CommandEmpty>
                            <CommandGroup>
                              {departments.map((department: Department) => (
                                <CommandItem
                                  className="cursor-pointer"
                                  value={department.id}
                                  key={department.id}
                                  onSelect={() => {
                                    form.setValue('departmentId', department.id)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      department.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {department.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Visibilité</FormLabel>
                      <FormDescription>
                        Activer pour rendre ce scénario visible aux joueurs
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Étapes du scénario</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/script-steps/new')}
              >
                Ajouter une étape
              </Button>
            </CardHeader>
            <CardContent>
              {scriptLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : scriptSteps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Aucune étape associée à ce scénario.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate('/script-steps/new')}
                  >
                    Créer une première étape
                  </Button>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto pr-1">
                  <H4 className="mb-4 text-muted-foreground">
                    {scriptSteps.length} étape(s)
                  </H4>
                  <DndProvider backend={HTML5Backend}>
                    <div>
                      {scriptSteps.map((step, index) => (
                        <div
                          key={step.id}
                          onClick={() => navigateToScriptStep(step.id)}
                        >
                          <DraggableItem
                            scriptStep={step}
                            index={index}
                            moveCard={moveCard}
                          />
                        </div>
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

export default ScriptForm
