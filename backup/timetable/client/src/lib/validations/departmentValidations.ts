import * as Yup from 'yup';

export const departmentSchema = Yup.object().shape({
    department_name: Yup.string().required('Department name is required'),
});