import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

const taurusArguments = "arg1 arg2";
const jmeterHome = "/fake/jmeter/home";
const jmeterPath = "/fake/jmeter/path";
const jmeterVersion = "5.1";
const outputDir = "/fake/output/dir";

let taskPath = path.join(__dirname, '..', 'src', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('taurusArguments', taurusArguments);
tmr.setInput('jmeterHome', jmeterHome);
tmr.setInput('jmeterPath', jmeterPath);
tmr.setInput('jmeterVersion', jmeterVersion);
tmr.setInput('outputDir', outputDir);

// Provide answers for task mock.
const mockAnswers: ma.TaskLibAnswers = {
    which: {
        "bzt": "/fake/bin/bzt",
    },
    checkPath: {
        "/fake/bin/bzt": true,
    },
    exec: {
        'bzt -o settings.artifacts-dir=/fake/output/dir -o modules.jmeter.path=/fake/jmeter/home -o modules.jmeter.version=5.1 arg1 arg2': {
            code: 0
        },
        '/fake/jmeter/path -Jjmeter.save.saveservice.assertion_results_failure_message=false -g /fake/output/dir/kpi.jtl -o /fake/output/dir/report -q /fake/output/dir/jmeter-bzt.properties': {
            code: 0
        },
    },
} as ma.TaskLibAnswers;

tmr.setAnswers(mockAnswers);

tmr.run();
