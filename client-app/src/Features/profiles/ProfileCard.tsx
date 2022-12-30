import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Profile } from '../../App/models/profile';

interface Props {
      profile : Profile;
}

export default function ProfileCard({profile}: Props) {
      return (
            <Card as={Link} to={`/profiles/${profile.username}`}>
                  <Image src={profile.image || '/assets/user.png'}></Image>
                  <Card.Content>
                        <Card.Header>{profile.displayName}</Card.Header>
                        <Card.Description>Bio will go here</Card.Description>
                  </Card.Content>
                  <Card.Content>
                        <Icon name='user'></Icon>
                        20 followers
            </Card.Content>
            </Card>
      )
}