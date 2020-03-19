import tasks = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');


export async function installTaurus(pythonCommand: string, version: string) {
    if (!/^(\d[\w.]*)$/.test(version)) {
        throw new Error(tasks.loc("InputVersionNotValidVersion", version));
    }

    let pythonTool: tr.ToolRunner = tasks.tool(pythonCommand);
    pythonTool.arg("-V");
    await pythonTool.exec();

    // "python3 -mpip" is more portable than "pip3"
    let pipTool: tr.ToolRunner = tasks.tool(pythonCommand);
    pipTool.arg(["-mpip", "install", `bzt==${version}`]);
    let res = await pipTool.exec({ ignoreReturnCode: true } as tr.IExecOptions);
    if (res != 0) {
        throw new Error(tasks.loc("TaurusInstallFailed"));
    }
}
