import tasks = require('azure-pipelines-task-lib/task');
import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';
import path = require('path');
import * as installer from './taurus-installer';

async function configureTaurus() {
    let pythonCommand = tasks.getInput("pythonCommand", true) ?? '';
    let inputVersion = tasks.getInput("taurusVersion", true) ?? '';
    await installer.installTaurus(pythonCommand, inputVersion);
}

async function verifyTaurus() {
    console.log(tasks.loc("VerifyTaurusInstallation"));
    let taurusPath = tasks.which("bzt", true);
    let taurusTool : ToolRunner = tasks.tool(taurusPath);
    taurusTool.arg("--help");
    return taurusTool.exec();
}

async function run() {
    tasks.setResourcePath(path.join(__dirname, '..', 'task.json'));

    try {
        await configureTaurus();
        await verifyTaurus();
        tasks.setResult(tasks.TaskResult.Succeeded, "");
    } catch (error) {
        tasks.setResult(tasks.TaskResult.Failed, error);
    }
}

run();
