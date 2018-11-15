import React from 'react';

const commentStyle = {
  backgroundColor: 'hsla(0,0%,100%,0.125)',
  border: '0',
  borderRadius: '4px',
  color: '#fff',
  marginBottom: '1rem',
  padding: '0.5rem'
}

function Comment({ comment }) {
  return (
    <div style={commentStyle}>
      <p><strong>@{comment.author}:</strong> {comment.body}</p>
    </div>
  );
}

export default Comment;
