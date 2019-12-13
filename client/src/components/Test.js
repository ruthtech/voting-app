import React from 'react';
import UserContext from '../utils/UserContext';
import './style.css';

function Test() {

    return (
        <UserContext.Consumer>
        {  
            ({user}) => 
            <div>
                <h1>This is a test, {user.name}</h1>
            </div>
        }
        </UserContext.Consumer>
    );
}

export default Test;
