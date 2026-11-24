import React from 'react'
import "../styles/MessageBox.css"

const MessageBox = (props) => {
    return (
        <div role={props.variant === 'danger' ? 'alert' : 'status'} className={`alert alert-${props.variant || 'info'}`}>
            {props.children}
        </div>
    )
}

export default MessageBox
