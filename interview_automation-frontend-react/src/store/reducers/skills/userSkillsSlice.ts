import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ISkills } from '../../../models/profile/ISkills';
import { getRoleSkills, getUserSkillsByRole } from './actions';

interface IInitialState {
  id: string,
  allSkills: ISkills[]/// вложеность
  userSkills: ISkills[]// линейно
  allLowLevelSkills: ISkills[]// линейно
}

const initialState: IInitialState = {
  id: '0', allSkills: [], allLowLevelSkills: [], userSkills: []

};

const handleFulfilledGetSkills = (state: IInitialState, action: PayloadAction<ISkills[]>):IInitialState => {
  const allSkills = action.payload;

  function getLowLevelSkills(skill: ISkills): ISkills[] {
    if (skill.children.length === 0) {
      return [skill];
    }

    return skill.children.flatMap((child) => getLowLevelSkills(child));
  }

  const allLowLevelSkills: ISkills[] = [];

  if (allSkills){
    allSkills.forEach((skill) => {
      const lowLevelSkills = getLowLevelSkills(skill);
      allLowLevelSkills.push(...lowLevelSkills);
    });
  }

  return {
    ...state,
    allSkills,
    allLowLevelSkills,
  };
};

const userSkillsSlice = createSlice({
  name: 'addUserSkills',
  initialState,
  reducers: {
    getFilterSkillsByInput: (state, { payload }:PayloadAction<string>) => {
      const filteredSkills = state.allLowLevelSkills.filter((skill: ISkills) => skill
        .name.toLowerCase().includes(payload.toLowerCase()));

      return {
        ...state,
        filteredByInputSkills: filteredSkills,
      };
    },

    addUserSkill:(state,action)=>{
      state.userSkills.push(action.payload);
    },
    removeSkill:(state,action)=>({
      ...state,
      userSkills: state.userSkills.filter((skill) => skill.id !== action.payload.id) })
  },
  extraReducers: (builder) => {
    builder.addCase(getRoleSkills.fulfilled, (state, action) => handleFulfilledGetSkills(state, action));
    builder.addCase(getUserSkillsByRole.fulfilled,(state,action)=>({
      ...state,
      userSkills:action.payload
    }));
  },

});
export const { getFilterSkillsByInput,addUserSkill,removeSkill } = userSkillsSlice.actions;
export default userSkillsSlice.reducer;
