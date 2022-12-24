import { Formik, Form } from 'formik';
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInut from '../../App/common/form/MyTextInput';

export default function LoginForm() {
      return (
            <Formik
            initialValues={{email: '', password: ''}}
            onSubmit={values => console.log(values)}
            >
            {({handleSubmit}) => (
                  <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInut placeholder='Email' name='email'></MyTextInut>
                        <MyTextInut placeholder='Password' name='password' type='password'></MyTextInut>
                        <Button positive content='login' type='submit' fluid></Button>
                  </Form>
            )}
            </Formik>
      )
}