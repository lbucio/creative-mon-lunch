import React from 'react';
import { RouteComponentProps } from '@reach/router';

interface Props extends RouteComponentProps {
    prediction?: string;
}

const Predictions: React.FC<Props> = ({ prediction }) => {
    return (
        <main>Predictions! {prediction}</main>
    );
}
          
export default Predictions;