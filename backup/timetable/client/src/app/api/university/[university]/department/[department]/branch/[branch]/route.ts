import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { DELETE as del } from './class/[class]/route';
import { validationMiddleware } from '@/middleware/validationsMiddleware';
import { branchSchema_2 } from '@/lib/validations/branchValidations';

export const PUT = async (req: any, res: any) => {

    const validate = await validationMiddleware(req, branchSchema_2)
    if (validate.status == 400) return validate;

    const branch = await validate.json()
    const  id  = req.url.split('branch/')[1]
    const { branch_name,dept_id } = branch.body

    try {
        const { data, error } = await supabase
            .from('branch')
            .update({ branch_name,dept_id })
            .eq('id', id)
            .select()

        if (error) {
            throw error
        }

        return NextResponse.json({ status: 201, data: data, function_name: 'update_branch' })

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ status: 500, error_message: error.message, function_name: 'update_branch' })
    }
}

export const DELETE = async (req: any, res: any) => {

    const id = req.url.split('branch/')[1]
    try {

        const { data: classData, error: classError } = await supabase
            .from('class')
            .select('id')
            .eq('branch_id', id);

        if (classError) {
            throw classError;
        }

        for (const classItem of classData) {
            await del({ url: `/class/${classItem.id}` }, 0);
        }

        const { data, error } = await supabase
            .from('branch')
            .delete()
            .eq('id', id)

        if (error) {
            throw error
        }

        return NextResponse.json({ status: 201, data: data, function_name: 'delete_branch' })

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ status: 500, error_message: error.message, function_name: 'delete_branch' })
    }
}

export const GET = async (req: any, res: any) => {
    const id = req.url!.split("branch/")[1]

    try {
        const { data, error } = await supabase
            .from('branch')
            .select()
            .eq('id', id)

        if (error) {
            throw error
        }

        return NextResponse.json({ status: 200, data: data, function_name: 'get_branches' })

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ status: 500, error_message: error.message, function_name: 'get_branches' })
    }
}