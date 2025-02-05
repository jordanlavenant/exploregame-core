import type { EditScriptStepById, Location, Script, Step, UpdateScriptStepInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { H3 } from '@/components/ui/typography'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { back } from '@redwoodjs/router'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useMutation, useQuery } from '@apollo/client'
import { Skeleton } from '@/components/ui/skeleton'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { saveStep } from '@/utils/steps'

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
      name
      locationId
    }
  }
`

export const formSchema = z.object({
  scriptId: z.string().nonempty(),
  stepId: z.string().optional(),
  stepName: z.string().nonempty(),
  locationId: z.string().nonempty(),
  lettre: z.string().nonempty(),
  order: z.string().nonempty(),
})

const ScriptStepForm = (props: ScriptStepFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

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
      form.setValue('order', props.scriptStep?.order.toString())
    }
  }, [form])

  useEffect(() => {
    console.log(form.getValues())
  }, [form.getValues()])

  const { data, loading, error } = useQuery(SCRIPTSTEP_FORM_QUERY)
  const [createStep] = useMutation(CREATE_STEP_MUTATION)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error...</div>

  const scripts: Script[] = data.scripts
  const locations: Location[] = data.locations

  const handleSaveStep = (name: string, location: string) => {
    console.log('name', name)
    console.log('location', location)
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // ! post first the the new step, then grab its id and link it to scriptStep
    const { stepId, stepName, locationId } = data
    if (!stepId) {
      saveStep({
        name: stepName,
        locationId: locationId,
        createStep: createStep
      }).then((stepId) => {
        console.log(stepId)
        // props.onSave({
        //   scriptId: data.scriptId,
        //   stepId: stepId,
        //   lettre: data.lettre,
        //   order: parseInt(data.order),
        // }, props?.scriptStep?.id)
      })
    } else {
      props.onSave({
        scriptId: data.scriptId,
        stepId: data.stepId,
        lettre: data.lettre,
        order: parseInt(data.order),
      }, props?.scriptStep?.id)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid md:grid-cols-2 gap-4 p-4 *:p-4 mb-20"
      >
        <Card className='space-y-4'>
          <H3 className="mb-8">Étape</H3>
          <FormField
            control={form.control}
            name="stepName"
            defaultValue={props.scriptStep?.Step?.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intitulé de l'étape</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Intitulé de l'étape"
                  />
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
                {(loading || !locations) && <Skeleton className="w-[200px] h-10" />}
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
                                  )} />
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
                {(loading || !scripts) && <Skeleton className="w-[200px] h-10" />}
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
        <Card className='space-y-4'>
          <H3 className="mb-8">Order</H3>
          <FormField
            control={form.control}
            name="order"
            defaultValue={props.scriptStep?.order.toString()}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scénario</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ordre associé" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
