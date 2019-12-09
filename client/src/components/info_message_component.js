import React from 'react';
import sharedStyles from 'Styles/shared.css';

type Props = {
    text: string
}

function InfoMessageComponent(props: Props) {
    return ( 
        <div className={sharedStyles.basic_container}> 
            <p className={sharedStyles.info_text}>{`${props.text}`}</p>
        </div>
    );
}

export default InfoMessageComponent;