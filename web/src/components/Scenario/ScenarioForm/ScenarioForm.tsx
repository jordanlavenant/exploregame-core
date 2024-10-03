import type { EditScenarioById, UpdateScenarioInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormScenario = NonNullable<EditScenarioById['scenario']>

interface ScenarioFormProps {
  scenario?: EditScenarioById['scenario']
  onSave: (data: UpdateScenarioInput, id?: FormScenario['id']) => void
  error: RWGqlError
  loading: boolean
}

const ScenarioForm = (props: ScenarioFormProps) => {
  const onSubmit = (data: FormScenario) => {
    props.onSave(data, props?.scenario?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormScenario> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="scenario"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Scenario
        </Label>

        <TextField
          name="scenario"
          defaultValue={props.scenario?.scenario}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="scenario" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.scenario?.description}
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
          defaultValue={props.scenario?.word}
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

export default ScenarioForm
