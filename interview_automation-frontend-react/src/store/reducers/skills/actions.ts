import { createAsyncThunk } from '@reduxjs/toolkit';

import snapshotApi from '../../../api/request';
import { ISkills } from '../../../models/profile/ISkills';
import ActionType from './common';

const getRoleSkills = createAsyncThunk(
  ActionType.GET_ROLE_SKILLS,
  async (id:number):Promise<ISkills[]> => snapshotApi.get(`skills/role/${id}`),
);
const getUserSkillsByRole = createAsyncThunk(
  ActionType.GET_USER_SKILLS_BY_ROLE,
  async ({ userId,roleId }:{ userId:number ,roleId:number }):Promise<ISkills[]> => snapshotApi.get(`skills/${userId}/role/${roleId}`),
);
const addRoleSkills = createAsyncThunk(
  ActionType.ADD_ROLE_SKILLS,
  async ({ skillIds, roleId }:{ skillIds: number[], roleId:number } ):Promise<void> =>   snapshotApi.post(`/skills/user/${roleId}`, { skillIds }),
);
export { addRoleSkills,getRoleSkills,
  getUserSkillsByRole };
