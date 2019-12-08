import React from 'react';

function VoteSubmitted() {

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1>Canada Votes Online</h1>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label id="uuidLabel" for="uuid"></label>
                    <input id="uuid" type="text" aria-describedby="uuidLabel"></input>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label id="passwordLabel" for="password"></label>
                    <input id="password" type="password" aria-describedby="passwordLabel"></input>
                </div>
            </div>
        </div>
    );
}

export default VoteSubmitted;
