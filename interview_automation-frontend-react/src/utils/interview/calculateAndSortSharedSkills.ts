import { ISkills } from '../../models/profile/ISkills';

const flattenSkillsHierarchy = (skills:ISkills[]):
ISkills[] => {
  function getFlattenedSkills(skill: ISkills): ISkills[] {
    if (skill.children.length === 0) {
      return [skill];
    }

    return skill.children.flatMap((child) => getFlattenedSkills(child));
  }

  const flattenedSkills: ISkills[] = [];
  skills.forEach((skill) => {
    const lowLevelSkill = getFlattenedSkills(skill);
    flattenedSkills.push(...lowLevelSkill);
  });

  return flattenedSkills;
};
const sortSkillsBySharedPresence = (allSkills: ISkills[], sharedSkills: ISkills[]): ISkills[] => allSkills
  .map((skill) => ({
    ...skill,
    shared: sharedSkills.some((sharedSkill) => sharedSkill.id === skill.id),
  }))
  .sort((a, b) => {
    if (a.shared === b.shared) {
      return 0;
    }

    if (a.shared) {
      return -1;
    }

    return 1;
  });

const findSharedSkills = (higherSkills: ISkills[], lowerSkills: ISkills[]): ISkills[] => {
  const sharedSkills: ISkills[] = [];
  higherSkills.forEach((higherSkill): void => {
    const containsInLower = lowerSkills.find((skillLow) => skillLow.id === higherSkill.id);

    if (containsInLower) {
      const foundHigherSkill = higherSkills.find((higherSkill_) => higherSkill_.id === containsInLower.id);

      if (foundHigherSkill) {
        sharedSkills.push(foundHigherSkill);
      }
    }
  });

  return sharedSkills;
};
const calculateAndSortSharedSkills = (allSkills: ISkills[], userSkills: ISkills[], interviewSkills: ISkills[])
: ISkills[] => {
  const sharedSkills = findSharedSkills(userSkills, interviewSkills);
  const flattenedSharedSkills = flattenSkillsHierarchy(sharedSkills);

  return sortSkillsBySharedPresence(allSkills, flattenedSharedSkills);
};
export { calculateAndSortSharedSkills, flattenSkillsHierarchy };
