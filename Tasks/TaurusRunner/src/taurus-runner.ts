import tasks = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import path = require('path');
import fs = require('fs');
import os = require('os');
var zipper = require('zip-local');
import uuidV4 = require('uuid/v4');


export async function buildTaurusArgs(taurusConfig: string, taurusArguments: string): Promise<string> {
    if (!taurusConfig) {
        if (!taurusArguments) {
            throw new Error(tasks.loc("MustProvideConfigOrArgs"));
        }
        return taurusArguments;
    }
    let tempDir = createTempDir();
    let yaml = path.join(tempDir, "task.yml");
    fs.writeFileSync(yaml, taurusConfig);
    if (taurusArguments) {
        return `${taurusArguments} ${yaml}`;
    }
    return yaml;
}

export async function runTaurusTool(taurusArgs: string, jmeterHome: string, jmeterVersion: string, outputDir: string) {

    if (!/^(\d[\w.]*)$/.test(jmeterVersion)) {
        throw new Error(tasks.loc("InputVersionNotValidVersion", jmeterVersion));
    }

    let taurusTool: tr.ToolRunner = tasks.tool("bzt");
    taurusTool.arg(["-o", `settings.artifacts-dir=${outputDir}`]);
    taurusTool.arg(["-o", `modules.jmeter.path=${jmeterHome}`]);
    taurusTool.arg(["-o", `modules.jmeter.version=${jmeterVersion}`]);
    taurusTool.line(taurusArgs);
    let res = await taurusTool.exec({ ignoreReturnCode: true } as tr.IExecOptions);
    if (res != 0) {
        throw new Error(tasks.loc("TaurusRunFailed"));
    }
}

export async function generateJMeterReport(jmeterPath: string, outputDir: string): Promise<string> {

    let reportDir = `${outputDir}/report`;
    tasks.mkdirP(reportDir);

    let jmeterTool: tr.ToolRunner = tasks.tool(jmeterPath);
    jmeterTool.arg(["-Jjmeter.save.saveservice.assertion_results_failure_message=false"]);
    jmeterTool.arg(["-g", `${outputDir}/kpi.jtl`]);
    jmeterTool.arg(["-o", reportDir]);
    jmeterTool.arg(["-q", `${outputDir}/jmeter-bzt.properties`]);

    let jmeterRes = await jmeterTool.exec({ ignoreReturnCode: true } as tr.IExecOptions);
    if (jmeterRes != 0) {
        /// Run may fail with messages such as "An error occurred: Error while processing samples: Consumer failed with message :latencyVsRequest2283853899685891636-0 does not exist or is not readable"
        tasks.warning(tasks.loc("JMeterReportGenerationRunFailed"));
    }
    return reportDir;
}

export async function uploadJMeterReport(reportDir: string) {
    let tempDir = createTempDir();
    const zipFile = path.join(tempDir, `JMeter-Report.zip`);
    zipper.sync.zip(reportDir).compress().save(zipFile);
    tasks.uploadFile(zipFile);
}

function createTempDir(): string {
    const tempDirectory = tasks.getVariable('Agent.TempDirectory') || os.tmpdir();
    tasks.checkPath(tempDirectory, `${tempDirectory} (Agent.TempDirectory)`);
    const tmpdir = path.join(tempDirectory, uuidV4());
    fs.mkdirSync(tmpdir);
    return tmpdir;
}