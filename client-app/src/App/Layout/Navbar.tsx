import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react'

export default function Navbar() {

      // Now we are using NavLink to connect the navigation links to our buttons on the navbar

      return (
            <Menu inverted fixed='top'>
                  <Container>
                        <Menu.Item as={NavLink} to='/' header >
                              <img src='/assets/logo.png' alt='logo' style={{marginRight: '10px'}}></img>
                              Reactivities
                        </Menu.Item>
                        <Menu.Item as={NavLink} to='/activities' name='Activities'>
                        </Menu.Item>
                        <Menu.Item >
                              <Button as={NavLink} to='/createActivity' positive content='Create Activity'></Button>
                        </Menu.Item>
                  </Container>
            </Menu>
      )
}