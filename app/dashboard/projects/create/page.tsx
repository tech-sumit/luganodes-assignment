'use client'
import {Button, Form, Input, Rule, Textarea, TYPE} from "shineout";
import {useCallback, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

interface Project {
    project_name: string
    description?: string
    repo_url: string
    container_port: number
    entrypoint: string
    envs: object
}

type FormProps = TYPE.Form.Props<Project>
type FormValue = FormProps['value']
type FormRef = TYPE.Form.Ref<any>
type RuleParams = TYPE.Rule.Params
type RuleFunc = TYPE.Rule.validFunc

interface EnvVariable {
    key?: string
    value?: string
}

interface ValueMap {
    [x: string]: string | boolean
}

const duplicateCheck: RuleFunc = (values: any, _: any, callback: any) => {
    const result: any[] = []
    const valueMap: ValueMap = {}
    values.forEach(({key}: EnvVariable, i: number) => {
        if (!key) return
        if (valueMap[key]) result[i] = {name: new Error(`Cannot have duplicate envs: "${key}" exists.`)}
        else valueMap[key] = true
    })
    callback(result.length > 0 ? result : true)
}

const rules = Rule({duplicateCheck})

export default function CreateProjectPage() {
    const [value, setValue] = useState<FormValue>(undefined)

    const renderEmpty = (onAppend: any) => (
        <Button key="empty" onClick={() => onAppend({key: ''})}>Add Environment variable</Button>);

    return (
        <div>
            <Form
                value={value}
                scrollToError={30}
                onChange={setValue}
                style={{maxWidth: 500}}
                onSubmit={callCreateProjectAPI}
            >
                <Form.Item required label="Project name">
                    <Input
                        name="project_name"
                        title="Project name"
                        rules={[rules.required, rules.range(3, 100)]}/>
                </Form.Item>

                <Form.Item label="Description">
                    <Textarea name="description" autosize/>
                </Form.Item>

                <Form.Item required label="Github repository path">
                    <Input
                        name="repo_url"
                        placeholder="facebook/react"
                        rules={[rules.required, rules.range(3, 100)]}/>
                </Form.Item>

                <Form.Item required label="Container port">
                    <Input.Number
                        name="container_port"
                        placeholder="1024-65535"
                        max={65535} min={1024}
                        rules={[rules.required]}/>
                </Form.Item>

                <Form.Item required label="Entrypoint">
                    <Input
                        name="entrypoint"
                        placeholder='["node","index.js"] (Optional)'
                        max={65535} min={1024}
                        rules={[rules.required]}/>
                </Form.Item>

                <Form.Item label="Friends">
                    <Form.FieldSet
                        name="friends"
                        empty={renderEmpty}
                        rules={[rules.duplicateCheck]}
                        defaultValue={[]}
                    >
                        {({onAppend, onRemove}) => (
                            <Form.Item style={{display: 'flex', alignItems: 'center', marginBottom: 12}}>
                                <Input
                                    name="key"
                                    placeholder="Key"
                                    title="Key"
                                    rules={[rules.required]}
                                    style={{width: 180, marginInlineEnd: 8}}
                                />
                                <Input
                                    name="value"
                                    placeholder="Age"
                                    title="Value"
                                    rules={[rules.required]}
                                    style={{width: 180, marginInlineEnd: 8}}
                                />
                                <a style={{margin: '0 12px'}} onClick={() => onAppend({key: "", value: ""})}>
                                    <AddIcon/>
                                </a>
                                <a onClick={onRemove}>
                                    <CloseIcon/>
                                </a>
                            </Form.Item>
                        )}
                    </Form.FieldSet>
                </Form.Item>

                <Form.Item label="">
                    <Form.Submit>Submit</Form.Submit>
                    <Form.Reset>Reset</Form.Reset>
                </Form.Item>
            </Form>
        </div>
    )
}

function callCreateProjectAPI(project:Project) {

}
