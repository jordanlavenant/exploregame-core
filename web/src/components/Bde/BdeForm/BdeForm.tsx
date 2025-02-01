import type { EditBdeById, UpdateBdeInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormBde = NonNullable<EditBdeById['bde']>

interface BdeFormProps {
  bde?: EditBdeById['bde']
  onSave: (data: UpdateBdeInput, id?: FormBde['id']) => void
  error: RWGqlError
  loading: boolean
}

const BdeForm = (props: BdeFormProps) => {
  const onSubmit = (data: FormBde) => {
    props.onSave(data, props?.bde?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormBde> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="name"
          defaultValue={props.bde?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.bde?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="logo"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Logo
        </Label>

        <TextField
          name="logo"
          defaultValue={props.bde?.logo}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="logo" className="rw-field-error" />

        <Label
          name="departmentId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Department id
        </Label>

        <TextField
          name="departmentId"
          defaultValue={props.bde?.departmentId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="departmentId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default BdeForm
