import type { EditTagById, UpdateTagInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormTag = NonNullable<EditTagById['tag']>

interface TagFormProps {
  tag?: EditTagById['tag']
  onSave: (data: UpdateTagInput, id?: FormTag['id']) => void
  error: RWGqlError
  loading: boolean
}

const TagForm = (props: TagFormProps) => {
  const onSubmit = (data: FormTag) => {
    props.onSave(data, props?.tag?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormTag> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="titre"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Titre
        </Label>

        <TextField
          name="titre"
          defaultValue={props.tag?.titre}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="titre" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default TagForm
