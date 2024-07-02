import tasks = require('azure-pipelines-task-lib/task');
import tools = require('azure-pipelines-tool-lib/tool');
import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';
import path = require('path');
import * as installer from './jmeter-installer';

async function configureJMeter() {
    let inputVersion = tasks.getInput("jmeterVersion", true) ?? '';
    let plugins = tasks.getInput("plugins");
    let jmeterPath = await installer.downloadJMeter(inputVersion, plugins?.trim());
    let envPath = process.env['PATH'];

    // Prepend the tools path. Instructs the agent to prepend for future tasks
    if (envPath && !envPath.startsWith(path.dirname(jmeterPath))) {
        tools.prependPath(path.dirname(jmeterPath));
    }
}

async function verifyJMeter() {
    console.log(tasks.loc("VerifyJMeterInstallation"));
    let jmeterPath = tasks.which("jmeter", true);
    let jmeterTool : ToolRunner = tasks.tool(jmeterPath);
    jmeterTool.arg("--version");
    return jmeterTool.exec();
}

async function run() {
    tasks.setResourcePath(path.join(__dirname, '..', 'task.json'));

    try {
        await configureJMeter();
        await verifyJMeter();
        tasks.setResult(tasks.TaskResult.Succeeded, "");
    } catch (error) {
        let errorMessage: string;
        if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = String(error);
        }
        tasks.setResult(tasks.TaskResult.Failed, 'Error: ' + errorMessage);
    }
}

run();
