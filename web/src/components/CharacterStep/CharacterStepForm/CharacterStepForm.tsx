import type {
  EditCharacterStepById,
  UpdateCharacterStepInput,
} from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormCharacterStep = NonNullable<EditCharacterStepById['characterStep']>

interface CharacterStepFormProps {
  characterStep?: EditCharacterStepById['characterStep']
  onSave: (data: UpdateCharacterStepInput, id?: FormCharacterStep['id']) => void
  error: RWGqlError
  loading: boolean
}

const CharacterStepForm = (props: CharacterStepFormProps) => {
  const onSubmit = (data: FormCharacterStep) => {
    props.onSave(data, props?.characterStep?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormCharacterStep> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="characterId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Character id
        </Label>

        <TextField
          name="characterId"
          defaultValue={props.characterStep?.characterId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="characterId" className="rw-field-error" />

        <Label
          name="stepId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Step id
        </Label>

        <TextField
          name="stepId"
          defaultValue={props.characterStep?.stepId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="stepId" className="rw-field-error" />

        <Label
          name="text"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Text
        </Label>

        <TextField
          name="text"
          defaultValue={props.characterStep?.text}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="text" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default CharacterStepForm
