import React from 'react';

export default ({room}: {room: string}) => (
    <div className="infoBar">
        <div className="leftInnerContainer">
            <h3>{room}</h3>
        </div>
        <div className="rightInnerContainer">
            <a href="/">Leave</a>
        </div>
    </div>
)