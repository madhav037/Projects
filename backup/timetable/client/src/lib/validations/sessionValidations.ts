import * as Yup from 'yup';

export const sessionSchema = Yup.object().shape({
    session_sequence: Yup.number().required('Session sequence is required'),
    do_nothing: Yup.bool().required('Do nothing is required'),
    duration: Yup.number().required('Duration is required'),
});