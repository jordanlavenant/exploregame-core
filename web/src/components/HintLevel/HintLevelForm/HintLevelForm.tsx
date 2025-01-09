import type { EditHintLevelById, UpdateHintLevelInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormHintLevel = NonNullable<EditHintLevelById['hintLevel']>

interface HintLevelFormProps {
  hintLevel?: EditHintLevelById['hintLevel']
  onSave: (data: UpdateHintLevelInput, id?: FormHintLevel['id']) => void
  error: RWGqlError
  loading: boolean
}

const HintLevelForm = (props: HintLevelFormProps) => {
  const onSubmit = (data: FormHintLevel) => {
    props.onSave(data, props?.hintLevel?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormHintLevel> onSubmit={onSubmit} error={props.error}>
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
          defaultValue={props.hintLevel?.type}
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

export default HintLevelForm
