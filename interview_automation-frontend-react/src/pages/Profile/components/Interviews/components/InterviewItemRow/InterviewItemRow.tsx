import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../../../../../../hooks/redux';
import IInterviewPreview from '../../../../../../models/profile/IInterviewPreview';
import { toLocalDate } from '../../../../../../utils/interview/formatQuestionsWithLocalDate';
import styles from './InterviewItemRow.module.scss';
import TableButton from './TableButton';

function InterviewTable({
  id,
  status, interviewer,searcher, plannedDateTime, endDateTime,title
}: IInterviewPreview): React.JSX.Element {
  const date = endDateTime ? toLocalDate(endDateTime) : toLocalDate(plannedDateTime);
  const { id:userId } = useAppSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const statusText = ():string=>{
    switch (status){
      case 'CANCELLED':return 'скасована';
      case 'PLANNED':return 'запланована';
      case 'ACTIVE': return 'активнє';
      case 'FINISHED' :return 'проведена';
      default: return 'завершено';
    }
  };
  const handleRowClick = ():void => {
    navigate(`../interview/${id}`);
  };
  const handleUserNameClick = (e: React.MouseEvent<HTMLTableCellElement>):void=>{
    e.stopPropagation();
    navigate(`../${userId === interviewer.id? searcher.id : interviewer.id}`,{ relative:'path' });
  };

  return (
    <tr className={styles.tableRow} onClick={handleRowClick}>
      <td>{date}</td>
      <td onClick={handleUserNameClick}
      >
        {userId === interviewer.id?  searcher.userFullName:interviewer.userFullName}
      </td>
      <td className={`${status==='FINISHED'? styles.finishedStatus:''}`}>{statusText()}</td>
      <td>{title}</td>
      <td aria-label="table button"
        className={styles.buttonGroup}
        onClick={(e) => e.stopPropagation()}
      >
        <TableButton id={id} status={status} title={title} />
      </td>
    </tr>
  );
}

export default InterviewTable;
