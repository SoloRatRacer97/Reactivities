import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Profile } from '../../App/models/profile';
import FollowButton from './FollowButton';

interface Props {
      profile : Profile;
}

export default function ProfileCard({profile}: Props) {

      function truncate(str: string | undefined) {
            if (str) {
                return str.length > 40 ? str.substring(0, 37) + '...' : str;
            }
        }

      return (
            <Card as={Link} to={`/profiles/${profile.username}`}>
                  <Image src={profile.image || '/assets/user.png'}></Image>
                  <Card.Content>
                        <Card.Header>{profile.displayName}</Card.Header>
                        <Card.Description>{truncate(profile.bio)}</Card.Description>
                  </Card.Content>
                  <Card.Content>
                        <Icon name='user'></Icon>
                        {profile.followersCount} followers
            </Card.Content>
            <FollowButton profile={profile}></FollowButton>
            </Card>
      )
}