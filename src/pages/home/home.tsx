import React from 'react';
import { RouteComponentProps } from '@reach/router';

interface Props extends RouteComponentProps {}

const Home: React.FC<Props> = () => {
    return (
        <main>Home!</main>
    );
}
          
export default Home;