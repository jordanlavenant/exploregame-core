import type { EditScriptById, UpdateScriptInput } from 'types/graphql'

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

type FormScript = NonNullable<EditScriptById['script']>

interface ScriptFormProps {
  script?: EditScriptById['script']
  onSave: (data: UpdateScriptInput, id?: FormScript['id']) => void
  error: RWGqlError
  loading: boolean
}

const ScriptForm = (props: ScriptFormProps) => {
  const onSubmit = (data: FormScript) => {
    props.onSave(data, props?.script?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormScript> onSubmit={onSubmit} error={props.error}>
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
          defaultValue={props.script?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="visible"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Visible
        </Label>

        <CheckboxField
          name="visible"
          defaultChecked={props.script?.visible}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="visible" className="rw-field-error" />

        <Label
          name="departmentId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Department id
        </Label>

        <TextField
          name="departmentId"
          defaultValue={props.script?.departmentId}
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

export default ScriptForm
