import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import {
  Button,
  Container,
  Menu,
  MenuItem,
  Image,
  Dropdown,
  DropdownMenu,
} from "semantic-ui-react";
import { useStore } from "../stores/store";

export default observer(function Navbar() {
  const {
    userStore: { user, logout },
  } = useStore();

  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} to="/" header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          ></img>
          Reactivities
        </Menu.Item>
        <Menu.Item as={NavLink} to="/activities" name="Activities"></Menu.Item>
        <Menu.Item as={NavLink} to="/errors" name="Errors"></Menu.Item>
        <Menu.Item>
          <Button
            as={NavLink}
            to="/createActivity"
            positive
            content="Create Activity"
          ></Button>
        </Menu.Item>
        <MenuItem position="right">
          <Image
            src={user?.image || "/assets/user.png"}
            avatar
            spaced="right"
          ></Image>
          <Dropdown pointing="top left" text={user?.displayName}>
            <DropdownMenu>
              <Dropdown.Item
                as={Link}
                to={`/profile/${user?.username}`}
                text="My Profile"
                icon="user"
              ></Dropdown.Item>
              <Dropdown.Item
                onClick={logout}
                text="Logout"
                icon="power"
              ></Dropdown.Item>
            </DropdownMenu>
          </Dropdown>
        </MenuItem>
      </Container>
    </Menu>
  );
});
