import * as Yup from 'yup';

export const branchSchema = Yup.object().shape({
    branch_name: Yup.string().required('Branch name is required'),
});

export const branchSchema_2 = Yup.object().shape({
    branch_name: Yup.string().required('Branch name is required'),
    dept_id: Yup.number().required('Department id is required'),
});
    