export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SupabaseResponse = {
  status: boolean;
  data?: string;
  error?: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: string;
          role_power: number;
        };
        Insert: {
          id: string;
          name: string;
          role: string;
          role_power: number;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          role_power?: number;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      tasks: {
        Row: {
          assignee_id: string;
          assigner_id: string;
          current_status: string;
          id: string;
          status_details: string;
          task_description: string;
          task_due: string;
          task_title: string;
        };
        Insert: {
          assignee_id: string;
          assigner_id: string;
          current_status: string;
          id?: string;
          status_details: string;
          task_description: string;
          task_due: string;
          task_title: string;
        };
        Update: {
          assignee_id?: string;
          assigner_id?: string;
          current_status?: string;
          id?: string;
          status_details?: string;
          task_description?: string;
          task_due?: string;
          task_title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey";
            columns: ["assignee_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_assigner_id_fkey";
            columns: ["assigner_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
