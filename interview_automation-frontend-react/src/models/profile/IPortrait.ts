type SkillResult = {
  skillName: string,
  averageGrade: number,
};

export interface IPortrait {
  interviewId: number,
  userId: number,
  interviewDateTime: string,
  skillResults: SkillResult[]
}
