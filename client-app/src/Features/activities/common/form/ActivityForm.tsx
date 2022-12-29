import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Segment, Button, Header } from "semantic-ui-react";
import { useStore } from "../../../../App/stores/store";
import { Activity, ActivityFormValues } from '../../../../App/models/activity';
import LoadingComponent from "../../../../App/Layout/LoadingComponent";
import { v4 as uuid } from "uuid";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInut from "../../../../App/common/form/MyTextInput";
import MyTextArea from "./MyTextArea";
import { categoryOptions } from "../options/CategoryOption";
import MySelectInput from "./MySelectInput";
import MyDateInput from "./MyDateInput";

export default observer(function ActivtyForm() {
  // Getting the store:
  const { activityStore } = useStore();
  // Destructuring the store:
  const {
    createActivity,
    updateActivity,
    loading,
    loadActivity,
    loadingInitial,
  } = activityStore;

  const { id } = useParams();
  const navigate = useNavigate();

  // Basic default state of empty for the initial state for the activity
  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required"),
    description: Yup.string().required("The activity description is required"),
    category: Yup.string().required(),
    date: Yup.string().required("Date is required").nullable(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  // Recall that useEffect runs on startup. So this will set the activity to the whatever sctivity we get back from loading one
  useEffect(() => {
    // We are using an ! here for typscript to be happy since it thinkns that the actiivity we are returning needs to be a certain type but we know better. Come back and review this.. need to know more about TS in these cases.
    if (id) loadActivity(id).then((activity) => setActivity(new ActivityFormValues(activity)));
    // Recall: Again, we need to set the dependancies here so we are not perpetually loading them over and over agian. not sure why I can never really remember this step...
  }, [id, loadActivity]);

  function handleFormSubmit(activity: ActivityFormValues) {
    if (!activity.id) {
        let newActivity = {
            ...activity,
            id: uuid()
        };
        createActivity(newActivity).then(() => navigate(`/activities/${newActivity.id}`))
    } else {
      updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    }
  }

  if (loadingInitial)
    return <LoadingComponent content="Loading activity..."></LoadingComponent>;

  return (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal'></Header>
      {/* enableReinitialize is really cool. It makes Reack go back and fill in data if it is avalible and prerenders it into the form. */}
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={values =>  handleFormSubmit(values)}
      >
        {/* Destructuring the inputs for Formink so we can use them in our form: */}
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInut name="title" placeholder="Title"></MyTextInut>
            <MyTextArea
              rows={3}
              placeholder="Description"
              name="description"
            ></MyTextArea>
            <MySelectInput
              options={categoryOptions}
              placeholder="Category"
              name="category"
            ></MySelectInput>
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMM d, yyy h:m aa"
            ></MyDateInput>
            <Header content='Location Details' sub color='teal'></Header>
            <MyTextInut placeholder="City" name="city"></MyTextInut>
            <MyTextInut placeholder="Venue" name="venue"></MyTextInut>
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={isSubmitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            ></Button>
            <Button
              as={Link}
              to="/activities"
              floated="right"
              type="button"
              content="Cancel"
            ></Button>
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
