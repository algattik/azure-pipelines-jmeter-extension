# JMeter tool installer


### Overview

The JMeter Tool Installer task acquires a specified version of [JMeter](https://www.jmeter.io/) from the Internet or the tools cache and prepends it to the PATH of the Azure Pipelines Agent (hosted or private). Use this task to change the version of JMeter used in subsequent tasks, such as the TaurusRunner task, or a script task running JMeter.


### Contact Information

Please report a problem at [GitHub](https://github.com/algattik/jmeter-extension/issues) if you are facing problems in making this task work. You can also share feedback about the task like, what more functionality should be added to the task, what other tasks you would like to have, at the same place.


### Pre-requisites for the task

The task requires a Java Runtime Environment (JRE) to be installed. A JRE is already installed on hosted Azure DevOps build agents.

### Parameters of the task

* **Display name\*:** Provide a name to identify the task among others in your pipeline.

* **Version\*:** Specify the exact version of JMeter to install.
Example: 
    To install JMeter version 5.1, use 5.1
For getting more details about exact version, refer to [this link](https://jmeter.apache.org/download_jmeter.cgi)


### Output Variables

* **JMeter path:** This variable can be used to refer to the path of the JMeter binary that was installed on the agent in subsequent tasks.
