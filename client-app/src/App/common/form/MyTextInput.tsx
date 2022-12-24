import { useField } from 'formik';
import React from 'react'
import { Form, Label } from 'semantic-ui-react'

interface Props {
      placeholder: string;
      name: string;
      label?: string;
      type?: string;
}

export default function MyTextInut(props: Props) {
      const [field, meta] = useField(props.name)
      return (
            // The !! makes the vield into a boolean. It usually returns a string or undefined and we want to use it as a boolean 
            <Form.Field error={meta.touched && !!meta.error}>
                  <label>{props.label}</label>
                  <input {...field} {...props}></input>
                  {meta.touched && meta.error ? (
                        <Label basic color='red'>{meta.error}</Label>
                  ) : null}
            </Form.Field>
      )
}