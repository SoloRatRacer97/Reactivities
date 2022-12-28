import { Formik, Form, ErrorMessage } from "formik";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInut from "../../App/common/form/MyTextInput";
import userStore from "../../App/stores/userStore";
import { useStore } from "../../App/stores/store";
import { observer } from "mobx-react-lite";

// Recall: We need to make the function an observable whenever we are using store when we are using Mobx?
export default observer(function LoginForm() {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{ email: "", password: "", error: null }}
      onSubmit={(values, { setErrors }) =>
        userStore
          .login(values)
          .catch((error) => setErrors({ error: "Invalid email or password" }))
      }
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
          <Header as='h2' content='Login to Reactivities' color="teal" textAlign="center">

          </Header>
          <MyTextInut placeholder="Email" name="email"></MyTextInut>
          <MyTextInut
            placeholder="Password"
            name="password"
            type="password"
          ></MyTextInut>
          <ErrorMessage name='error' render={() => <Label style={{marginBottom: 10}} basic color="red" content={errors.error}></Label>}></ErrorMessage>
          <Button
            loading={isSubmitting}
            positive
            content="login"
            type="submit"
            fluid
          ></Button>
        </Form>
      )}
    </Formik>
  );
});
