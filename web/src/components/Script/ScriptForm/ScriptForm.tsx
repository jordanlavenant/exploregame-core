import type { Department, EditScriptById, Script, UpdateScriptInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { H3 } from '@/components/ui/typography'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useQuery } from '@apollo/client'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { back } from '@redwoodjs/router'

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
export const formSchema = z.object({
  name: z.string().nonempty(),
  visible: z.boolean(),
  departmentId: z.string().nonempty(),
})

const ScriptForm = (props: ScriptFormProps) => {
  const { data, loading, error } = useQuery(SCRIPT_FORM_QUERY)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    console.log(form.watch())
  }, [form.watch()])

  useEffect(() => {
    if (!form.getValues('name')) {
      form.setValue('name', props.script?.name)
    }
    if (!form.getValues('visible')) {
      form.setValue('visible', props.script?.visible)
    }
    if (!form.getValues('departmentId')) {
      form.setValue('departmentId', props.script?.departmentId)
    }
  }, [form])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  const departments: Department[] = data.departments

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    props.onSave(data, props?.script?.id)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid md:grid-cols-2 gap-4 p-4 *:p-4 mb-20"
      >
        <Card className="space-y-4">
          <H3 className="mb-8">Scénario</H3>
          <FormField
            control={form.control}
            name="name"
            defaultValue={props.script?.name}
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
          <section className='grid md:grid-cols-2 items-center'>
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Département associé</FormLabel>
                  {(loading || !departments) && (
                    <Skeleton className="w-[200px] h-10" />
                  )}
                  {departments && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'sm:w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? departments.find(
                                  (script) => script.id === field.value
                                )?.name
                              : 'Choisir un département...'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandList>
                            <CommandEmpty>Aucun département trouvé.</CommandEmpty>
                            <CommandGroup>
                              {departments.map((department: Department) => (
                                <CommandItem
                                  className="hover: cursor-pointer"
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
                  )}
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visible"
              defaultValue={props.script?.visible}
              render={({ field }) => (
                <FormItem className='flex flex-col mx-auto'>
                  <FormLabel>Visible</FormLabel>
                  <FormControl>
                    <Switch
                      defaultChecked={field.value}
                      onCheckedChange={(checked) =>
                        form.setValue('visible', checked)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default ScriptForm
