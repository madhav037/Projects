import * as Yup from 'yup';

export const classSchema = Yup.object().shape({
    class_no: Yup.number().required('Class number is required'),
    total_batches: Yup.number().required('Total batches is required'),
    students_per_batch: Yup.number().required('Students per batch is required'),
});

export const classSchema_2 = Yup.object().shape({
    class_no: Yup.number().required('Class number is required'),
    total_batches: Yup.number().required('Total batches is required'),
    students_per_batch: Yup.number().required('Students per batch is required'),
    branch_id: Yup.number().required('Branch id is required'),
});