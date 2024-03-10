import { useEffect, useState, useContext } from 'react';

import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';
import NotificationContext from '../../store/notification-context';

function Comments(props) {
  const { eventId } = props;

  const notificationCtx = useContext(NotificationContext);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isFetchingComments, setIsFetchingComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      setIsFetchingComments(true);
      fetch(`/api/comments/${eventId}`)
        .then((response) => response.json())
        .then((data) => {
          setComments(data.comments);
      setIsFetchingComments(false);
      });
    }
  },[showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {

    //Show Pending Notification
    notificationCtx.showNotification({
      title: 'Adding comment..',
      message: 'Your coment is currently being stored into database',
      status: 'pending'
    });

    // send data to API
    fetch(`/api/comments/${eventId}`, {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if (response.ok) {
        return response.json(); // if ok, proceed
      }
      
      return response.json().then(data => {
        // if got error, the throw error message
        throw new Error(data.message || 'Something went wrong!');
      });
    })
    .then((data) => {
      // Show successful notification
      notificationCtx.showNotification({
        title: 'Success!',
        message: 'Your comment was saved',
        status: 'success'
      });
    }).catch(error => {
      // Show error notification
      notificationCtx.showNotification({
        title: 'Error!',
        message: error.message || 'Something went wrong!',
        status: 'error'
      });
    });
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && !isFetchingComments && <CommentList items={comments} />}
      {showComments && isFetchingComments && <p>Loading...</p>}
    </section>
  );
}

export default Comments;
