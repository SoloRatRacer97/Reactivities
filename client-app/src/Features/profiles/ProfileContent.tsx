import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react"
import { Profile } from "../../App/models/profile";
import ProfileFollowings from "./ProfileFollowings";
import ProfilePhotos from "./ProfilePhotos";
import { useStore } from "../../App/stores/store";
import ProfileActivities from "./ProfileActivities";

interface Props {
      profile: Profile;
}

export default observer(function ProfileContent({profile}: Props) {

      const {profileStore} = useStore();

      const panes = [
            {menuItem: 'About', render: () => <Tab.Pane>About Content</Tab.Pane>},
            {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile}></ProfilePhotos>},
            {menuItem: 'Events', render: () => <ProfileActivities></ProfileActivities>},
            {menuItem: 'Followers', render: () => <ProfileFollowings></ProfileFollowings>},
            {menuItem: 'Following', render: () => <ProfileFollowings></ProfileFollowings>},
      ]
      return (
            <Tab menu={{fluid: true, vertical: true}} menuPosition='right' panes={panes} onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex)}></Tab>
      )
})