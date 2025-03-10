import * as Yup from 'yup';

export const facultySchema = Yup.object().shape({
    faculty_name: Yup.string().required('Faculty name is required'),
});