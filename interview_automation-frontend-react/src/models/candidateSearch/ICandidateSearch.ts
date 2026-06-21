export type SkillGrade = { [key: string]: string };

interface ICandidateSearch {
  id: 0,
  firstname: string,
  lastname: string,
  email: string,
  avatarImgUrl: string,
  skillGrades: SkillGrade
}

export default ICandidateSearch;
