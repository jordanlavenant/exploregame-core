import type { EditPlayerById, UpdatePlayerInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  FileField,
  Submit,
} from '@redwoodjs/forms'
import { uploadFile } from 'api/src/lib/minio'

type FormPlayer = NonNullable<EditPlayerById['player']>

interface PlayerFormProps {
  player?: EditPlayerById['player']
  onSave: (data: UpdatePlayerInput, id?: FormPlayer['id']) => void
  error: RWGqlError
  loading: boolean
}

const MINIO_ENDPOINT = process.env.REDWOOD_ENV_MINIO_ENDPOINT
const PLAYER_PROFILE_PICTURE_BUCKET = process.env.REDWOOD_ENV_PLAYER_PROFILE_PICTURE_BUCKET

const PlayerForm = (props: PlayerFormProps) => {
  const onSubmit = async (data: FormPlayer) => {
    const file = data.profilePictureUrl?.[0]
    data.profilePictureUrl = props.player?.profilePictureUrl || ''

    if (file) {
      const objectName = `${data.email}-${Date.now()}`;
      console.log(file)
      // await uploadFile(PLAYER_PROFILE_PICTURE_BUCKET, objectName, file, {
      //   'Content-Type': file.type,
      // })
      data.profilePictureUrl = `
        ${MINIO_ENDPOINT}
        /${PLAYER_PROFILE_PICTURE_BUCKET}
        /${objectName}`
    }

    console.log(data)

    props.onSave({ ...data }, props?.player?.id);
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
          name="profilePictureUrl"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Profile Picture
        </Label>

        <FileField
          name="profilePictureUrl"
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="profilePictureUrl" className="rw-field-error" />

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