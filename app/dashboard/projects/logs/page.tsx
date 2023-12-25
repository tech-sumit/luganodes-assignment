'use client'

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {useFieldArray, useForm} from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Stack,
    Card,
    CardContent,
    CardHeader,
    Snackbar,
    Alert,
    AlertColor
} from '@mui/material';
import IconButton from "@mui/material/IconButton";
import {useState} from "react";
import {useRouter} from "next/navigation";

interface Project {
    project_name: string;
    description?: string;
    repo_url: string;
    container_port: number;
    entrypoint: string;
    envs: { key: string; value: string }[];
}

interface NotificationData {
    visibility: boolean;
    message: string;
    type: AlertColor
}

export default function LogsPage() {
    const router = useRouter()

    const {control, register, handleSubmit, formState: {errors}} = useForm<Project>();
    const {fields, append, remove} = useFieldArray({control, name: 'envs'});
    const repoUrlPattern = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/; // Example pattern for "username/repository"
    const entrypointPattern = /^\[\s*("([^"\\]|\\.)*"|'([^'\\]|\\.)*')(,\s*("([^"\\]|\\.)*"|'([^'\\]|\\.)*'))*\s*\]$/;

    const [notification, setNotification] = useState<NotificationData>({
        visibility: false,
        message: "Creation in progress",
        type: "info"
    });

    const onSubmit = (project: Project) => {
        fetch('/api/projects',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then(async response => {
                let data=await response.json()
                if (response.status==201){
                    console.log('Project created:', data)
                    setNotification({
                        visibility: true,
                        message: "Project created",
                        type: "success"
                    })
                    router.replace('/dashboard/projects')
                }else{
                    console.error('Error in project creation:', data)
                    setNotification({
                        visibility: true,
                        message: "Project creation failed",
                        type: "error"
                    })
                }
            })
            .catch(error => {
                console.log('API ERROR:', error)
                setNotification({
                    visibility: true,
                    message: error,
                    type: "error"
                })
            });
    };

    return (
        <div>
            <Card variant="outlined" sx={{marginX: 10, marginY: 5}}>
                <CardHeader title="New project"/>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <Stack spacing={2} sx={{width: '100%'}}>
                            <TextField
                                {...register("project_name", {
                                    required: "Project name is required",
                                    minLength: {value: 3, message: "Minimum length is 3"}
                                })}
                                label="Project name"
                                error={!!errors.project_name}
                                size="small"
                                helperText={errors.project_name?.message}
                            />

                            <TextField
                                {...register("description")}
                                label="Description"
                                multiline
                                size="small"
                                rows={4}
                            />

                            <TextField
                                {...register("repo_url", {
                                    required: "Repository is required in 'owner/repository' format",
                                    pattern: {
                                        value: repoUrlPattern,
                                        message: "Invalid repository format"
                                    }
                                })}
                                label="Github repository path"
                                placeholder="facebook/react"
                                error={!!errors.repo_url}
                                size="small"
                                helperText={errors.repo_url?.message}
                            />

                            <TextField
                                {...register("container_port", {
                                    required: "Container port is required, range: 1024-65535",
                                    valueAsNumber: true,
                                    min: {value: 1024, message: "Minimum port is 1024"},
                                    max: {value: 65535, message: "Maximum port is 65535"}
                                })}
                                label="Container port"
                                placeholder="1024-65535"
                                type="number"
                                fullWidth
                                size="small"
                                error={!!errors.container_port}
                                helperText={errors.container_port?.message}
                            />

                            <TextField
                                {...register("entrypoint", {
                                    pattern: {
                                        value: entrypointPattern,
                                        message: "Entrypoint must be a valid JSON array"
                                    }
                                })}
                                label="Entrypoint"
                                size="small"
                                placeholder='["node","index.js"] (Optional)'
                                error={!!errors.entrypoint}
                                helperText={errors.entrypoint?.message}
                            />

                            {fields.map((item, index) => (
                                <Box key={item.id} sx={{width: '100%'}}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{width: '100%'}}>
                                        <TextField
                                            label="Key"
                                            placeholder="Key"
                                            fullWidth
                                            size="small"
                                            {...register(`envs.${index}.key`)}
                                        />
                                        <TextField
                                            label="Value"
                                            placeholder="Value"
                                            fullWidth
                                            size="small"
                                            {...register(`envs.${index}.value`)}
                                        />
                                        <IconButton
                                            color="secondary"
                                            aria-label="Remove"
                                            onClick={() => remove(index)}>
                                            <CloseIcon/>
                                        </IconButton>
                                        <IconButton
                                            color="primary"
                                            aria-label="Add"
                                            onClick={() => append({key: '', value: ''})}>
                                            <AddIcon/>
                                        </IconButton>
                                    </Stack>
                                </Box>
                            ))}
                            <Button variant="outlined"
                                    endIcon={<AddIcon/>}
                                    color="primary"
                                    aria-label="Add"
                                    onClick={() => append({key: '', value: ''})}>
                                Add Environment variable
                            </Button>

                            <Button variant="outlined" type="submit">Submit</Button>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
            <Snackbar
                autoHideDuration={3000}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                open={notification.visibility}
                onClose={() => setNotification({...notification, visibility: false})}>
                <Alert severity={notification.type} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
