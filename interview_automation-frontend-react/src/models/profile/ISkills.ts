export interface ISkills {
  id: number;
  name: string;
  children: ISkills[];
  shared?:boolean
}

