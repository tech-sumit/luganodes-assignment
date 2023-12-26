'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from "next/navigation";
import {Button} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const LogsPage = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const searchParams = useSearchParams();
    const projectName = searchParams.get('project_name');
    const logsEndRef = useRef<HTMLTextAreaElement>(null);

    const connectWebSocket = () => {
        if (ws) {
            ws.close();
        }

        const newWebSocket = new WebSocket(
            `${process.env.LOGS_WEBSOCKET_HOST??"ws://logs.bazzarapp.in/lokiapi"}/loki/api/v1/tail?query={container_name="${projectName}"}`);

        newWebSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setLogs((prevLogs) =>
                [...prevLogs, ...data.streams.flatMap((stream:any) => stream.values.map((value:any) => value[1]))]
            );
        };

        newWebSocket.onclose = () => console.log('WebSocket disconnected');
        setWs(newWebSocket);
    };

    useEffect(() => {
        connectWebSocket();
        return () => ws?.close();
    }, [projectName]);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div>
            <h1>{projectName} - Real-Time Logs</h1>
            <Button variant="outlined"
                    endIcon={<RefreshIcon/>}
                    color="primary"
                    aria-label="Reconnect"
                    onClick={connectWebSocket}>
                Reload logs
            </Button>

            <div style={{
                backgroundColor: 'black',
                color: 'lime',
                fontFamily: 'monospace',
                padding: '10px',
                height: '400px',
                overflowY: 'auto'
            }}>
                {logs.map((log, index) => (
                    <div key={index}>{log}</div>
                ))}
                {/*@ts-ignore*/}
                <div ref={logsEndRef}/>
            </div>
        </div>
    );
};

export default LogsPage;
