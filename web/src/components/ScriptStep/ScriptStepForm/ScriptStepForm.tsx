import { useCallback, useEffect, useRef, useState } from 'react'

import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
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
import { Card } from '@/components/ui/card'
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
import { H3, H4 } from '@/components/ui/typography'
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
  query ScriptStepForm {
    scripts {
      id
      name
      ScriptStep {
        id
        order
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
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: 'CARD',
    hover(item: { index: number }) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      moveCard(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { type: 'CARD', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card
        className={`flex items-center gap-x-2 ${current && 'border-blue-500 text-blue-500'} cursor-move hover:border-blue-500`}
      >
        <div>
          <Button variant="ghost" type="button">
            <ChevronsUpDown />
          </Button>
        </div>
        <p>{scriptStep?.Step?.name}</p>
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
  })

  const [currScriptSteps, setCurrScriptSteps] = useState<Partial<ScriptStep>[]>(
    []
  )
  const [currScriptStep, setCurrScriptStep] =
    useState<Partial<ScriptStep> | null>(null)

  useEffect(() => {
    if (!form.getValues('scriptId')) {
      form.setValue('scriptId', props.scriptStep?.scriptId)
    }
    if (!form.getValues('stepId')) {
      form.setValue('stepId', props.scriptStep?.stepId)
    }
    if (!form.getValues('stepName')) {
      form.setValue('stepName', props.scriptStep?.Step?.name)
    }
    if (!form.getValues('locationId')) {
      form.setValue('locationId', props.scriptStep?.Step?.Location?.id)
    }
    if (!form.getValues('lettre')) {
      form.setValue('lettre', props.scriptStep?.lettre)
    }
    if (!form.getValues('order')) {
      form.setValue('order', props.scriptStep?.order)
    }
  }, [form])

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
    if (!props.scriptStep) {
      if (!currScriptStep) {
        setCurrScriptStep({
          id: uuidv4(),
          order: currScriptSteps.length + 1,
          Step: {
            name: stepName,
          },
        })
      } else {
        setCurrScriptStep({
          ...currScriptStep,
          Step: {
            name: stepName,
          },
        })
      }
    }
  }, [form.watch('scriptId'), form.watch('stepName')])

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

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error...</div>

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
      console.log('modification')
      const previous = {
        id: stepId,
        name: props.scriptStep?.Step?.name,
        locationId: props.scriptStep?.Step?.Location?.id,
      }
      saveScriptSteps({
        currScriptSteps: currScriptSteps,
        updateScriptStep: updateScriptStep,
      }).then(() => {
        console.log('1')
        changeStep({
          previous: previous,
          name: stepName,
          locationId: locationId,
          updateStep: updateStep,
        }).then(() => {
          console.log('2')
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
        className="grid md:grid-cols-2 gap-4 p-4 *:p-4 mb-20"
      >
        <Card className="space-y-4">
          <H3 className="mb-8">Étape</H3>
          <FormField
            control={form.control}
            name="stepName"
            defaultValue={props.scriptStep?.Step?.name}
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
              <FormItem className="flex flex-col">
                <FormLabel>Lieu associé</FormLabel>
                {(loading || !locations) && (
                  <Skeleton className="w-[200px] h-10" />
                )}
                {locations && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'sm:w-[200px] justify-between',
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
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>Aucun scénario trouvé.</CommandEmpty>
                          <CommandGroup>
                            {locations.map((location: Location) => (
                              <CommandItem
                                className="hover: cursor-pointer"
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
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lettre"
            defaultValue={props.scriptStep?.lettre}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lettre associée</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={1}
                    placeholder="Lettre associée"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="scriptId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Scénario associé</FormLabel>
                {(loading || !scripts) && (
                  <Skeleton className="w-[200px] h-10" />
                )}
                {scripts && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'sm:w-[200px] justify-between',
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
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>Aucun scénario trouvé.</CommandEmpty>
                          <CommandGroup>
                            {scripts.map((script: Script) => (
                              <CommandItem
                                className="hover: cursor-pointer"
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
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
        <Card className="space-y-8">
          <div className="flex justify-between items-center">
            <H3>Placement de l&apos;étape</H3>
            <H4>
              <span className="text-blue-500">{currScriptSteps.length}</span>{' '}
              étape(s)
            </H4>
          </div>
          <section className="space-y-1 max-h-72 overflow-auto">
            <DndProvider backend={HTML5Backend}>
              {currScriptSteps.map((scriptStep, index) => (
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
              ))}
            </DndProvider>
          </section>
        </Card>
        <footer
          className="border-t-2 py-8 lg:fixed lg:w-screen left-0 bottom-0 flex justify-center items-center gap-4"
          style={{
            backdropFilter: 'blur(20px)',
          }}
        >
          <Button variant="outline" onClick={() => back()}>
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
