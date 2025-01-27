import type { EditStepById, Location, Question, UpdateStepInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '@/components/ui/card'
import { H3 } from '@/components/ui/typography'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { back } from '@redwoodjs/router'
import { useQuery } from '@apollo/client'
import { Skeleton } from '@/components/ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { useRef, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

type FormStep = NonNullable<EditStepById['step']>

interface StepFormProps {
  step?: EditStepById['step']
  onSave: (data: UpdateStepInput, id?: FormStep['id']) => void
  error: RWGqlError
  loading: boolean
}

const STEP_FORM_QUERY = gql`
  query StepForm {
    locations {
      id
      name
    }
  }
`
export const formSchema = z.object({
  name: z.string().nonempty(),
  locationId: z.string().nonempty(),
})

const ItemType = 'QUESTION'

const DraggableQuestion = ({ question, index, moveQuestion }) => {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: { index: number }) {
      if (item.index !== index) {
        moveQuestion(item.index, index)
        item.index = index
      }
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={`flex items-center gap-4 ${isDragging ? 'opacity-50' : 'opacity-100'} bg-red-500`}
    >
      <div className="flex-1">
        <p>{question.question}</p>
        <p className="text-muted-foreground">{question.description}</p>
      </div>
      <Button
        type='button'
        variant="outline"
      >
        <Minus />
      </Button>
    </div>
  )
}

const StepForm = (props: StepFormProps) => {
  const { data, loading, error } = useQuery(STEP_FORM_QUERY)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.step?.name || '',
      locationId: props.step?.locationId || '',
    },
  })

  const questions: Partial<Question>[] = props.step?.Questions || []

  const [currQuestions, setCurrQuestions] = useState<Partial<Question>[]>(questions)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error...</p>

  const locations: Location[] = data.locations

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const updatedQuestions = Array.from(currQuestions)
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1)
    updatedQuestions.splice(toIndex, 0, movedQuestion)
    setCurrQuestions(updatedQuestions)
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    props.onSave(data, props?.step?.id)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid md:grid-cols-3 gap-4 p-4 *:p-4"
      >
        <Card className='col-span-1 space-y-4'>
          <H3 className="mb-8">Étape</H3>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nom de l'étape" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="locationId"
            render={({ field }) => (
              <FormItem className='flex flex-col'>
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
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? locations.find((location) => location.id === field.value)
                                ?.name
                            : 'Choisir un lieu...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>Aucun étape trouvée.</CommandEmpty>
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
        </Card>
        <Card className='col-span-2'>
          <H3 className="mb-8">Question(s) associée(s)</H3>
          <DndProvider backend={HTML5Backend}>
            <section className='space-y-2'>
              {currQuestions.map((question, index) => (
                <DraggableQuestion
                  key={question.id}
                  index={index}
                  question={question}
                  moveQuestion={moveQuestion}
                />
              ))}
            </section>
          </DndProvider>
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

export default StepForm