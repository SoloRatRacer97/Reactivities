import React from "react";
import { Button, Item, Segment, Label } from 'semantic-ui-react';
import { Activity } from "../../../App/models/activity";

interface Props {
  activities: Activity[];
  selectActivity: (id: string) => void;
  deleteActivity: (id: string) => void;

}

export default function ActivityList({ activities, selectActivity, deleteActivity }: Props) {
  return (
    <Segment>
      <Item.Group divided>
        {activities.map((activity) => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>{activity.city}, {activity.venue}</div>
              </Item.Description>
              <Item.Extra>
                  <Button floated='right' content='View' color='blue' onClick={() => selectActivity(activity.id)}></Button>
                  <Button floated='right' content='Delete' color='red' onClick={() => deleteActivity(activity.id)}></Button>
                  <Label basic content={activity.category}></Label>
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
}
