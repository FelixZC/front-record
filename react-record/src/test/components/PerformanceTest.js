import React from 'react';
import { Profiler } from 'react';

const ProfiledComponent = (props) => {
  return (
    <Profiler id="profiled-component" onRender={(id, phase, actualDuration) => {
      console.log(`Component rendered: ${id}, Phase: ${phase}, Time: ${actualDuration}`);
    }}>
      <div>{props.message}</div>
    </Profiler>
  );
};

export default ProfiledComponent;