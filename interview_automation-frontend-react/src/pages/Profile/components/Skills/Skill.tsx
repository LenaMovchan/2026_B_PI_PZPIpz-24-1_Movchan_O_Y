import React from 'react';

import styles from './Skill.module.scss';

interface CustomProps {
  title:string
}

type CombinedProps = CustomProps & React.HTMLProps<HTMLDivElement>;

function Skill({ title, ...props }:CombinedProps):React.JSX.Element {
  return (
    // eslint-disable-next-line react/prop-types
    <div {...props} className={`${styles.skill} ${props.className || ''}`}>
      {title}
    </div>
  );
}
export default Skill;
