import type {
  EditQuestionTypeById,
  UpdateQuestionTypeInput,
} from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormQuestionType = NonNullable<EditQuestionTypeById['questionType']>

interface QuestionTypeFormProps {
  questionType?: EditQuestionTypeById['questionType']
  onSave: (data: UpdateQuestionTypeInput, id?: FormQuestionType['id']) => void
  error: RWGqlError
  loading: boolean
}

const QuestionTypeForm = (props: QuestionTypeFormProps) => {
  const onSubmit = (data: FormQuestionType) => {
    props.onSave(data, props?.questionType?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormQuestionType> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="type"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Type
        </Label>

        <TextField
          name="type"
          defaultValue={props.questionType?.type}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="type" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default QuestionTypeForm
