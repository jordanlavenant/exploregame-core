import { useCallback, useEffect, useRef, useState } from 'react'

import { useMutation, useQuery } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown, Edit, X } from 'lucide-react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useForm } from 'react-hook-form'
import type {
  Answer,
  CreateQuestionMutation,
  EditQuestionById,
  HintLevel,
  Question,
  QuestionType,
  Step,
  UpdateQuestionInput,
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
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { H3, H4 } from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import { saveAnswers } from '@/utils/answers'
import { saveHints } from '@/utils/hints'
import { saveQuestions } from '@/utils/questions'

type FormQuestion = NonNullable<EditQuestionById['question']>

interface QuestionFormProps {
  question?: EditQuestionById['question']
  onSave: (
    data: UpdateQuestionInput,
    id?: FormQuestion['id']
  ) => Promise<CreateQuestionMutation | EditQuestionById>
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
      ScriptStep {
        Script {
          id
          name
        }
      }
      Questions {
        id
        order
        question
      }
    }
    hints {
      id
      help
    }
    hintLevels {
      id
      type
    }
    answers {
      id
    }
  }
`

const CREATE_ANSWER_MUTATION = gql`
  mutation CreateAnswerFunc($input: CreateAnswerInput!) {
    createAnswer(input: $input) {
      answer
      description
      questionId
      isCorrect
    }
  }
`

const DELETE_ANSWER_MUTATION = gql`
  mutation DeleteAnswerFunc($id: String!) {
    deleteAnswer(id: $id) {
      id
    }
  }
`

const CREATE_HINT_MUTATION = gql`
  mutation CreateHintFunc($input: CreateHintInput!) {
    createHint(input: $input) {
      help
      questionId
      HintLevel {
        id
        type
      }
    }
  }
`

const DELETE_HINT_MUTATION = gql`
  mutation DeleteHintFunc($id: String!) {
    deleteHint(id: $id) {
      id
    }
  }
`

const UPDATE_QUESTION_MUTATION = gql`
  mutation UpdateQuestionFunc($id: String!, $input: UpdateQuestionInput!) {
    updateQuestion(id: $id, input: $input) {
      id
    }
  }
`

export const formSchema = z.object({
  question: z.string().nonempty(),
  description: z.string(),
  questionTypeId: z.string().nonempty(),
  stepId: z.string().nonempty(),
  order: z.number().int(),
})

const DraggableItem = ({
  question,
  index,
  moveCard,
  current,
}: {
  question: Partial<Question>
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
        <p>{question?.question}</p>
      </Card>
    </div>
  )
}

const QuestionForm = (props: QuestionFormProps) => {
  const { data, loading, error } = useQuery(QUESTION_FORM_QUERY)
  // Answers
  const [createAnswer] = useMutation(CREATE_ANSWER_MUTATION)
  const [deleteAnswer] = useMutation(DELETE_ANSWER_MUTATION)
  // Hints
  const [createHint] = useMutation(CREATE_HINT_MUTATION)
  const [deleteHint] = useMutation(DELETE_HINT_MUTATION)
  // Questions
  const [updateQuestion] = useMutation(UPDATE_QUESTION_MUTATION)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const [currQuestions, setCurrQuestions] = useState<Partial<Question>[]>([])
  const [currQuestion, setCurrQuestion] = useState<Partial<Question> | null>(
    null
  )

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const newQuestions = [...currQuestions]
      const dragCard = { ...newQuestions[dragIndex] }
      const hoverCard = { ...newQuestions[hoverIndex] }

      // Swap the order values
      const tempOrder = dragCard.order
      dragCard.order = hoverCard.order
      hoverCard.order = tempOrder

      // Swap the positions in the array
      newQuestions[dragIndex] = hoverCard
      newQuestions[hoverIndex] = dragCard

      setCurrQuestions(newQuestions)
    },
    [currQuestions]
  )

  useEffect(() => {
    if (!form.getValues('questionTypeId')) {
      form.setValue('questionTypeId', props.question?.questionTypeId)
    }
    if (!form.getValues('stepId')) {
      form.setValue('stepId', props.question?.stepId)
    }
    if (!form.getValues('order')) {
      form.setValue('order', props.question?.order)
    }
  }, [form])

  // Mise à jour des questions d'une étapes en fonction de l'étape choisie
  useEffect(() => {
    const currStepId = form.watch('stepId')
    if (!currStepId) return
    setCurrQuestions(
      data?.steps.find((step) => step.id === currStepId)?.Questions || []
    )
  }, [form.watch('stepId'), data])

  useEffect(() => {
    const currStepId = form.watch('stepId')
    if (!currStepId) return
    const question = form.watch('question')
    // Lors de la création
    if (!props.question) {
      if (!currQuestion) {
        setCurrQuestion({
          id: uuidv4(),
          question,
          order: currQuestions.length + 1,
        })
      } else {
        setCurrQuestion({
          ...currQuestion,
          question,
        })
      }
    }
  }, [form.watch('question'), form.watch('stepId')])

  useEffect(() => {
    if (currQuestion) {
      const newQuestions = currQuestions.map((question) => {
        if (question.id === currQuestion.id) {
          return {
            ...currQuestion,
            order: question.order,
          }
        }
        return question
      })
      if (!newQuestions.find((question) => question.id === currQuestion.id)) {
        setCurrQuestions([
          ...newQuestions,
          {
            ...currQuestion,
            order: newQuestions.length,
          },
        ])
      } else {
        setCurrQuestions(newQuestions)
      }
    }
  }, [currQuestion])

  useEffect(() => {
    if (props.question) {
      const question = currQuestions.find(
        (question) => question.id === props.question?.id
      )
      form.setValue('order', question?.order)
    } else {
      const question = currQuestions.find(
        (question) => question.id === currQuestion?.id
      )
      form.setValue('order', question?.order)
    }
  }, [currQuestions])

  const [currentAnswers, setCurrentAnswers] = useState<
    | {
        id: string
        answer: string
        description: string
        isCorrect: boolean
      }[]
    | undefined
  >(props.question?.Answer || undefined)
  const [currentHints, setCurrentHints] = useState<
    | {
        id: string
        help: string
        hintLevelId: string
      }[]
    | undefined
  >(props.question?.Hint || undefined)

  useEffect(() => {
    if (currentHints) {
      const sortedHints = [...currentHints].sort(
        (a, b) => Number(a.hintLevelId) - Number(b.hintLevelId)
      )
      const filledHints = new Array(3).fill(undefined)
      sortedHints.forEach((hint) => {
        if (hint === undefined) return
        filledHints[Number(hint.hintLevelId) - 1] = hint
      })
      setCurrentHints(filledHints)
    }
  }, [props.question?.Hint])

  useEffect(() => {
    console.log(currentAnswers)
  }, [currentAnswers])

  const [hintOneEdit, setHintOneEdit] = useState<boolean>(false)
  const [hintOneValue, setHintOneValue] = useState(
    currentHints?.[0]?.help || ''
  )
  const [hintTwoEdit, setHintTwoEdit] = useState<boolean>(false)
  const [hintTwoValue, setHintTwoValue] = useState(
    currentHints?.[1]?.help || ''
  )
  const [hintThreeEdit, setHintThreeEdit] = useState<boolean>(false)
  const [hintThreeValue, setHintThreeValue] = useState(
    currentHints?.[2]?.help || ''
  )

  const [isFormModified, setIsFormModified] = useState<boolean>(false)

  const [newAnswer, setNewAnswer] = useState<string>('')
  const [newAnswerDescription, setNewAnswerDescription] = useState<string>('')

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name === 'questionTypeId') {
        setIsFormModified(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  useEffect(() => {
    if (
      isFormModified &&
      (form.watch('questionTypeId') === '1' ||
        form.watch('questionTypeId') === '2')
    ) {
      setCurrentAnswers([])
    }
  }, [form.watch('questionTypeId'), isFormModified])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error...</p>

  const questionTypes: QuestionType[] = data.questionTypes
  const steps: Step[] = data.steps
  const hintLevels: HintLevel[] = data.hintLevels

  const addAnswer = async () => {
    const answer = {
      id: uuidv4(),
      answer: newAnswer,
      description: newAnswerDescription,
      isCorrect: false,
    }
    setCurrentAnswers((prev) => {
      return [...(prev || []), answer]
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

  const handleSaveHint = (index: number, newHint: string) => {
    if (newHint === '') return
    const hint = {
      id: uuidv4(),
      help: newHint,
      hintLevelId: hintLevels?.[index].id,
    }
    setCurrentHints((prev) => {
      const newHints = [...(prev || [])]
      newHints[index] = hint
      return newHints
    })
  }

  const handleDeleteHint = (index: number) => {
    setCurrentHints((prev) => {
      const newHints = [...(prev || [])]
      newHints[index] = undefined
      return newHints
    })
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!currentAnswers || currentAnswers.length === 0) {
      return
    }
    if (props.question) {
      saveAnswers({
        currentAnswers,
        question: props.question,
        deleteAnswer,
        createAnswer,
      })
        .then(() => {
          saveHints({
            currentHints,
            question: props.question,
            deleteHint,
            createHint,
          })
        })
        .then(() => {
          saveQuestions({
            currQuestions,
            updateQuestion,
          })
        })
        .then(() => {
          props.onSave(data, props.question.id)
        })
    } else {
      props.onSave(data, props?.question?.id).then((data) => {
        saveAnswers({
          currentAnswers,
          question: data.createQuestion,
          deleteAnswer,
          createAnswer,
        })
          .then(() => {
            saveHints({
              currentHints,
              question: data.createQuestion,
              deleteHint,
              createHint,
            })
          })
          .then(() => {
            saveQuestions({
              currQuestions,
              updateQuestion,
            })
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
          <H3 className="mb-8">Question</H3>
          <FormField
            control={form.control}
            name="question"
            defaultValue={props.question?.question}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intitulé</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Intitulé de la question" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            defaultValue={props.question?.description}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Description de la question" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="questionTypeId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
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
                            'sm:w-[200px] justify-between',
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
              <FormItem className="flex flex-col">
                <FormLabel>Etape associée</FormLabel>
                {(loading || !steps) && <Skeleton className="w-[200px] h-10" />}
                {steps && (
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
                            ? steps.find((step) => step.id === field.value)
                                ?.name
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
          <H3 className="mb-8">Réponse(s) associée(s)</H3>
          <section className="grid grid-cols-3 gap-2">
            <Input
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Nouvelle réponse"
              className="col-span-2"
            />
            <Input
              value={newAnswerDescription}
              onChange={(e) => setNewAnswerDescription(e.target.value)}
              placeholder="Description"
              className="col-span-full"
            />
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600 row-start-1 col-start-3"
              disabled={!newAnswer}
              onClick={() => {
                addAnswer().then(() => {
                  setNewAnswer('')
                  setNewAnswerDescription('')
                })
              }}
            >
              Ajouter
            </Button>
          </section>
          <Separator className="my-4" />
          <section className="max-h-[300px] overflow-y-auto">
            {(!currentAnswers || currentAnswers.length === 0) && (
              <p className="text-muted-foreground">Pas de réponse associées</p>
            )}
            {currentAnswers &&
              currentAnswers.map((answer: Answer) => (
                <div
                  key={answer.id}
                  className="cursor-pointer p-1 flex justify-between items-center select-none"
                >
                  <p>{answer.answer}</p>
                  <div className="space-x-2">
                    <Switch
                      disabled={
                        currentAnswers.some((a) => a.isCorrect) &&
                        !answer.isCorrect &&
                        form.watch('questionTypeId') === '2'
                      }
                      checked={answer.isCorrect}
                      onCheckedChange={() => toggleCorrect(answer)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeAnswer(answer)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ))}
          </section>
        </Card>
        <Card className="space-y-8">
          <div className="flex justify-between items-center">
            <H3>Placement de la question</H3>
            <H4>
              <span className="text-blue-500">{currQuestions.length}</span>{' '}
              question(s)
            </H4>
          </div>
          <section className="space-y-1 max-h-72 overflow-auto">
            <DndProvider backend={HTML5Backend}>
              {currQuestions.map((question, index) => (
                <DraggableItem
                  key={index}
                  index={index}
                  question={question}
                  moveCard={moveCard}
                  current={
                    question?.id === props.question?.id ||
                    question?.id === currQuestion?.id
                  }
                />
              ))}
            </DndProvider>
          </section>
        </Card>
        <Card className="space-y-8">
          <H3>Indice(s) associé(s)</H3>
          <Card className="grid grid-cols-3 gap-2 items-center p-4 relative">
            <H4 className="col-span-full absolute -top-4 -left-2 bg-card px-2">
              Indice faible
            </H4>
            <div className="col-span-2">
              {hintOneEdit ? (
                <Input
                  placeholder="Petit indice"
                  value={hintOneValue}
                  onChange={(e) => setHintOneValue(e.target.value)}
                />
              ) : currentHints?.[0]?.help ? (
                <p>{currentHints?.[0]?.help}</p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Pas d&apos;indice associé
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  if (hintOneEdit) {
                    handleSaveHint(0, hintOneValue)
                    setHintOneEdit(false)
                  } else {
                    setHintOneEdit(true)
                  }
                }}
              >
                {hintOneEdit ? <Check /> : <Edit />}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setHintOneEdit(false)
                  handleDeleteHint(0)
                }}
              >
                <X />
              </Button>
            </div>
          </Card>
          <Card className="grid grid-cols-3 gap-2 items-center p-4 relative">
            <H4 className="col-span-full absolute -top-4 -left-2 bg-card px-2">
              Indice moyen
            </H4>
            <div className="col-span-2">
              {hintTwoEdit ? (
                <Input
                  placeholder="Indice moyen"
                  value={hintTwoValue}
                  onChange={(e) => setHintTwoValue(e.target.value)}
                />
              ) : currentHints?.[1]?.help ? (
                <p>{currentHints?.[1]?.help}</p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Pas d&apos;indice associé
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  if (hintTwoEdit) {
                    handleSaveHint(1, hintTwoValue)
                    setHintTwoEdit(false)
                  } else {
                    setHintTwoEdit(true)
                  }
                }}
              >
                {hintTwoEdit ? <Check /> : <Edit />}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setHintTwoEdit(false)
                  handleDeleteHint(1)
                }}
              >
                <X />
              </Button>
            </div>
          </Card>
          <Card className="grid grid-cols-3 gap-2 items-center p-4 relative">
            <H4 className="col-span-full absolute -top-4 -left-2 bg-card px-2">
              Indice fort
            </H4>
            <div className="col-span-2">
              {hintThreeEdit ? (
                <Input
                  placeholder="Grand indice"
                  value={hintThreeValue}
                  onChange={(e) => setHintThreeValue(e.target.value)}
                />
              ) : currentHints?.[2]?.help ? (
                <p>{currentHints?.[2]?.help}</p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Pas d&apos;indice associé
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  if (hintThreeEdit) {
                    handleSaveHint(2, hintThreeValue)
                    setHintThreeEdit(false)
                  } else {
                    setHintThreeEdit(true)
                  }
                }}
              >
                {hintThreeEdit ? <Check /> : <Edit />}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setHintThreeEdit(false)
                  handleDeleteHint(2)
                }}
              >
                <X />
              </Button>
            </div>
          </Card>
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
