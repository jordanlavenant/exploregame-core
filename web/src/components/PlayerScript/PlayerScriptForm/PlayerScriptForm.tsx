import type {
  EditPlayerScriptById,
  UpdatePlayerScriptInput,
} from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  NumberField,
  Submit,
} from '@redwoodjs/forms'

type FormPlayerScript = NonNullable<EditPlayerScriptById['playerScript']>

interface PlayerScriptFormProps {
  playerScript?: EditPlayerScriptById['playerScript']
  onSave: (data: UpdatePlayerScriptInput, id?: FormPlayerScript['id']) => void
  error: RWGqlError
  loading: boolean
}

const PlayerScriptForm = (props: PlayerScriptFormProps) => {
  const onSubmit = (data: FormPlayerScript) => {
    props.onSave(data, props?.playerScript?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormPlayerScript> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="playerId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Player id
        </Label>

        <TextField
          name="playerId"
          defaultValue={props.playerScript?.playerId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="playerId" className="rw-field-error" />

        <Label
          name="scriptId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Script id
        </Label>

        <TextField
          name="scriptId"
          defaultValue={props.playerScript?.scriptId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="scriptId" className="rw-field-error" />

        <Label
          name="score"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Score
        </Label>

        <NumberField
          name="score"
          defaultValue={props.playerScript?.score}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="score" className="rw-field-error" />

        <Label
          name="remainingTime"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Remaining time
        </Label>

        <NumberField
          name="remainingTime"
          defaultValue={props.playerScript?.remainingTime}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="remainingTime" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default PlayerScriptForm
