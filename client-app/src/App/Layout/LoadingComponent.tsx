import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
      // Recall that the ? in front of the keys here makes it an optional parameter. 
      inverted?: boolean;
      content?: string;
}

export default function LoadingComponent({inverted = true, content = 'Loading...'}: Props) {
      return (
            <Dimmer active={true} inverted={inverted}>
                  <Loader content={content}></Loader>
            </Dimmer>
      )
}