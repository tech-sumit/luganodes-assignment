export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[];

export interface Database {
    public: {
        Tables: {
            projects: {
                Row: {
                    id: number;
                    user_id: string; // UUID
                    project_name: string;
                    description: string | null;
                    repo_url: string;
                    host_port: number | null;
                    container_port: number;
                    entrypoint: string | null;
                    envs: Json | null;
                    deployment_state: ProjectsDeploymentStateType;
                    deployment_error: string | null;
                    public_host: string | null;
                    created_at: string; // Timestamp
                    updated_at: string; // Timestamp
                    deleted_at: string | null; // Timestamp, nullable
                };
                Insert: {
                    user_id: string;
                    project_name: string;
                    description?: string;
                    repo_url: string;
                    container_port: number;
                    entrypoint?: string;
                    envs?: Json;
                    deployment_state?: ProjectsDeploymentStateType;
                    deployment_error?: string;
                    // Note: public_host and host_port are managed by the database triggers
                };
                Update: {
                    user_id?: string;
                    project_name?: string;
                    description?: string;
                    repo_url?: string;
                    container_port?: number;
                    entrypoint?: string;
                    envs?: Json;
                    deployment_state?: ProjectsDeploymentStateType;
                    deployment_error?: string;
                    public_host?: string; // This can be updated if needed
                    deleted_at?: string;
                };
            };
        };
        Enums: {
            projects_deployment_state_type: ProjectsDeploymentStateType;
        };
        Functions: {
            projects_set_public_host: Function; // Placeholder type for the function
            projects_assign_host_port: Function; // Placeholder type for the function
        };
    };
}

export type ProjectsDeploymentStateType =
    | 'PROJECT_CREATED'
    | 'DEPLOY_TRIGGERED'
    | 'DEPLOY_ERROR'
    | 'DEPLOY_SUCCESS'
    | 'DESTROY_TRIGGERED'
    | 'DESTROY_ERROR'
    | 'DESTROY_SUCCESS';
