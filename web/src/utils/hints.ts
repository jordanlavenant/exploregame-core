import { EditQuestionById } from 'types/graphql'

interface SaveHintsProps {
  currentHints: {
    id: string
    help: string
    hintLevelId: string
  }[] | undefined,
  question: EditQuestionById['question'],
  deleteHint: (variables: { variables: { id: string } }) => void,
  createHint: (variables: { variables: { input: { help: string, hintLevelId: string, questionId: string } } }) => void
}

export const saveHints = async ({ currentHints, question, deleteHint, createHint } : SaveHintsProps) => {
  if (!currentHints || currentHints.length === 0) {
    return
  }
  const hints = question?.Hint
  if (hints === currentHints) return

  const questionId = question?.id

  // Delete all hints of the question
  const hintsToDelete = hints.filter(
    (hint) => hint.questionId === questionId
  )
  hintsToDelete.forEach((hint) => {
    deleteHint({
      variables: {
        id: hint.id,
      },
    })
  })

  // Re-create all hints of the question
  currentHints.forEach((hint) => {
    if (hint === undefined) return
    createHint({
      variables: {
        input: {
          help: hint.help,
          hintLevelId: hint.hintLevelId,
          questionId: questionId,
        },
      },
    })
  })
}