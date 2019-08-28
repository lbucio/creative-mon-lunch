import React from 'react';
import { RouteComponentProps } from '@reach/router';

interface Props extends RouteComponentProps {}

const NotFound: React.FC<Props> = () => {
    return (
        <main>NotFound</main>
    );
}

export default NotFound;