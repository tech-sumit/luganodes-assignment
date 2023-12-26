import Joi from 'joi';

// Schema for GET project request validation
export const GetProjectSchema = Joi.object({
    // Project name, required, min length 3, max length 100
    project_name: Joi.string().trim().min(3).max(100).required(),
    // Description, optional, max length 500
    description: Joi.string().trim().max(500).allow(null, ''),
    // Repository URL, required, pattern validation
    repo_url: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$')).required(),
    // Host port, optional, integer between 1024 and 65535
    host_port: Joi.number().integer().min(1024).max(65535).allow(null),
    // Container port, required, integer between 1 and 65535
    container_port: Joi.number().integer().min(1).max(65535).required(),
    // Entrypoint, optional, max length 500
    entrypoint: Joi.string().trim().max(500).pattern(new RegExp('/^\\[\\s*("([^"\\\\]|\\\\.)*")(,\\s*("([^"\\\\]|\\\\.)*"))*\\s*\\]$/')).allow(''),
    // Environment variables, optional, array of objects with key-value pairs
    envs: Joi.array().items(
        Joi.object({
            key: Joi.string().required(),
            value: Joi.string().allow('')
        })
    ).allow(),
    // Deployment state, optional, predefined set of valid strings
    deployment_state: Joi.string().valid(
        'PROJECT_CREATED',
        'DEPLOY_PENDING',
        'DESTROY_PENDING',
        'DEPLOYING',
        'DEPLOYED',
        'DEPLOY_FAILED',
        'DESTROYING',
        'DESTROYED',
        'DESTROY_FAILED',
        'UNKNOWN'
    ).default('PROJECT_CREATED'),
    // Deployment error message, optional, max length 500
    deployment_error: Joi.string().trim().max(500).allow(null, ''),
    // Public host URI, optional
    public_host: Joi.string().uri().allow(null, '')
}).unknown(false);

// Schema for creating a project
export const CreateProjectSchema = Joi.object({
    // Project name: required, min length 3, max length 100
    project_name: Joi.string().trim().min(3).max(100).required(),
    // Description: optional, max length 500
    description: Joi.string().trim().max(500).allow(null, ''),
    // Repository URL: required, must match specific pattern
    repo_url: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$')).required(),
    // Container port: required, integer between 1 and 65535
    container_port: Joi.number().integer().min(1).max(65535).required(),
    // Entrypoint: optional, max length 500, must match specific pattern
    entrypoint: Joi.string().trim().max(500).pattern(new RegExp('^\\[\\s*("([^"\\\\]|\\\\.)*")(,\\s*("([^"\\\\]|\\\\.)*"))*\\s*\\]$')).allow(''),
    // Environment variables: optional, array of key-value pairs
    envs: Joi.array().items(
        Joi.object({
            key: Joi.string().required(),
            value: Joi.string().allow('')
        })
    ).allow(),
}).unknown(false);

// Schema for updating a project
export const UpdateProjectSchema = Joi.object({
    // Project name: required, min length 3, max length 100
    project_name: Joi.string().trim().min(3).max(100).required(),
    // Description: optional, max length 500
    description: Joi.string().trim().max(500).allow(null, ''),
    // Repository URL: required, must match specific pattern
    repo_url: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$')).required(),
    // Container port: required, integer between 1 and 65535
    container_port: Joi.number().integer().min(1).max(65535).required(),
    // Entrypoint: optional, max length 500, must match specific pattern
    entrypoint: Joi.string().trim().max(500).pattern(new RegExp('/^\\[\\s*("([^"\\\\]|\\\\.)*")(,\\s*("([^"\\\\]|\\\\.)*"))*\\s*\\]$/')).allow(''),
    // Environment variables: optional, array of key-value pairs
    envs: Joi.array().items(
        Joi.object({
            key: Joi.string().required(),
            value: Joi.string().allow('')
        })
    ).allow(),
}).unknown(false);

// Schema for deleting a project
export const DeleteProjectSchema = Joi.object({
    // Project name: required, min length 3, max length 100
    project_name: Joi.string().trim().min(3).max(100).required(),
}).unknown(false);
