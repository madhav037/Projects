import * as Yup from 'yup';

export const semesterSchema = Yup.object().shape({
    sem_no: Yup.number().required('Semester number is required'),
    subject_faculty: Yup.object().shape({
        subject_id: Yup.number().required('Subject id is required'),
        subject_name: Yup.string().required('Subject name is required'),
        faculty_id: Yup.number().required('Faculty id is required'),
        faculty_name: Yup.string().required('Faculty name is required'),
    }),
});

//! idk if it supports array or not mostly it won't