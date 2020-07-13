# Welcome to Moryx.Runtime.Maintenance.Web

## 1. What is *Moryx.Runtime.Maintenance.Web*

This module provides the next generation Maintenance UI based on React/Typescript.

## 2. Build from source code

As a prerequisite, you need:

- NodeJS (9.5.0)
- Python (2.7.18)
- .Net Framework SDK 2.0
- Visual Studio Code (latest)
- Visual Studio > 2015

Setting up a proper build evironment (in case you haven't already):

*Step1.* Start PowerShell console as Admin

*Step2.* `npm install -g windows-build-tools`

Now that you are ready to build the project, you will get the sources to build:

*Step1.* `git clone https://github.com/PHOENIXCONTACT/MORYX-MaintenanceWeb.git` to get the latest code.

*Step2.* Open Visual Studio Code

*Step3.* Open cloned folder

*Step4.* Execute Tasks -> Execute Build Task.

Now you should have built the modern browser UI. Next you'll build the backend webserver module.

*Step1.* Open PowerShell

*Step2.* Change to clone directory

*Step3.* Execute `./Build.ps1 -Build`

*Step4.* Start StartProject.exe

*Step5.* Open a browser and go to [http://localhost/MaintenanceWeb/](http://localhost/MaintenanceWeb/)

Voilá.