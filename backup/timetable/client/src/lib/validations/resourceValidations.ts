import * as Yup from 'yup';

export const resourceSchema = Yup.object().shape({
    resource_name: Yup.string().required('Name is required'),
    resource_type: Yup.string().required('Type is required'),
    capacity: Yup.number().required('Capacity is required'),
    duration: Yup.number().required('duration is required'),
});