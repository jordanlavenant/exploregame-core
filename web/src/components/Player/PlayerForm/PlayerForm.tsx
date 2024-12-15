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
          name="email"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Email
        </Label>

        <TextField
          name="email"
          defaultValue={props.player?.email}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="email" className="rw-field-error" />

        <Label
          name="genderId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Gender id
        </Label>

        <TextField
          name="genderId"
          defaultValue={props.player?.genderId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="genderId" className="rw-field-error" />

        <Label
          name="firstName"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          First name
        </Label>

        <TextField
          name="firstName"
          defaultValue={props.player?.firstName}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="firstName" className="rw-field-error" />

        <Label
          name="lastName"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Last name
        </Label>

        <TextField
          name="lastName"
          defaultValue={props.player?.lastName}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="lastName" className="rw-field-error" />

        <Label
          name="hashedPassword"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Hashed password
        </Label>

        <TextField
          name="hashedPassword"
          defaultValue={props.player?.hashedPassword}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="hashedPassword" className="rw-field-error" />

        <Label
          name="departmentId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Department id
        </Label>

        <TextField
          name="departmentId"
          defaultValue={props.player?.departmentId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="departmentId" className="rw-field-error" />

        <Label
          name="pictureAssetId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Picture asset id
        </Label>

        <TextField
          name="pictureAssetId"
          defaultValue={props.player?.pictureAssetId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={'undefined'}
        />

        <FieldError name="pictureAssetId" className="rw-field-error" />

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
