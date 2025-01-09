import type { EditGenderById, UpdateGenderInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormGender = NonNullable<EditGenderById['gender']>

interface GenderFormProps {
  gender?: EditGenderById['gender']
  onSave: (data: UpdateGenderInput, id?: FormGender['id']) => void
  error: RWGqlError
  loading: boolean
}

const GenderForm = (props: GenderFormProps) => {
  const onSubmit = (data: FormGender) => {
    props.onSave(data, props?.gender?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormGender> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="gender"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Gender
        </Label>

        <TextField
          name="gender"
          defaultValue={props.gender?.gender}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="gender" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default GenderForm
