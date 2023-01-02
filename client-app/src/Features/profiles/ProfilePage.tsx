import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../App/stores/store";
import { useEffect } from "react";
import LoadingComponent from "../../App/Layout/LoadingComponent";

export default observer(function ProfilePage() {
  const { username } = useParams<{username: string}>();
  const { profileStore } = useStore();
  const { loadingProfile, loadProfile, profile } = profileStore;

  useEffect(() => {
    if (username) loadProfile(username);
  }, [loadProfile, username]);

  // Siple useEffect to reset the scroll to the top of the page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loadingProfile)
    return <LoadingComponent inverted content="Loading profile..." />;

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && (
          <>
            <ProfileHeader profile={profile}></ProfileHeader>
            <ProfileContent profile={profile}></ProfileContent>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
});
