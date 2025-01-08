import type { Answer, EditQuestionById, Hint, HintLevel, QuestionType, Step, UpdateQuestionInput } from 'types/graphql'

import { zodResolver } from '@hookform/resolvers/zod'
import type { RWGqlError } from '@redwoodjs/forms'
import { useQuery } from '@apollo/client'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, Minus, Plus } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { useEffect, useState } from 'react'
import { back } from '@redwoodjs/router'
import { Card } from '@/components/ui/card'
import { H3, H4 } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

type FormQuestion = NonNullable<EditQuestionById['question']>

interface QuestionFormProps {
  question?: EditQuestionById['question']
  onSave: (data: UpdateQuestionInput, id?: FormQuestion['id']) => void
  error: RWGqlError
  loading: boolean
}

const QUESTION_FORM_QUERY = gql`
  query QuestionForm {
    questionTypes {
      id
      type
    }
    steps {
      id
      name
    }
    answers {
      id
      answer
      isCorrect
    }
    hints {
      id
      help
    }
    hintLevels {
      id
      type
    }
  }
`

export const formSchema = z.object({
  question: z.string().nonempty(),
  description: z.string().nonempty(),
  questionTypeId: z.string().nonempty(),
  stepId: z.string().nonempty(),
})

const QuestionForm = (props: QuestionFormProps) => {

  const { data, loading, error } = useQuery(QUESTION_FORM_QUERY)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (!form.getValues('questionTypeId')) {
      form.setValue('questionTypeId', props.question?.questionTypeId)
    }
    if (!form.getValues('stepId')) {
      form.setValue('stepId', props.question?.stepId)
    }
  }, [form])

  const [currentAnswers, setCurrentAnswers] = useState<{
    id: string
    answer: string
    isCorrect: boolean
  }[] | undefined>(props.question?.Answer || undefined)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error...</p>

  const questionTypes: QuestionType[] = data.questionTypes
  const steps: Step[] = data.steps
  const hintLevels: HintLevel[] = data.hintLevels
  const answers: Answer[] = data.answers
  const hints: Hint[] = data.hints
  const currentHints = props.question?.Hint

  const answersDisplayed = answers.filter(
    (answer) =>
      !currentAnswers?.some((a) => a.id === answer.id)
    )

  const addAnswer = (answer: Answer) => {
    if (!currentAnswers) {
      setCurrentAnswers([answer])
      return
    }
    setCurrentAnswers((prev) => {
      return [
        ...(prev || []),
        {
          id: answer.id,
          answer: answer.answer,
          isCorrect: false,
        },
      ]
    })
  }

  const removeAnswer = (answer: Answer) => {
    setCurrentAnswers((prev) => {
      return prev?.filter((a) => a.id !== answer.id)
    })
  }

  const toggleCorrect = (answer: Answer) => {
    setCurrentAnswers((prev) => {
      return prev?.map((a) => {
        if (a.id === answer.id) {
          return {
            ...a,
            isCorrect: !a.isCorrect,
          }
        }
        return a
      })
    })
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    props.onSave(data, props?.question?.id)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid md:grid-cols-3  gap-4 p-4 *:p-4'
      >
        <Card>
          <H3 className='mb-8'>Question</H3>
          <FormField
            control={form.control}
            name='question'
            defaultValue={props.question?.question}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intitulé</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            defaultValue={props.question?.description}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="questionTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de la question</FormLabel>
                {(loading || !questionTypes) && (
                  <Skeleton className="w-[200px] h-10" />
                )}
                {questionTypes && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-[200px] justify-between mx-4',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? questionTypes.find(
                                (qType) => qType.id === field.value
                              )?.type
                            : 'Choisir un type...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>Aucun type trouvé.</CommandEmpty>
                          <CommandGroup>
                            {questionTypes.map((qType: QuestionType) => (
                              <CommandItem
                                className="hover: cursor-pointer"
                                value={qType.id}
                                key={qType.id}
                                onSelect={() => {
                                  form.setValue('questionTypeId', qType.id)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    qType.id === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {qType.type}
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
            name="stepId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etape associée</FormLabel>
                {(loading || !steps) && (
                  <Skeleton className="w-[200px] h-10" />
                )}
                {steps && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-[200px] justify-between mx-4',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? steps.find(
                                (step) => step.id === field.value
                              )?.name
                            : 'Choisir une étape...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>Aucun étape trouvée.</CommandEmpty>
                          <CommandGroup>
                            {steps.map((step: Step) => (
                              <CommandItem
                                className="hover: cursor-pointer"
                                value={step.id}
                                key={step.id}
                                onSelect={() => {
                                  form.setValue('stepId', step.id)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    step.id === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {step.name}
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
        <Card>
          <H3 className='mb-8'>Réponses associées</H3>
          <section className='max-h-[300px] overflow-y-auto'>
            <H4>Possibilitées</H4>
            {!currentAnswers && (
              <p className='text-muted-foreground'>Pas de réponse associées</p>
            )}
            {currentAnswers && currentAnswers.map((answer: Answer) => (
              <div
                key={answer.id}
                className='cursor-pointer p-2 flex justify-between items-center gap-4 select-none'
              >
                <p>{answer.answer}</p>
                <div className='space-x-2'>
                  <Switch
                    checked={currentAnswers?.some((a) => a.id === answer.id)}
                    onCheckedChange={() => toggleCorrect(answer)}
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => removeAnswer(answer)}
                  >
                    <Minus   />
                  </Button>
                </div>
              </div>
            ))}
          </section>
          <Separator className='my-4' />
          <section className='max-h-[250px] overflow-y-auto'>
            <H4>Autres réponses</H4>
            {answersDisplayed.map((answer) => (
              <div
                key={answer.id}
                className='cursor-pointer p-1 flex justify-between items-center select-none'
              >
                <p>{answer.answer}</p>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => addAnswer(answer)}
                >
                  <Plus />
                </Button>
              </div>
            ))}
          </section>
        </Card>
        <Card>
          <H3>Indices associées</H3>
          <div>
            {currentHints?.map((hint) => (
              <div key={hint.id}>
                <p>{hint.help}</p>
              </div>
            ))}
          </div>
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

export default QuestionForm
