import type { EditPlayerById, UpdatePlayerInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormPlayer = NonNullable<EditPlayerById['player']>

interface PlayerFormProps {
  player?: EditPlayerById['player']
  onSave: (data: UpdatePlayerInput, id?: FormPlayer['id']) => void
  error: RWGqlError
  loading: boolean
}

const PlayerForm = (props: PlayerFormProps) => {
  const onSubmit = (data: FormPlayer) => {
    props.onSave(data, props?.player?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormPlayer> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="gender"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Gender
        </Label>

        <TextField
          name="gender"
          defaultValue={props.player?.gender}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="gender" className="rw-field-error" />

        <Label
          name="idU"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Id u
        </Label>

        <TextField
          name="idU"
          defaultValue={props.player?.idU}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="idU" className="rw-field-error" />

        <Label
          name="idF"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Id f
        </Label>

        <TextField
          name="idF"
          defaultValue={props.player?.idF}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="idF" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default PlayerForm
