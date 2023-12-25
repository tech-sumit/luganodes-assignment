import React from "react";
import {DefaultValues, KeepStateOptions} from "react-hook-form";
import {Project} from "next/dist/build/swc";

interface GetProjectItem {
    id: string;
    project_name: string;
    repo_url: string;
    container_port: number;
    entrypoint: string;
    deployment_state: string;
    public_host: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export const setProjects = (setData: React.Dispatch<React.SetStateAction<GetProjectItem[]>>) => {
    fetch('/api/projects', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            setData(data.data)
        })
        .catch(error => console.error('Error fetching projects:', error));
    return true
}

export const deleteProject = async (project_name:string,setData: React.Dispatch<React.SetStateAction<GetProjectItem[]>>) => {
    await fetch('/api/projects', {
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({project_name:project_name}),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setProjects(setData)
        })
        .catch(error => console.error('Error fetching projects:', error));
}

interface UpdateProjectItem {
    project_name: string;
    description?: string;
    repo_url: string;
    container_port: number;
    entrypoint: string;
    envs: { key: string; value: string }[];
}

export const setProjectByName = async (projectName: string, reset: (values?: (DefaultValues<Project> | ResetAction<Project> | Project), keepStateOptions?: KeepStateOptions) => void) => {
    await fetch('/api/projects?project_name='+projectName, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            const { project_name, description, repo_url, container_port, entrypoint, envs } = data.data;
            reset({ project_name, description, repo_url, container_port, entrypoint, envs })
            console.log('Default project loaded: ',data.data)
        })
        .catch(error => console.error('Error fetching projects:', error));
}
