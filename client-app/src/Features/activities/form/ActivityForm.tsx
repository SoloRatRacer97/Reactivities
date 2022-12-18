import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Segment, Button } from "semantic-ui-react";
import { useStore } from "../../../App/stores/store";
import { Activity } from "../../../App/models/activity";
import LoadingComponent from "../../../App/Layout/LoadingComponent";
import { v4 as uuid } from 'uuid';


export default observer(function ActivtyForm() {
  // Getting the store:
  const {activityStore} = useStore();
  // Destructuring the store:
  const {createActivity, updateActivity, loading, loadActivity, loadingInitial} = activityStore;

  const {id} = useParams();
  const navigate = useNavigate();

  // Basic default state of empty for the initial state for the activity
  const [activity, setActivity] = useState<Activity> ({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });

  // Recall that useEffect runs on startup. So this will set the activity to the whatever sctivity we get back from loading one
  useEffect(() => {
    // We are using an ! here for typscript to be happy since it thinkns that the actiivity we are returning needs to be a certain type but we know better. Come back and review this.. need to know more about TS in these cases.
    if (id) loadActivity(id).then(activity => setActivity(activity!))
    // Recall: Again, we need to set the dependancies here so we are not perpetually loading them over and over agian. not sure why I can never really remember this step...
  }, [id, loadActivity]);

  function handleSubmit() {
    if (!activity.id) {
      activity.id = uuid();
      createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    } else {
      updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    }

    // Open form will have checked for an id already and selected the activity for us, so no need to worry about that here. Instead, we are updating the selected form if an id exists and has been selected... OR we are createing one with a new uuid if no activity is selected. 
      activity.id ? updateActivity(activity) : createActivity(activity)
  }

  // This is a clever way of keeping React up to date on our inputs. Instead of hard coding the values and then updating them, we have React watch these input fields and save them as we change the inputs as we go. Pretty neat.
  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  }

  if (loadingInitial) return <LoadingComponent content='Loading activity...'></LoadingComponent>

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Input
          placeholder="Title"
          name="title"
          value={activity.title}
          onChange={handleInputChange}
        ></Form.Input>
        <Form.TextArea
          placeholder="Description"
          name="description"
          value={activity.description}
          onChange={handleInputChange}
        ></Form.TextArea>
        <Form.Input
          placeholder="Category"
          name="category"
          value={activity.category}
          onChange={handleInputChange}
        ></Form.Input>
        <Form.Input
          type='date'
          placeholder="Date"
          name="date"
          value={activity.date}
          onChange={handleInputChange}
        ></Form.Input>
        <Form.Input
          placeholder="City"
          name="city"
          value={activity.city}
          onChange={handleInputChange}
        ></Form.Input>
        <Form.Input
          placeholder="Venue"
          name="venue"
          value={activity.venue}
          onChange={handleInputChange}
        ></Form.Input>
        <Button
        loading={loading}
          floated="right"
          positive
          type="submit"
          content="Submit"
        ></Button>
        <Button
        as={Link}
         to='/activities'
          floated="right"
          type="button"
          content="Cancel"
        ></Button>
      </Form>
    </Segment>
  );
})
