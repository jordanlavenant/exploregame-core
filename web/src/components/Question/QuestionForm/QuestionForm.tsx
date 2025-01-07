import type { EditQuestionById, UpdateQuestionInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'
import { useQuery } from '@apollo/client'
import { Select } from '@/components/ui/select'

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
  }
`

const QuestionForm = (props: QuestionFormProps) => {

  const { data, loading, error } = useQuery(QUESTION_FORM_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error...</p>

  const questionTypes = data.questionTypes
  const steps = data.steps

  const onSubmit = (data: FormQuestion) => {
    props.onSave(data, props?.question?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormQuestion> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="question"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Question
        </Label>

        <TextField
          name="question"
          defaultValue={props.question?.question}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="question" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.question?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="questionTypeId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Question type id
        </Label>

        <FieldError name="questionTypeId" className="rw-field-error" />

        <Label
          name="stepId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Step id
        </Label>

        <TextField
          name="stepId"
          defaultValue={props.question?.stepId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="stepId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default QuestionForm
