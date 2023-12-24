'use client'
import MaterialTable from "@material-table/core";
import {useState} from "react";

export default function ProjectsPage() {
    const [columns, setColumns] = useState([
        {title: 'ID', field: 'id'},
        {title: 'Project name', field: 'project_name'},
        {title: 'Repo URL', field: 'repo_url'},
        {
            title: 'Deployment state',
            field: 'deployment_state',
            lookup: {
                'PROJECT_CREATED': 'Project created',
                'REPO_CLONED': 'Repository cloned',
                'INFRA_READY': 'Infra setup done',
                'INFRA_ERROR': 'Infra setup failed',
                'CODE_BUILT': 'Code Built & Image pushed',
                'CODE_BUILD_ERROR': 'Code build failed',
                'DEPOLY_DONE': 'Deployment complete',
                'DEPOLY_FAILED': 'Deployment failed'
            },
        },
        {title: 'Public Url', field: 'public_url', readonly: true},
    ]);

    const [data, setData] = useState([]);

    return (
        <div>
            <MaterialTable
                columns={columns}
                data={data}
                editable={{
                    onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                setData([...data, newData]);

                                resolve(true);
                            }, 1000)
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve(true);
                            }, 1000)
                        }),
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve(true)
                            }, 1000)
                        }),
                }}
            />

        </div>
    );
}
