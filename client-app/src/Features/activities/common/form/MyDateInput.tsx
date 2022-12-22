import { useField } from 'formik';
import React from 'react'
import { Form, Label } from 'semantic-ui-react'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

interface Props {
      placeholder: string;
      name: string;
      label?: string;
}

// This is cool. We can define the types that we get from date picker as partial so that we can determine what ones we want to include and it will overwrite anyhting that date picker thinks is necessary
export default function MyDateInput(props: Partial<ReactDatePickerProps>) {
      const [field, meta, helpers] = useField(props.name!)
      return (
            // The !! makes the vield into a boolean. It usually returns a string or undefined and we want to use it as a boolean 
            <Form.Field error={meta.touched && !!meta.error}>
                  <DatePicker 
                  {...field}
                  {...props}
                  selected={(field.value && new Date(field.value)) || null}
                  onChange={value => helpers.setValue(value)}
                  >
                  </DatePicker>
                  {meta.touched && meta.error ? (
                        <Label basic color='red'>{meta.error}</Label>
                  ) : null}
            </Form.Field>
      )
}