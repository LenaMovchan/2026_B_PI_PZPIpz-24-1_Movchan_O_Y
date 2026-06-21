import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import IQuestion from '../../../../models/profile/IQuestion';
import { changeGrade } from '../../../../store/reducers/profile/actions';

function Question({
  question, skillName, grade, id, searcherId, createdAt,
}: IQuestion): JSX.Element {
  const [newGrade, setNewGrade] = useState(grade ? 0 : grade);
  const [changeGradeClicked, setChangeGradeClicked] = useState(false);
  const userId = useAppSelector((state) => state.user.userData.id);
  const { id: interviewId } = useParams();
  const dispatch = useAppDispatch();
  const handleChangeGrade = (): void => {
    dispatch(changeGrade({ id,grade:newGrade, interviewId: Number(interviewId) }));};

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '15% 50% 35%',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
      key={id}
    >
      <p style={{ color: 'black', flexShrink: 0 }}>{ skillName }</p>
      <p style={{ color: 'black', flexShrink: 0 }}>{ question }</p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p style={{ color: 'black' }}>{ createdAt }</p>
        {changeGradeClicked && (searcherId !== userId) ? (
          <>
            <input
              type="text"
              id={`${id}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGrade(+e.target.value)}
              value={newGrade}
              onKeyDown={handleChangeGrade}
              placeholder="Вкажіть нову оцінку у %"
            />
            <button type="button" onClick={(): void => setChangeGradeClicked(!changeGradeClicked)}>Відмінити</button>
          </>
        ) : (
          <div role="button" tabIndex={0} onClick={(): void => setChangeGradeClicked(!changeGradeClicked)}>
            <p style={{ color: 'black' }}>{newGrade}</p>
            <div style={{
              width: newGrade,
              backgroundColor: 'green',
              height: '4px',
              borderRadius: '4px',
              marginTop: '10px',
            }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Question;
