import type { EditAnswerById, UpdateAnswerInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'

type FormAnswer = NonNullable<EditAnswerById['answer']>

interface AnswerFormProps {
  answer?: EditAnswerById['answer']
  onSave: (data: UpdateAnswerInput, id?: FormAnswer['id']) => void
  error: RWGqlError
  loading: boolean
}

const AnswerForm = (props: AnswerFormProps) => {
  const onSubmit = (data: FormAnswer) => {
    props.onSave(data, props?.answer?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormAnswer> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="answer"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Answer
        </Label>

        <TextField
          name="answer"
          defaultValue={props.answer?.answer}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="answer" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.answer?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="questionId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Question id
        </Label>

        <TextField
          name="questionId"
          defaultValue={props.answer?.questionId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="questionId" className="rw-field-error" />

        <Label
          name="isCorrect"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Is correct
        </Label>

        <CheckboxField
          name="isCorrect"
          defaultChecked={props.answer?.isCorrect}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="isCorrect" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default AnswerForm
