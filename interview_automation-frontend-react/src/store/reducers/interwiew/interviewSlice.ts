import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IInterview } from '../../../models/profile/IInterview';
import IQuestion from '../../../models/profile/IQuestion';
import { ISkills } from '../../../models/profile/ISkills';
import { IRoles, RolesTypes } from '../../../models/user/IRoles';
import { IUser } from '../../../models/user/IUser';
import {
  calculateAndSortSharedSkills,
  flattenSkillsHierarchy,
} from '../../../utils/interview/calculateAndSortSharedSkills';
import { changeGrade, getInterviewById } from '../profile/actions';
import getUser from '../user/actions';
import {
  getAllSkills, getGeminiQuestions, getInterviewId, getSkillQuestions, getUserByEmail, updateInterviewStatus,
} from './actions';

const defaultUser: IUser = {
  id: 0,
  username: '',
  firstname: '',
  lastname: '',
  email: '',
  avatarImgUrl: '',
  description: '',
  roles: [{
    id: 0,
    name: '',
    skills: [],
  }],
};

interface IInitialState extends IInterview {
  currentProfileRole: RolesTypes
  allSkills: ISkills[]
  sharedSkills: ISkills[]
  isLoading: boolean
  lowLvlSkills: ISkills[]
  questions: IQuestion[]
  currentSkillQuestions: IQuestion[]
  geminiQuestions: string[]
  socket: { status: string }

}

const initialState: IInitialState = {
  id: 0,
  currentProfileRole: '',
  title: '',
  status: '',
  interviewer: { ...defaultUser },
  searcher: { ...defaultUser },
  allSkills: [],
  sharedSkills: [],
  isLoading: false,
  plannedDateTime: null,
  startDateTime: null,
  endDateTime: null,
  feedback: '',
  geminiQuestions: [],
  lowLvlSkills: [],
  questions: [],
  currentSkillQuestions: [],
  socket: { status: '' }

};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    resetInterviewState: () => initialState,
    redefineQuestions: (state, action) => ({
      ...state,
      questions: action.payload,

    }),
    redefineStatus: (state, action) => ({
      ...state,
      status: action.payload,
    }),
    setTitle: (state, action: PayloadAction<string>) => ({
      ...state,
      title: action.payload,
    }),
    setSocketStatus: (state, action) => (
      {
        ...state,
        socket: {
          status: action.payload
        }
      }),

    connectToWebSocket: (state, action: PayloadAction<{ interviewId: number }>) => ({
      ...state,
      ...action
    }),
    disconnectFromWebSocket: () => { },
  },
  extraReducers: (builder) => {
    builder.addCase(getInterviewId.fulfilled, (state, action) => ({
      ...state,
      id: action.payload,
    }));
    builder.addCase(getUser.fulfilled, (state, action) => {
      const { roles } = action.payload;

      if (roles.find((role) => role.id === 2)) {
        const interviewSkills: ISkills[] = action.payload.roles.find((role: IRoles) => role.id === 2)?.skills ?? [];

        return {
          ...state,
          currentProfileRole: 'INTERVIEWER',
          interviewer: action.payload,
          sharedSkills:
            calculateAndSortSharedSkills(state.lowLvlSkills, state.allSkills, interviewSkills),
        };
      }

      return {
        ...state,
        currentProfileRole: roles[0].name,
        sharedSkills: flattenSkillsHierarchy(roles[0].skills),
      };
    });
    builder.addCase(getUserByEmail.fulfilled, (state, action) => {
      const searcherSkills = action.payload.roles.find((roles: IRoles) => roles.id === 1)?.skills ?? [];
      const interviewSkills = state.interviewer.roles.find((roles: IRoles) => roles.id === 2)?.skills ?? [];

      return {
        ...state,
        searcher_id: action.payload.id,
        searcher: action.payload,
        sharedSkills:
          calculateAndSortSharedSkills(
            state.lowLvlSkills,
            searcherSkills,
            interviewSkills,
          ),
      };
    });
    builder.addCase(getAllSkills.fulfilled, (state, action) => {
      const lowLvlSkills: ISkills[] = flattenSkillsHierarchy(action.payload || []);
      const interviewSkills: ISkills[] = state.interviewer.roles.find((roles: IRoles) => roles.id === 2)?.skills ?? [];

      return {
        ...state,
        allSkills: action.payload,
        lowLvlSkills: flattenSkillsHierarchy(action.payload),
        sharedSkills:
          calculateAndSortSharedSkills(lowLvlSkills, action.payload, interviewSkills),
      };
    });
    // builder.addCase(addQuestion.fulfilled, (state, action) => ({
    //   ...state,
    //   questions: [...state.questions, action.payload],
    // }));
    builder.addCase(updateInterviewStatus.fulfilled, (state, action) => ({
      ...state,
      ...action.payload,
    }));
    builder.addCase(getSkillQuestions.fulfilled, (state, action) => ({
      ...state,
      currentSkillQuestions: action.payload,
    }));
    builder.addCase(getGeminiQuestions.fulfilled, (state, action) => ({
      ...state,
      geminiQuestions: action.payload
    }));
    builder.addCase(getInterviewById.fulfilled, (state, action) => {
      const searcherSkills = action.payload.searcher.roles.find((roles: IRoles) => roles.id === 1)?.skills ?? [];
      const interviewSkills = action.payload.interviewer.roles.find((roles: IRoles) => roles.id === 2)?.skills ?? [];
      const lowLvlSkills = flattenSkillsHierarchy(state.allSkills);

      const sharedSkills = calculateAndSortSharedSkills(
        lowLvlSkills,
        searcherSkills,
        interviewSkills,
      );

      return {
        ...state,
        ...action.payload,
        sharedSkills,
      };
    });
    builder.addCase(changeGrade.fulfilled, (state, action) => {
      const updatedQuestion = action.payload;
      const updatedQuestions = state.questions.map((question) => {
        if (question.id === updatedQuestion.id) {
          return { ...question, grade: updatedQuestion.grade };
        }

        return question;
      });

      return { ...state, questions: updatedQuestions };
    });
  },
});
export const {
  setTitle,
  resetInterviewState,
  redefineQuestions,
  redefineStatus,
  connectToWebSocket,
  disconnectFromWebSocket,
  setSocketStatus
} = interviewSlice.actions;

export default interviewSlice.reducer;
