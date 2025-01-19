import type { EditHintById, UpdateHintInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormHint = NonNullable<EditHintById['hint']>

interface HintFormProps {
  hint?: EditHintById['hint']
  onSave: (data: UpdateHintInput, id?: FormHint['id']) => void
  error: RWGqlError
  loading: boolean
}

const HintForm = (props: HintFormProps) => {
  const onSubmit = (data: FormHint) => {
    props.onSave(data, props?.hint?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormHint> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="help"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Help
        </Label>

        <TextField
          name="help"
          defaultValue={props.hint?.help}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="help" className="rw-field-error" />

        <Label
          name="questionId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Question id
        </Label>

        <TextField
          name="questionId"
          defaultValue={props.hint?.questionId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="questionId" className="rw-field-error" />

        <Label
          name="hintLevelId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Hint level id
        </Label>

        <TextField
          name="hintLevelId"
          defaultValue={props.hint?.hintLevelId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="hintLevelId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default HintForm
