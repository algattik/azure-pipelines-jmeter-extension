# Taurus tool installer


### Overview

The Taurus Tool Installer task acquires a specified version of [Taurus](https://gettaurus.org/) from the Internet. Use this task to change the version of Taurus used in subsequent tasks, such as the TaurusRunner task, or a script task running Taurus.


### Contact Information

Please report a problem at [GitHub](https://github.com/algattik/jmeter-extension/issues) if you are facing problems in making this task work. You can also share feedback about the task like, what more functionality should be added to the task, what other tasks you would like to have, at the same place.


### Pre-requisites for the task

The task requires Python 3.6+ to be installed and in the PATH.

### Parameters of the task

* **Display name\*:** Provide a name to identify the task among others in your pipeline.

* **Version\*:** Specify the exact version of Taurus to install.
Example: 
    To install Taurus version 1.14.0, use 1.14.0
For getting more details about exact version, refer to [this link](https://pypi.org/project/bzt/#history)
