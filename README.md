test-results
============

Get test result reports from Salesforce

[![Version](https://img.shields.io/npm/v/test-results.svg)](https://npmjs.org/package/test-results)
[![CircleCI](https://circleci.com/gh/leboff/test-results/tree/master.svg?style=shield)](https://circleci.com/gh/leboff/test-results/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/leboff/test-results?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/test-results/branch/master)
[![Codecov](https://codecov.io/gh/leboff/test-results/branch/master/graph/badge.svg)](https://codecov.io/gh/leboff/test-results)
[![Greenkeeper](https://badges.greenkeeper.io/leboff/test-results.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/leboff/test-results/badge.svg)](https://snyk.io/test/github/leboff/test-results)
[![Downloads/week](https://img.shields.io/npm/dw/test-results.svg)](https://npmjs.org/package/test-results)
[![License](https://img.shields.io/npm/l/test-results.svg)](https://github.com/leboff/test-results/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g test-run-report
$ test-run-report COMMAND
running command...
$ test-run-report (-v|--version|version)
test-run-report/0.0.0 darwin-x64 node-v8.12.0
$ test-run-report --help [COMMAND]
USAGE
  $ test-run-report COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`test-run-report testrunreport:convert`](#test-run-report-testrunreportconvert)
* [`test-run-report <%= command.id %> [-d <string>] [-c] [-a] [-l] [-r] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#test-run-report--commandid---d-string--c--a--l--r--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfatal)
* [`test-run-report testrunreport:view`](#test-run-report-testrunreportview)

## `test-run-report testrunreport:convert`

Convert test results to report type

```
USAGE
  $ test-run-report testrunreport:convert

OPTIONS
  -d, --outputdir=outputdir    [default: ./test-results] the directory to scan for reports
  -i, --inputdir=inputdir      (required) the directory to scan for reports
  -r, --reporttype=reporttype  [default: sonarqube] type of report to convert to [sonarqube*]
  -s, --sourcedir=sourcedir    [default: ./src] the directory to scan for reports
```

_See code: [src/commands/testrunreport/convert.ts](https://github.com/leboff/test-run-report/blob/v0.0.0/src/commands/testrunreport/convert.ts)_

## `test-run-report <%= command.id %> [-d <string>] [-c] [-a] [-l] [-r] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`

Retrieve reports for a test run

```
USAGE
  $ test-run-report testrunreport:retrieve [-d <string>] [-c] [-a] [-l] [-r] [-v <string>] [-u <string>] [--apiversion 
  <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]

OPTIONS
  -a, --alltestsonly                               only retrieve results for full test runs
  -c, --codecoverage                               directory root to place test results
  -d, --outputdirectory=outputdirectory            [default: results] directory root to place test results
  -l, --uselatest                                  use latest test run

  -r, --resultformat                               test result format emitted to stdout; --json flag overrides this
                                                   parameter (human*,tap,junit,json)

  -u, --targetusername=targetusername              username or alias for the target org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername  username or alias for the dev hub org; overrides default dev hub org

  --apiversion=apiversion                          override the api version used for api requests made by this command

  --json                                           format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)   [default: warn] logging level for this command invocation

EXAMPLE
  $ sfdx testrunreport:retrieve --targetusername myOrg@example.com --outputDirectory results
     Test results written to results/myOrg@example.com/2019-03-06T09:45:21.000+0000
```

_See code: [src/commands/testrunreport/retrieve.ts](https://github.com/leboff/test-run-report/blob/v0.0.0/src/commands/testrunreport/retrieve.ts)_

## `test-run-report testrunreport:view`

View test run results

```
USAGE
  $ test-run-report testrunreport:view

OPTIONS
  -i, --inputdir=inputdir  (required) the directory to scan for reports
  -p, --port=port          [default: 3000] port to run server on
```

_See code: [src/commands/testrunreport/view.ts](https://github.com/leboff/test-run-report/blob/v0.0.0/src/commands/testrunreport/view.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
