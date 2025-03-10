import { supabase } from '@/lib/dbConnect';
import { branchSchema } from '@/lib/validations/branchValidations';
import { validationMiddleware } from '@/middleware/validationsMiddleware';
import { NextResponse } from 'next/server';

export const POST = async(req:any, res:any) => {

    const validate = await validationMiddleware(req, branchSchema)
    if (validate.status == 400) return validate

    const branch = await validate.json()
    const id = req.url!.split("department/")[1].split("/")[0]
    const { branch_name } = branch.body

    try {
        const { data, error } = await supabase
            .from('branch')
            .insert([{ branch_name, dept_id : id }])
            .select()
            
        if (error) {
            throw error
        }
        
        return NextResponse.json({status: 201, data: data, function_name: 'create_branch'})
        
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({ status : 500, error_message: error.message, function_name: 'create_branch' })
    }
}

export const GET = async(req:any, res:any) => {
    const id = req.url!.split("department/")[1].split("/")[0]
    console.log(id)

    try {
        const { data, error } = await supabase
            .from('branch')
            .select()
            .eq('dept_id', id)
        
        if (error) {
            throw error
        }
        
        return NextResponse.json({status: 201, data: data, function_name: 'get_branches'})
        
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({ status : 500, error_message: error.message, function_name: 'get_branches' })
    }
}


