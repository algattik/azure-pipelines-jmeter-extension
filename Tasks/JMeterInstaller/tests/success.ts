import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

const userRequestedVersion = "5.1";
const userRequestedSemVersion = "5.1.0";
const expectedDownloadUrl =
    `https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-${userRequestedVersion}.zip`;
const cmdrunnerUrl = "https://search.maven.org/remotecontent?filepath=kg/apc/cmdrunner/2.2/cmdrunner-2.2.jar";
const pluginmgrUrl = "https://search.maven.org/remotecontent?filepath=kg/apc/jmeter-plugins-manager/1.3/jmeter-plugins-manager-1.3.jar";
const fakeDownloadedPath = "/fake/path/to/downloaded/file";

let taskPath = path.join(__dirname, '..', 'src', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('jmeterVersion', userRequestedVersion);
tmr.setInput('plugins', 'jpgc-fifo,jpgc-json=2.2');

const pluginsHash = 'b3fcc086e06c828faa1aefc23e2332c666037866c1e91ab09ab32e20';


tmr.registerMock("azure-pipelines-tool-lib/tool", {
    findLocalTool: (toolName: string, versionSpec: string, arch?: string) => {
        if (toolName !== `jmeter-${pluginsHash}`) {
            throw new Error(`Unexpected toolName ${toolName}.`);
        }
        if (versionSpec !== userRequestedSemVersion) {
            throw new Error(`Unexpected versionSpec ${versionSpec}.`);
        }
        return undefined;
    },
    downloadTool: (url: string, fileName?: string) => {
        switch (url) {
            case expectedDownloadUrl: {
                return Promise.resolve(fakeDownloadedPath);
            }
            case cmdrunnerUrl: {
                return Promise.resolve(fakeDownloadedPath);
            }
            case pluginmgrUrl: {
                return Promise.resolve(fakeDownloadedPath);
            }
            default: {
                throw new Error(`Unexpected download url ${url}.`);
            }
        }
    },
    extractZip: (file: string, destination?: string) => {
        if (file !== fakeDownloadedPath) {
            throw new Error(`Unexpected downloaded file path ${file}`);
        }
        return Promise.resolve("/fake/path/to/extracted/contents");
    },
    cacheDir: (sourceDir: string, tool: string, version: string, arch?: string) => {
        if (sourceDir !== "/fake/path/to/extracted/contents") {
            throw new Error(`Unexpected sourceDir ${sourceDir}.`);
        }
        if (tool !== `jmeter-${pluginsHash}`) {
            throw new Error(`Unexpected tool ${tool}.`);
        }
        if (version !== userRequestedSemVersion) {
            throw new Error(`Unexpected version ${version}.`);
        }
        if (arch !== undefined) {
            throw new Error(`Unexpected arch ${arch}.`);
        }
        return Promise.resolve("/fake/path/to/cached/dir");
    },
    prependPath: (toolPath: string) => {
        if (toolPath !== "/fake/path/to/cached/dir/apache-jmeter-5.1/bin") {
            throw new Error(`Unexpected toolPath ${toolPath}.`);
        }
        console.log(`prepending path ${toolPath}`);
    },
});

// Provide answers for task mock.
const mockAnswers: ma.TaskLibAnswers = {
    find: {
        "/fake/path/to/cached/dir/jmeter": [
            "/fake/path/to/cached/dir/jmeter/apache-jmeter-5.1/bin/jmeter",
            "/fake/path/to/cached/dir/jmeter/apache-jmeter-5.1/bin/jmeter.bat",
        ],
        "/fake/path/to/cached/dir": [
            "/fake/path/to/cached/dir/apache-jmeter-5.1/bin/jmeter",
            "/fake/path/to/cached/dir/apache-jmeter-5.1/bin/jmeter.bat",
        ],
    },
    which: {
        "jmeter": "/fake/bin/jmeter",
    },
    checkPath: {
        "/fake/bin/jmeter": true,
    },
    exec: {
        '/fake/bin/jmeter --version': {
            code: 0
        },
        'java -cp /fake/path/to/extracted/contents/apache-jmeter-5.1/lib/ext/jmeter-plugins-manager-1.3.jar org.jmeterplugins.repository.PluginManagerCMDInstaller': {
            code: 0
        },
        '/fake/path/to/extracted/contents/apache-jmeter-5.1/bin/PluginsManagerCMD.sh install jpgc-fifo,jpgc-json=2.2': {
            code: 0
        },
    }
} as ma.TaskLibAnswers;

tmr.setAnswers(mockAnswers);

tmr.run();
