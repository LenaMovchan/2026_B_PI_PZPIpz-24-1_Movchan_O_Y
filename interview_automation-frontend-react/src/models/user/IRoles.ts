import { ISkills } from '../profile/ISkills';

type RolesTypes = 'SEARCHER' | 'INTERVIEWER' | 'HR' | 'ADMIN' | '';

interface IRoles {
  id:number
  name:RolesTypes
  skills:ISkills[]
}
export type { IRoles, RolesTypes };
