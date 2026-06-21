export type Criteria = { skill: string; grade: string };

type CandidateSearchFormProps = {
  setFormData: React.Dispatch<React.SetStateAction<Criteria[]>>;
  formData: Criteria[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export default CandidateSearchFormProps;
