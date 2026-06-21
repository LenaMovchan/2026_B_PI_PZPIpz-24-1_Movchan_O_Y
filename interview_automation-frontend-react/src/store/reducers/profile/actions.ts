import { createAsyncThunk } from '@reduxjs/toolkit';

import snapshotApi from '../../../api/request';
import { IInterview } from '../../../models/profile/IInterview';
import IInterviewPreview from '../../../models/profile/IInterviewPreview';
import { IPortrait } from '../../../models/profile/IPortrait';
import IStatistics from '../../../models/profile/IStatistics';
import ActionType from './common';

type PatchQuestion = {
  id: number;
  interviewId: number;
  grade: number;
};

type PatchFeedBack = {
  interviewId: number;
  feedback: string;
};

type PatchedQuestion = {
  id: number;
  grade: number;
};

type GetStatistics = {
  id: number;
  from: string;
  to: string;
};

type GetPortrait = {
  id: string;
  from?: string;
  to?: string;
};

const changeGrade = createAsyncThunk(
  ActionType.CHANGE_GRADE,
  async (data: PatchQuestion): Promise<PatchedQuestion> => snapshotApi.patch('/interviews/question/grade', data)
);

const changeFeedback = createAsyncThunk(
  ActionType.CHANGE_FEEDBACK,
  async (data: PatchFeedBack): Promise<string > => snapshotApi.patch(
    `/interviews/${data.interviewId}/feedback`, data.feedback)
);

const getMyInterviews = createAsyncThunk(
  ActionType.GET_MY_INTERVIEWS,
  async (): Promise<IInterviewPreview[]> => snapshotApi.get('/interviews')
);

const getInterviewById = createAsyncThunk(
  ActionType.GET_INTERVIEW_BY_ID,
  async (id: number): Promise<IInterview> => snapshotApi.get(`/interviews/${id}`)
);

const getLowerSkills = createAsyncThunk(
  ActionType.GET_LOWER_SKILLS,
  async (id: number): Promise<string[]> => snapshotApi.get(`/skills/${id}`)
);

const getPortrait = createAsyncThunk(
  ActionType.GET_PORTRAIT,
  async ({ id, from, to }: GetPortrait): Promise<IPortrait[]> => snapshotApi.get(
    `/users/portrait/${id}?${from && to ? `from=${from}&to=${to}` : ''}`
  )
);

const getStatistics = createAsyncThunk(
  ActionType.GET_STATISTICS,
  async ({ id, from, to }: GetStatistics): Promise<IStatistics[]> => snapshotApi.get(
    `/users/statistic/${id}?from=${from}&to=${to}`
  )
);

export {
  changeFeedback,
  changeGrade,
  getInterviewById,
  getLowerSkills,
  getMyInterviews,
  getPortrait,
  getStatistics
};
