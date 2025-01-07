import type { EditCharacterById, UpdateCharacterInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormCharacter = NonNullable<EditCharacterById['character']>

interface CharacterFormProps {
  character?: EditCharacterById['character']
  onSave: (data: UpdateCharacterInput, id?: FormCharacter['id']) => void
  error: RWGqlError
  loading: boolean
}

const CharacterForm = (props: CharacterFormProps) => {
  const onSubmit = (data: FormCharacter) => {
    props.onSave(data, props?.character?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormCharacter> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="nomPerso"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nom perso
        </Label>

        <TextField
          name="nomPerso"
          defaultValue={props.character?.nomPerso}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="nomPerso" className="rw-field-error" />

        <Label
          name="descriptionL"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description l
        </Label>

        <TextField
          name="descriptionL"
          defaultValue={props.character?.descriptionL}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="descriptionL" className="rw-field-error" />

        <Label
          name="image"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Image
        </Label>

        <TextField
          name="image"
          defaultValue={props.character?.image}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="image" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default CharacterForm
