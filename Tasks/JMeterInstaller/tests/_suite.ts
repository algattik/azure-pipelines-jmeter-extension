import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('JMeter installer tests', function () {

    before(() => {

    });

    after(() => {

    });

    it('should succeed with valid version number', function (done: MochaDone) {
        this.timeout(5000);

        let tp = path.join(__dirname, 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        console.log(tr.succeeded);
        console.log(tr.stderr);
        console.log(tr.stdout);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.ok(tr.stdout.includes(
            "\n##vso[task.setvariable variable=JMeterHome;issecret=false;]/fake/path/to/cached/dir/apache-jmeter-5.1\n"),
            'variable JMeterHome was not set as expected');
        assert.ok(tr.stdout.includes(
            "\n##vso[task.setvariable variable=JMeterPath;issecret=false;]/fake/path/to/cached/dir/apache-jmeter-5.1/bin/jmeter\n"),
            'variable JMeterPath was not set as expected');
        assert.ok(tr.stdout.includes(
            "\n##vso[task.setvariable variable=JMeterVersion;issecret=false;]5.1\n"),
            'variable JMeterVersion was not set as expected');
        done();
    });

    it('it should fail if invalid version number provided', function (done: MochaDone) {
        this.timeout(5000);

        let tp = path.join(__dirname, 'failure.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'Error: loc_mock_InputVersionNotValidVersion bad', 'error issue output');

        done();
    });

});
