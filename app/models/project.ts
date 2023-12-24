import Joi from 'joi';

export const GetProjectSchema = Joi.object({
    project_name: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().max(500).allow(null, ''),
    repo_url: Joi.string().uri().required(),
    host_port: Joi.number().integer().min(1024).max(65535).allow(null),
    container_port: Joi.number().integer().min(1).max(65535).required(),
    entrypoint: Joi.string().trim().max(500).allow(''),
    envs: Joi.object().pattern(Joi.string(), Joi.string()).allow(null),
    deployment_state: Joi.string().valid(
        'PROJECT_CREATED',
        'DEPLOY_TRIGGERED',
        'DEPLOY_ERROR',
        'DEPLOY_SUCCESS',
        'DESTROY_TRIGGERED',
        'DESTROY_ERROR',
        'DESTROY_SUCCESS'
    ).default('PROJECT_CREATED'),
    deployment_error: Joi.string().trim().max(500).allow(null, ''),
    public_host: Joi.string().uri().allow(null, '')
}).unknown(false);

export const CreateProjectSchema = Joi.object({
    project_name: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().max(500).allow(null, ''),
    repo_url: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$')).required(),
    container_port: Joi.number().integer().min(1).max(65535).required(),
    entrypoint: Joi.string().trim().max(500).pattern(new RegExp('^\\[\\s*("([^"\\\\]|\\\\.)*"|\'([^\'\\\\]|\\\\.)*\')(,\\s*("([^"\\\\]|\\\\.)*"|\'([^\'\\\\]|\\\\.)*\'))*\\s*\\]$')).allow(''),
    envs: Joi.array().items(
        Joi.object({
            key: Joi.string().required(),
            value: Joi.string().allow('')
        })
    ).allow(),
}).unknown(false);


export const UpdateProjectSchema = Joi.object({
    description: Joi.string().trim().max(500).allow(null, ''),
    container_port: Joi.number().integer().min(1).max(65535).required(),
    entrypoint: Joi.string().trim().max(500).allow(''),
    envs: Joi.object().pattern(Joi.string(), Joi.string()).allow(null),
}).unknown(false);

export const DeleteProjectSchema = Joi.object({
    project_name: Joi.string().trim().min(3).max(100).required(),
}).unknown(false);
