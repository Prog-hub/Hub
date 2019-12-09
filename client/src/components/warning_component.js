import React from 'react';
import styles from 'Styles/warning_component.css';
import sharedStyles from 'Styles/shared.css';

type Props = {
    text: string
}

function WarningComponent(props: Props) {
    return ( 
        <div className={styles.warning_container}> 
            <p id="warning" className={sharedStyles.warning_text}>{`Warning: ${props.text}`}</p>
        </div>
    );

}

export default WarningComponent;