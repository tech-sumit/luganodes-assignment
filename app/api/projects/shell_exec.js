const shell = require('shelljs');

function executeRemoteShellCommand(command, sshConfig) {
    const sshCommand = `ssh -o StrictHostKeyChecking=no -i ${sshConfig.identityFile} ${sshConfig.user}@${sshConfig.host} '${command}'`;
    const result = shell.exec(sshCommand);

    if (result.code !== 0) {
        throw new Error(`Error executing remote command: ${command}\n${result.stderr}`);
    }

    return result.stdout;
}

const sshConfig = {
    host: 'ec2-instance-ip', // Replace with your EC2 instance IP
    user: 'ec2-user',        // Replace with your EC2 username, e.g., 'ec2-user'
    identityFile: '/path/to/your/private/key.pem' // Replace with path to your private key
};

try {
    // Execute commands on the remote EC2 instance
    executeRemoteShellCommand('sudo ./nginx_setup.sh', sshConfig);
    executeRemoteShellCommand(`./build_docker_existing.sh "${repoUrl}" "${projectName}" "${userName}" ${randomHostPort} ${containerPort}`, sshConfig);
    executeRemoteShellCommand(`./build_docker_no_dockerfile.sh "${repoUrl}" "${projectName}" "${userName}" ${randomHostPort} ${containerPort} '${entrypointArray}'`, sshConfig);
    executeRemoteShellCommand(`./add_new_site_nginx.sh "${subdomain}" "${domain}" ${randomHostPort}`, sshConfig);

    console.log('All remote commands executed successfully');
} catch (error) {
    console.error('Error occurred:', error.message);
}
