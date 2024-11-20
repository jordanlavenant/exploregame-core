import type { EditColorSetById, UpdateColorSetInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormColorSet = NonNullable<EditColorSetById['colorSet']>

interface ColorSetFormProps {
  colorSet?: EditColorSetById['colorSet']
  onSave: (data: UpdateColorSetInput, id?: FormColorSet['id']) => void
  error: RWGqlError
  loading: boolean
}

const ColorSetForm = (props: ColorSetFormProps) => {
  const onSubmit = (data: FormColorSet) => {
    props.onSave(data, props?.colorSet?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormColorSet> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="primary"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Primary
        </Label>

        <TextField
          name="primary"
          defaultValue={props.colorSet?.primary}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="primary" className="rw-field-error" />

        <Label
          name="secondary"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Secondary
        </Label>

        <TextField
          name="secondary"
          defaultValue={props.colorSet?.secondary}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="secondary" className="rw-field-error" />

        <Label
          name="tertiary"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Tertiary
        </Label>

        <TextField
          name="tertiary"
          defaultValue={props.colorSet?.tertiary}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="tertiary" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ColorSetForm
