import { createContext, useState } from 'react';

const NotificationContext = createContext({
    notification: null, // { title, message, status}
    showNotification: function() {},
    hideNotification: function() {}
});

export function NotificationContextProvider(props) {
    
    return (
        <NotificationAction.Provider>
            {props.children}
        </NotificationAction.Provider>
    );
}

export default NotificationContext;