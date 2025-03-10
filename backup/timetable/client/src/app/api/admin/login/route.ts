import { supabase } from "@/lib/dbConnect";
import { compare } from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dotenv from "dotenv";
import { validationMiddleware } from "@/middleware/validationsMiddleware";
import { loginSchema } from "@/lib/validations/adminValidations";
dotenv.config();

export const POST = async (req: Request, res: Response) => {

  const validate: any = await validationMiddleware(req, loginSchema);
  if (validate.status == 400) return validate;

  const body = await validate.json();
  const { email, password } = body.body;
  console.log("Email", email);
  console.log("Password", password)

  try {
    const { data: emailData, error: emailError } = await supabase
      .from("admin")
      .select()
      .eq("email", email)
      .single();

    if (emailError) throw emailError;

    if (!emailData) {
      return NextResponse.json({
        status: 400,
        message: "Email does not exist",
        function_name: "login-emailData",
      });
    }

    const { password: hashedPasswordDB } = emailData;
    const isPasswordMatch = await compare(password, hashedPasswordDB);

    if (!isPasswordMatch) {
      return NextResponse.json({
        status: 400,
        message: "Password does not match",
        function_name: "login-isPasswordMatch",
      });
    }

    const { data: uniData, error: uniError } = await supabase
      .from('university')
      .select()
      .eq("id", emailData.uni_id)
      .single();

    if (uniError)
      throw uniError;

    const token = jwt.sign(
      { _id: emailData.id, email: emailData.email, username: emailData.username, uni_id: emailData.uni_id, uni_name: uniData!.university_name },
      process.env.SECRET_KEY as string,
      {
        expiresIn: "48h",
      }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
    });

    return NextResponse.json({
      status: 200,
      message: {
        message: "User logged in successfully",
        token,
      },
      function_name: "login-success",
    });

  } catch (err: any) {
    return NextResponse.json({
      status: 500,
      message: err.message,
      function_name: "login-catch",
    });
  }
};

