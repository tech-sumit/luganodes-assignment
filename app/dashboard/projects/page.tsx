'use client'
import MaterialTable, {Column} from "@material-table/core";
import React, {useEffect, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation'

interface ProjectItem {
    id: string; // Adjust these types based on your actual data structure
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

function fetchProjects(){
    let projects: ProjectItem[] = [];
    fetch('/api/projects',{
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => projects=data)
        .catch(error => console.error('Error fetching projects:', error));
    return projects
}

export default function ProjectsPage() {
    const router = useRouter()

    const [columns, setColumns] = useState<Column<ProjectItem>[]>([
        {title: 'ID', field: 'id', type: 'string', editable: 'never'},
        {title: 'Project name', field: 'project_name', type: 'string'},
        {title: 'Repo URL', field: 'repo_url', type: 'string'},
        {title: 'Container Port', field: 'container_port', type: 'numeric'}, // Assuming it's a numeric value
        {title: 'Entrypoint', field: 'entrypoint', type: 'string'},
        {
            title: 'Deployment state',
            field: 'deployment_state',
            lookup: {
                'PROJECT_CREATED': 'Project created',
                'DEPLOY_TRIGGERED': 'Deployment triggered',
                'DEPLOY_ERROR': 'Error while deploying application',
                'DEPLOY_SUCCESS': 'Deployment successful',
                'DESTROY_TRIGGERED': 'Destroy triggered',
                'DESTROY_ERROR': 'Error while destroying application',
                'DESTROY_SUCCESS': 'Destroy successful',
            },
            type: 'string'
        },
        {title: 'Public HOST', field: 'public_host', type: 'string', editable: 'never'},
        {title: 'Created At', field: 'created_at', type: 'datetime', editable: 'never'},
        {title: 'Updated At', field: 'updated_at', type: 'datetime', editable: 'never'},
        {title: 'Deleted At', field: 'deleted_at', type: 'datetime', editable: 'never'},
    ]);
    const [data, setData] = useState<ProjectItem[]>([]);

    useEffect(()=>{
        setData(fetchProjects())
    },[]);

    return (
        <div>
            <MaterialTable
                title="Projects List"
                columns={columns}
                data={data}
                options={{
                    actionsColumnIndex: -1,
                }}
                actions={[
                    {
                        icon: AddIcon,
                        tooltip: 'Add Project',
                        isFreeAction: true,
                        onClick: () => router.push('/dashboard/projects/create')
                    },
                    {
                        icon: RefreshIcon,
                        tooltip: 'Refresh Data',
                        isFreeAction: true,
                        onClick: () => {
                            setData(fetchProjects())
                        },
                    }
                ]}
            />

        </div>
    );
}
