import React from 'react'
import { Button, Container, Menu } from 'semantic-ui-react'
import { useStore } from '../stores/store';

export default function Navbar() {
      // Simple inport of our store:
      const {activityStore} = useStore();

      return (
            <Menu inverted fixed='top'>
                  <Container>
                        <Menu.Item header >
                              <img src='/assets/logo.png' alt='logo' style={{marginRight: '10px'}}></img>
                              Reactivities
                        </Menu.Item>
                        <Menu.Item name='Activities'>
                        </Menu.Item>
                        <Menu.Item>
                              {/* Calling the method in the activitity store when clicked. No id here, we are only opening up the form to make a new activity since this is the create activity button */}
                              <Button onClick={() => activityStore.openForm()} positive content='Create Activity'></Button>
                        </Menu.Item>
                  </Container>
            </Menu>
      )
}