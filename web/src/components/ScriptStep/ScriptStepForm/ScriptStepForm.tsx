import type { EditScriptStepById, UpdateScriptStepInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormScriptStep = NonNullable<EditScriptStepById['scriptStep']>

interface ScriptStepFormProps {
  scriptStep?: EditScriptStepById['scriptStep']
  onSave: (data: UpdateScriptStepInput, id?: FormScriptStep['id']) => void
  error: RWGqlError
  loading: boolean
}

const ScriptStepForm = (props: ScriptStepFormProps) => {
  const onSubmit = (data: FormScriptStep) => {
    props.onSave(data, props?.scriptStep?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormScriptStep> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="scriptId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Script id
        </Label>

        <TextField
          name="scriptId"
          defaultValue={props.scriptStep?.scriptId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="scriptId" className="rw-field-error" />

        <Label
          name="stepId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Step id
        </Label>

        <TextField
          name="stepId"
          defaultValue={props.scriptStep?.stepId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="stepId" className="rw-field-error" />

        <Label
          name="lettre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Lettre
        </Label>

        <TextField
          name="lettre"
          defaultValue={props.scriptStep?.lettre}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="lettre" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ScriptStepForm
