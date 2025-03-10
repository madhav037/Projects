import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export const GET = async (req: any, res: any) => {
    const id = req.url!.split("university/")[1].split('/')[0]

    try {
        const { data:department_data, error:department_error } = await supabase
            .from('department')
            .select()
            .eq('uni_id', id);

        if (department_error) {
            throw department_error;
        }
        
        const branches:any = []

        for (const department of department_data) {
            const { data:branch_data, error:branch_error } = await supabase
                .from('branch')
                .select()
                .eq('dept_id', department.id);

            if (branch_error) {
                throw branch_error;
            }

            branch_data.map((branch:any) => {
                branch.dept_name = department.department_name
            })
            
            branches.push({branch_data});
        }

        const final_branches:any =[]

        branches.map((branch:any) => {
            branch.branch_data.map((br:any) => {
                final_branches.push(br)
            })
        })

        return NextResponse.json({ status: 201, data: final_branches, function_name: 'get_department' });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ status: 500, error_message: error.message, function_name: 'get_department' });
        
    }
}   