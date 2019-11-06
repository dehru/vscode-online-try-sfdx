#!/bin/bash
mkdir ~/.sfdx-cli
wget -qO- https://developer.salesforce.com/media/salesforce-cli/sfdx-linux-amd64.tar.xz | tar xJ -C ~/.sfdx-cli --strip-components 1
~/.sfdx-cli/install