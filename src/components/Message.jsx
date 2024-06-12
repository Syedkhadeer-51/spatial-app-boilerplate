import React from 'react';

function Message({ message, error }) {
  return (
    <div>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Message;
