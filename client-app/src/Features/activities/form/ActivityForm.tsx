import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useState } from "react";
import { Form, Segment, Button } from "semantic-ui-react";
import { Activity } from "../../../App/models/activity";
import { useStore } from "../../../App/stores/store";


export default observer(function ActivtyForm() {
  // Getting the store:
  const {activityStore} = useStore();
  // Destructuring the store:
  const {selectedActivity, closeForm, createActivity, updateActivity, loading} = activityStore;

  const initialSatate = selectedActivity ?? {
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  };

  const [activity, setActivity] = useState(initialSatate);

  function handleSubmit() {
    // Open form will have checked for an id already and selected the activity for us, so no need to worry about that here. Instead, we are updating the selected form if an id exists and has been selected... OR we are createing one with a new uuid if no activity is selected. 
      activity.id ? updateActivity(activity) : createActivity(activity)
  }

  // This is a clever way of keeping React up to date on our inputs. Instead of hard coding the values and then updating them, we have React watch these input fields and save them as we change the inputs as we go. Pretty neat.
  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  }

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
          onClick={closeForm}
          floated="right"
          type="button"
          content="Cancel"
        ></Button>
      </Form>
    </Segment>
  );
})
