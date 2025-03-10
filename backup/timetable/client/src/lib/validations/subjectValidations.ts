import * as Yup from 'yup';

export const subjectSchema = Yup.object().shape({
    subject_name: Yup.string().required('Subject name is required'),
});