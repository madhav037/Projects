import { supabase } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { validationMiddleware } from "@/middleware/validationsMiddleware";
import { registerSchema } from "@/lib/validations/adminValidations";

export const POST = async (req: Request, res: Response) => {

  const validate = await validationMiddleware(req, registerSchema);
  if (validate.status==400) return validate; 

  const body = await validate.json();
  const { username, email, password, university } = body.body;
  const hashedPassword = await hash(password, 10);

  console.log(username, email, password, university);

  try {
    const { data: emailData, error: emailError } = await supabase
      .from("admin")
      .select("id")
      .eq("email", email)
    //   .single();

    console.log(emailData);
    console.log("email error : ", emailError);

    if (emailError)
        throw emailError;

    if (emailData!.length > 0) {
      return NextResponse.json({
        status: 400,
        message: "Email already exists",
        function_name: "signup-emailData",
      });
    }

    console.log(1);

    const { data: uniData, error: uniError } = await supabase
      .from("university")
      .select("id")
      .eq("university_name", university)
    //   .single();

    console.log(2);
    console.log(uniData);

    if (uniError) throw uniError;

    if (uniData!.length > 0) {
      return NextResponse.json({
        status: 400,
        message: "University already exists",
        function_name: "signup-uniData",
      });
    }

    const { error: createUniError } = await supabase
      .from("university")
      .insert({ university_name: university });

    if (createUniError) throw createUniError;

    const { data: university_id, error: uni_id_error } = await supabase
      .from("university")
      .select("id")
      .eq("university_name", university)
      .single();

      console.log(uni_id_error)
    if (uni_id_error) throw uni_id_error;

    const uni_id = university_id.id;

    const { error } = await supabase
      .from("admin")
      .insert({ email, password: hashedPassword, uni_id, username });

    if (error) throw error;

    return NextResponse.json({
      status: 200,
      message: "user signed up successfully",
      function_name: "signup-success",
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error.message,
      function_name: "signup-catch",
    });
  }
};
