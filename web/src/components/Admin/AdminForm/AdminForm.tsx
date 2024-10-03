import type { EditAdminById, UpdateAdminInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormAdmin = NonNullable<EditAdminById['admin']>

interface AdminFormProps {
  admin?: EditAdminById['admin']
  onSave: (data: UpdateAdminInput, id?: FormAdmin['id']) => void
  error: RWGqlError
  loading: boolean
}

const AdminForm = (props: AdminFormProps) => {
  const onSubmit = (data: FormAdmin) => {
    props.onSave(data, props?.admin?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormAdmin> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="role"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Role
        </Label>

        <TextField
          name="role"
          defaultValue={props.admin?.role}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="role" className="rw-field-error" />

        <Label
          name="idU"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Id u
        </Label>

        <TextField
          name="idU"
          defaultValue={props.admin?.idU}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="idU" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default AdminForm
