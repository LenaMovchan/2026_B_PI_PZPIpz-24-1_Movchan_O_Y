import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch } from '../../../../hooks/redux';
import IStatistics from '../../../../models/profile/IStatistics';
import {
  getPortrait,
  getStatistics
} from '../../../../store/reducers/profile/actions';
import Portrait from '../Portarit/Portrait';
import StatisticsTable from './StatisticsTable';

function Statistics(): JSX.Element {
  const dispatch = useAppDispatch();
  const { userId } = useParams();
  const [fulfilled, setFulfilled] = useState(false);
  const [formData, setFormData] = useState<{
    from: string;
    to: string;
  }>({
    from: '',
    to: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    await dispatch(
      getStatistics({
        id: Number(userId),
        from: formData.from,
        to: formData.to
      })
    ).then((res) => {
      const response: IStatistics[] = res.payload as IStatistics[];

      if (response.length > 0) setFulfilled(true);
      else setFulfilled(false);
    });
    await dispatch(
      getPortrait({
        id: userId as string,
        from: formData.from,
        to: formData.to
      })
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="from" />
        <input
          type="date"
          id="from"
          name="from"
          required
          onChange={handleChange}
        />
        <label htmlFor="to" />
        <input type="date" name="to" id="to" required onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      {fulfilled && (
        <>
          <Portrait />
          <StatisticsTable />
        </>
      )}
    </div>
  );
}

export default Statistics;
