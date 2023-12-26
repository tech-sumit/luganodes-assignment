CREATE TYPE projects_deployment_state_type AS ENUM (
    'DEPLOY_PENDING',
    'DESTROY_PENDING',
    'DEPLOYING',
    'DEPLOYED',
    'DEPLOY_FAILED',
    'DESTROYING',
    'DESTROYED',
    'DESTROY_FAILED',
    'UNKNOWN'
);


CREATE TABLE projects (
    id bigint generated by default as identity primary key,
    user_id uuid references auth.users not null,
    project_name text not null,
    description text,
    repo_url text not null,
    host_port integer,
    container_port integer not null,
    entrypoint text default '',
    envs json,
    deployment_state projects_deployment_state_type default 'PROJECT_CREATED',
    deployment_error text default '',
    public_host text,
    created_at timestamp default now() not null,
    updated_at timestamp default now() not null,
    deleted_at timestamp default null
);

-- START SET Dynamic public_host
CREATE OR REPLACE FUNCTION projects_set_public_host()
RETURNS TRIGGER AS $$
BEGIN
    NEW.public_host := 'http://' || LOWER(NEW.project_name) || '.bazzarapp.in';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_set_public_host_on_insert
BEFORE INSERT ON projects
FOR EACH ROW
EXECUTE FUNCTION projects_set_public_host();

CREATE TRIGGER projects_set_public_host_on_update
BEFORE UPDATE OF project_name ON projects
FOR EACH ROW
EXECUTE FUNCTION projects_set_public_host();
-- STOP SET Dynamic public_host

-- START SET Dynamic host_port
CREATE SEQUENCE projects_host_port_seq
    START WITH 5000
    INCREMENT BY 1
    MINVALUE 5000
    MAXVALUE 65535
    NO CYCLE;

CREATE OR REPLACE FUNCTION projects_assign_host_port()
RETURNS TRIGGER AS $$
BEGIN
    NEW.host_port := NEXTVAL('projects_host_port_seq');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_set_host_port
BEFORE INSERT ON projects
FOR EACH ROW
EXECUTE FUNCTION projects_assign_host_port();
-- STOP SET Dynamic host_port

-- START Set user level data access control
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Individuals can create projects." ON projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Individuals can update their own projects." ON projects FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Individuals can delete their own projects." ON projects FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Individuals can select their own projects." ON projects FOR SELECT
USING (auth.uid() = user_id);
-- STOP Set user level data access control
