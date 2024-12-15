import type { EditAssetById, UpdateAssetInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormAsset = NonNullable<EditAssetById['asset']>

interface AssetFormProps {
  asset?: EditAssetById['asset']
  onSave: (data: UpdateAssetInput, id?: FormAsset['id']) => void
  error: RWGqlError
  loading: boolean
}

const AssetForm = (props: AssetFormProps) => {
  const onSubmit = (data: FormAsset) => {
    props.onSave(data, props?.asset?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormAsset> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="filename"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Filename
        </Label>

        <TextField
          name="filename"
          defaultValue={props.asset?.filename}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="filename" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default AssetForm
