import type { EditFiliereByIdF, UpdateFiliereInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormFiliere = NonNullable<EditFiliereByIdF['filiere']>

interface FiliereFormProps {
  filiere?: EditFiliereByIdF['filiere']
  onSave: (data: UpdateFiliereInput, idF?: FormFiliere['idF']) => void
  error: RWGqlError
  loading: boolean
}

const FiliereForm = (props: FiliereFormProps) => {
  const onSubmit = (data: FormFiliere) => {
    props.onSave(data, props?.filiere?.idF)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormFiliere> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="nomF"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nom f
        </Label>

        <TextField
          name="nomF"
          defaultValue={props.filiere?.nomF}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="nomF" className="rw-field-error" />

        <Label
          name="descriptionF"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description f
        </Label>

        <TextField
          name="descriptionF"
          defaultValue={props.filiere?.descriptionF}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="descriptionF" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default FiliereForm
