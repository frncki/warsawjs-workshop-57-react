import * as React from 'react';
import { useActor } from '@xstate/react';

import SelectMeal from './SelectMeal';
import OrderCompletionStatus from './OrderCompletionStatus';
import LoginForm from './LoginForm'
import { Segment } from 'semantic-ui-react';
import { GlobalStateContext } from '../commons/globalState';

const PageContent = () => {
  const globalServices = React.useContext(GlobalStateContext);
  const [state] = useActor(globalServices)

  const isLoggedIn = state.matches('loggedIn');

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <Section>
            <OrderCompletionStatus />
          </Section>
          <Section>
            <SelectMeal />
          </Section>
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};
export default PageContent;

const Section = (props) => (
  <Segment vertical style={{ padding: '2em 0em' }}>
    {props.children}
  </Segment>
);
