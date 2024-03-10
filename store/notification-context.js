import { createContext, useState, useEffect } from 'react';

const NotificationContext = createContext({
    notification: null, // { title, message, status}
    showNotification: function(notificationData) {},
    hideNotification: function() {},
});

export function NotificationContextProvider(props) {
    const [activeNotification, setActiveNotification] = useState();

    // Set timer of notification bar after success or error appear
    useEffect(() => {
        if(activeNotification && 
            (activeNotification.status === 'success' || 
            activeNotification.status === 'error')
        ) {
            const timer = setTimeout(() => {
                setActiveNotification(null) // alterantively can trigger hideNotificationHandler but just proceed with null
            }, 3000);

            // Clear timer
            return () => {
                clearTimeout(timer);
            };
        }
    }, [activeNotification]);

    function showNotificationHandler(notificationData) {
        setActiveNotification(notificationData);
    }   

    function hideNotificationHandler() {
        setActiveNotification(null);
    }

    const context = { 
        notification: activeNotification, 
        showNotification: showNotificationHandler, 
        hideNotification: hideNotificationHandler
    };

    return (
    <NotificationContext.Provider value={context}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;