import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

const userRequestedVersion = "1.14.0";

let taskPath = path.join(__dirname, '..', 'src', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('taurusVersion', userRequestedVersion);
tmr.setInput('pythonCommand', '/fake/bin/python3');

// Provide answers for task mock.
const mockAnswers: ma.TaskLibAnswers = {
    which: {
        "bzt": "/fake/bin/bzt",
    },
    checkPath: {
        "/fake/bin/bzt": true,
    },
    exec: {
        '/fake/bin/python3 -V': {
            code: 0
        },
        '/fake/bin/python3 -mpip install bzt==1.14.0': {
            code: 0
        },
        '/fake/bin/bzt --help': {
            code: 0
        },
    }
} as ma.TaskLibAnswers;

tmr.setAnswers(mockAnswers);

tmr.run();
