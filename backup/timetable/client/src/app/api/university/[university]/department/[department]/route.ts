import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { DELETE as del } from './branch/[branch]/route';
import { validationMiddleware } from '@/middleware/validationsMiddleware';
import { facultySchema } from '@/lib/validations/facultyValidations';

export const PUT = async(req:any, res:any)=>{

    const validateError = await validationMiddleware(req, facultySchema);
    if (validateError) return validateError;

    const department = await req.json();
    const id = req.url!.split("department/")[1]
    const { department_name } = department

    try {
        const { data, error } = await supabase
            .from('department')
            .update({ department_name })
            .eq('id', id)
            .select();
        console.log("Updated Data:", data);
        
        if (error) {
            throw error;
        }
        return NextResponse.json({status: 201 ,data: data, function_name: 'update_department' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'update_department' });
    }
}

export const DELETE = async(req:any, res:any)=>{
    const id = req.url!.split("department/")[1]

    try {
        const { data: branchData, error: branchError } = await supabase
            .from('branch')
            .select('id')
            .eq('dept_id', id);

        if (branchError) {
            throw branchError;
        }
        
        for (const branchItem of branchData) {
            await del({ url: `/branch/${branchItem.id}` },0);
        }

        const { data:session_data, error:session_error } = await supabase
            .from('session')
            .delete()
            .eq('dept_id', id);
            
        if (session_error) {
            throw session_error;
        }

        const { data, error } = await supabase
            .from('department')
            .delete()
            .eq('id', id);
        if (error) {
            throw error;
        }
        console.log(data);
        
        return NextResponse.json({status: 201 ,data: data, function_name: 'delete_department' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'delete_department' });
    }
}


export const GET = async(req:any, res:any)=>{
    const id = req.url!.split("department/")[1]

    try {
        const { data, error } = await supabase
            .from('department')
            .select()
            .eq('id', id)
        if (error) {
            throw error
        }
        return NextResponse.json({status: 201, data: data, function_name: 'get_department'})
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'get_department'})
    }
}