import type { EditScriptById, UpdateScriptInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
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
          name="script"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Script
        </Label>

        <TextField
          name="script"
          defaultValue={props.script?.script}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="script" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.script?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="word"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Word
        </Label>

        <TextField
          name="word"
          defaultValue={props.script?.word}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="word" className="rw-field-error" />

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
