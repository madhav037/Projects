import { supabase } from '@/lib/dbConnect';
import { semesterSchema } from '@/lib/validations/semesterValidations';
import { validationMiddleware } from '@/middleware/validationsMiddleware';
import { NextResponse } from 'next/server';

export const PUT = async (req:any, res:any) => {

    const validate = await validationMiddleware(req, semesterSchema)
    if (validate.status == 400) return validate;

    const semester = await validate.json()
    const { sem_no,subject_faculty } = semester.body
    const id = req.url.split('semester/')[1]

    try {
        const { data, error } = await supabase
            .from('semester')
            .update({ sem_no ,subject_faculty })
            .eq('id' , id);
        if (error) {
            throw error;
        }
        return NextResponse.json({status : 201, data : data , function_name: 'update_semester' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status :500, error_message: error.message , function_name: 'update_semester' });
    }
}

export const DELETE = async (req:any, res:any) => {
    const id = req.url.split('semester/')[1]

    try {
        const { data, error } = await supabase
            .from('semester')
            .delete()
            .eq('id' , id)
        if (error) {
            throw error;
        }
        return NextResponse.json({status : 201, data : data , function_name: 'delete_semester' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status :500, error_message: error.message , function_name: 'delete_semester' });
    }
}

export const GET = async (req:any, res:any) => {
    const id = req.url!.split("semester/")[1]

    try {
        const { data, error } = await supabase
            .from('semester').select()
            .eq('id', id)
        if (error) {
            throw error;
        }
        return NextResponse.json({status : 201, data : data , function_name: 'get_semester' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status :500, error_message: error.message , function_name: 'get_semester' });
    }
}