'use client'
import React, {useEffect, useState} from 'react';
import {useSearchParams} from "next/navigation";

const LogsPage = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const searchParams = useSearchParams()
    let projectName = `${searchParams.get('project_name')}`

    const connectWebSocket = () => {
        // Close existing WebSocket connection if open
        if (ws) {
            ws.close();
        }

        const newWebSocket = new WebSocket(
            `${process.env.LOGS_WEBSOCKET_HOST}/loki/api/v1/tail?query={container_name="${projectName}"}`);

        newWebSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setLogs((prevLogs) => [...prevLogs, ...data.streams.flatMap((stream: any) => stream.values.map((value: [string, string]) => value[1]))]);
        };

        newWebSocket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        setWs(newWebSocket);
    };

    useEffect(() => {
        connectWebSocket();
        return () => ws?.close();
    }, []);

    const handleReconnect = () => {
        connectWebSocket();
    };

    return (
        <div>
            <h1>Real-Time Logs</h1>
            <button onClick={handleReconnect}>Reconnect</button>
            <textarea
                readOnly
                value={logs.join('\n')}
                style={{width: '100%', height: '400px'}}
            />
        </div>
    );
};

export default LogsPage;
