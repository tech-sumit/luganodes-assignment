'use client'
import MaterialTable, {Column} from "@material-table/core";
import React, {useEffect, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import TerminalIcon from '@mui/icons-material/Terminal';
import {useRouter} from 'next/navigation'
import {deleteProject, setProjects} from "@/app/dashboard/network";
import {Alert, AlertColor, Snackbar} from "@mui/material";

interface ProjectItem {
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

interface NotificationData {
    visibility: boolean;
    message: string;
    type: AlertColor
}

export default function ProjectsPage() {
    const router = useRouter()

    const [columns, setColumns] = useState<Column<ProjectItem>[]>([
        {title: 'ID', field: 'id', type: 'string', editable: 'never'},
        {title: 'Project name', field: 'project_name', type: 'string'},
        {title: 'Repo URL', field: 'repo_url', type: 'string'},
        {title: 'Container Port', field: 'container_port', type: 'numeric'},
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
    const [notification, setNotification] = useState<NotificationData>({
        visibility: false,
        message: "Updating project",
        type: "info"
    });

    useEffect(() => {
        setProjects(setData)
        console.log(data)
        setNotification({
            visibility: true,
            message: "List updated",
            type: "info"
        })
    }, []);

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
                        tooltip: 'Refresh Projects',
                        isFreeAction: true,
                        onClick: () => {
                            setProjects(setData)
                        },
                    },
                    rowData => ({
                        icon: TerminalIcon,
                        tooltip: 'Stream logs',
                        hidden: !(rowData.deleted_at == null || rowData.deleted_at == ''),
                        isFreeAction: false,
                        onClick: (event, data) => {
                            console.log(data)
                            router.push('/dashboard/projects/logs?project_name=' + data.project_name)
                        }
                    }),
                    rowData => ({
                        icon: EditIcon,
                        tooltip: 'Update Project',
                        hidden: !(rowData.deleted_at == null || rowData.deleted_at == ''),
                        isFreeAction: false,
                        onClick: (event, data) => {
                            console.log(data)
                            router.push('/dashboard/projects/update?project_name=' + data.project_name)

                        }
                    }),
                    rowData => ({
                            icon: rowData.deleted_at == null || rowData.deleted_at == '' ? AutoDeleteIcon : NotInterestedIcon,
                            tooltip: rowData.deleted_at == null || rowData.deleted_at == '' ? 'Start delete' : 'Deleted already',
                            isFreeAction: false,
                            disabled: !(rowData.deleted_at == null || rowData.deleted_at == ''),
                            onClick: (event, data) => {
                                console.log(data)
                                deleteProject(data.project_name, setData)
                            },
                        }
                    ),
                ]}
            />
            <Snackbar
                autoHideDuration={3000}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                open={notification.visibility}
                onClose={() => setNotification({...notification, visibility: false})}>
                <Alert severity={notification.type} sx={{width: '100%'}}>
                    {notification.message}
                </Alert>
            </Snackbar>

        </div>
    );
}
