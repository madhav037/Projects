export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin: {
        Row: {
          created_at: string
          email: string
          id: number
          password: string
          uni_id: number
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          password: string
          uni_id: number
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          password?: string
          uni_id?: number
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_uni_id_fkey"
            columns: ["uni_id"]
            isOneToOne: false
            referencedRelation: "university"
            referencedColumns: ["id"]
          },
        ]
      }
      branch: {
        Row: {
          branch_name: string
          created_at: string
          dept_id: number | null
          id: number
        }
        Insert: {
          branch_name: string
          created_at?: string
          dept_id?: number | null
          id?: number
        }
        Update: {
          branch_name?: string
          created_at?: string
          dept_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "branch_dept_id_fkey"
            columns: ["dept_id"]
            isOneToOne: false
            referencedRelation: "department"
            referencedColumns: ["id"]
          },
        ]
      }
      class: {
        Row: {
          branch_id: number | null
          class_no: number
          created_at: string
          id: number
          students_per_batch: number | null
          total_batches: number | null
        }
        Insert: {
          branch_id?: number | null
          class_no: number
          created_at?: string
          id?: number
          students_per_batch?: number | null
          total_batches?: number | null
        }
        Update: {
          branch_id?: number | null
          class_no?: number
          created_at?: string
          id?: number
          students_per_batch?: number | null
          total_batches?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "class_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
        ]
      }
      department: {
        Row: {
          created_at: string
          department_name: string
          id: number
          uni_id: number | null
        }
        Insert: {
          created_at?: string
          department_name: string
          id?: number
          uni_id?: number | null
        }
        Update: {
          created_at?: string
          department_name?: string
          id?: number
          uni_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "department_uni_id_fkey"
            columns: ["uni_id"]
            isOneToOne: false
            referencedRelation: "university"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty: {
        Row: {
          created_at: string
          faculty_name: string
          id: number
          uni_id: number | null
        }
        Insert: {
          created_at?: string
          faculty_name: string
          id?: number
          uni_id?: number | null
        }
        Update: {
          created_at?: string
          faculty_name?: string
          id?: number
          uni_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_uni_id_fkey"
            columns: ["uni_id"]
            isOneToOne: false
            referencedRelation: "university"
            referencedColumns: ["id"]
          },
        ]
      }
      resource: {
        Row: {
          capacity: number
          created_at: string
          duration: number
          id: number
          resource_name: string
          resource_type: string
          uni_id: number | null
        }
        Insert: {
          capacity: number
          created_at?: string
          duration: number
          id?: number
          resource_name: string
          resource_type: string
          uni_id?: number | null
        }
        Update: {
          capacity?: number
          created_at?: string
          duration?: number
          id?: number
          resource_name?: string
          resource_type?: string
          uni_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_uni_id_fkey"
            columns: ["uni_id"]
            isOneToOne: false
            referencedRelation: "university"
            referencedColumns: ["id"]
          },
        ]
      }
      semester: {
        Row: {
          class_id: number
          created_at: string
          faculty_id: number[]
          id: number
          sem_no: number
          subject_id: number[]
        }
        Insert: {
          class_id: number
          created_at?: string
          faculty_id: number[]
          id?: number
          sem_no: number
          subject_id: number[]
        }
        Update: {
          class_id?: number
          created_at?: string
          faculty_id?: number[]
          id?: number
          sem_no?: number
          subject_id?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "semester_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class"
            referencedColumns: ["id"]
          },
        ]
      }
      session: {
        Row: {
          created_at: string
          dept_id: number | null
          do_nothing: boolean | null
          duration: number | null
          id: number
          session_sequence: number
        }
        Insert: {
          created_at?: string
          dept_id?: number | null
          do_nothing?: boolean | null
          duration?: number | null
          id?: number
          session_sequence: number
        }
        Update: {
          created_at?: string
          dept_id?: number | null
          do_nothing?: boolean | null
          duration?: number | null
          id?: number
          session_sequence?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_dept_id_fkey"
            columns: ["dept_id"]
            isOneToOne: false
            referencedRelation: "department"
            referencedColumns: ["id"]
          },
        ]
      }
      subject: {
        Row: {
          created_at: string
          id: number
          subject_name: string | null
          uni_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          subject_name?: string | null
          uni_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          subject_name?: string | null
          uni_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subject_uni_id_fkey"
            columns: ["uni_id"]
            isOneToOne: false
            referencedRelation: "university"
            referencedColumns: ["id"]
          },
        ]
      }
      university: {
        Row: {
          created_at: string
          id: number
          university_name: string
        }
        Insert: {
          created_at?: string
          id?: number
          university_name: string
        }
        Update: {
          created_at?: string
          id?: number
          university_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
