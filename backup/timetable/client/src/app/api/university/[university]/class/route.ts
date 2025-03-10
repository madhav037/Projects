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

        const classes = []
                
        for (const branch of branches) {
            for (const br of branch.branch_data) {
                const { data:class_data, error:class_error } = await supabase
                    .from('class')
                    .select()
                    .eq('branch_id', br.id);

                if (class_error) {
                    throw class_error;
                }

                class_data.map((cl:any) => {
                    cl.branch_name = br.branch_name
                    cl.dept_name = br.dept_name
                    cl.dept_id = br.dept_id
                })
                
                classes.push({class_data});
            }
        }
        const final_classes:any = []
        
        classes.map((c) => {
            c.class_data.map((cl) => {
                final_classes.push(cl)
            }
        )})
        
        return NextResponse.json({ status: 201, data: final_classes, function_name: 'get_all_classes' });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ status: 500, error_message: error.message, function_name: 'get_all_classes' });
        
    }
}   