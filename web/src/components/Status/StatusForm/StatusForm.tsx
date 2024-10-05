import type { EditStatusById, UpdateStatusInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormStatus = NonNullable<EditStatusById['status']>

interface StatusFormProps {
  status?: EditStatusById['status']
  onSave: (data: UpdateStatusInput, id?: FormStatus['id']) => void
  error: RWGqlError
  loading: boolean
}

const StatusForm = (props: StatusFormProps) => {
  const onSubmit = (data: FormStatus) => {
    props.onSave(data, props?.status?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormStatus> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="status"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Status
        </Label>

        <TextField
          name="status"
          defaultValue={props.status?.status}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="status" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default StatusForm
