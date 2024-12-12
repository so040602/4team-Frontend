import React, { useEffect, useState } from 'react';
import SingleComment from './SingleComment';

function ReplyComment(props) {
  const [childCommentNumber, setChildCommentNumber] = useState(0);
  const [openReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    props.commentList.forEach(comment => {
      if (comment.parentId === props.parentCommentId) {
        commentNumber++;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [props.commentList, props.parentCommentId]);

  const renderReplyComment = (parentCommentId) =>
    props.commentList.map((comment, index) => (
      <React.Fragment key={index}>
        {comment.parentId === parentCommentId && (
          <div style={{ width: '80%', marginLeft: '40px' }}>
            <SingleComment
              refreshFunction={props.refreshFunction}
              comment={comment}
              reviewId={props.reviewId}
            />
            <ReplyComment
              refreshFunction={props.refreshFunction}
              commentList={props.commentList}
              reviewId={props.reviewId}
              parentCommentId={comment.id}
            />
          </div>
        )}
      </React.Fragment>
    ));

  const handleChange = () => {
    setOpenReplyComments(!openReplyComments);
  };

  return (
    <div>
      {childCommentNumber > 0 && (
        <p
          style={{ fontSize: '14px', margin: 0, color: 'gray', cursor: 'pointer' }}
          onClick={handleChange}
        >
          {openReplyComments ? '답글 숨기기' : `${childCommentNumber}개의 답글 보기`}
        </p>
      )}
      {openReplyComments && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
