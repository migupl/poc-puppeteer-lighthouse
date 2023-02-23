# Playing with Puppetteer and Lighthouse running at a [Debian container][15] ([it can be tricky][4])

The purpose of this POC is play with 

- [Google Chrome Headless][10] is the Google Chrome browser that can be started 
without graphical interface to accomplish several tasks (PDF printing,
 performance, automation...)
- [Google Lighthouse][3] analyzes web apps and web pages, collecting modern 
performance metrics and insights on developer best practices 
([using programatically][11] [v3.0][12])
- [Google Puppeteer][1] is a tool to automate tasks on a Chrome (headless) 
browser ([API c1.11.0][2])

containerized to getting website performance analysis as console output.

Because one of the **goals of Lighthouse** is to make sure sites are prioritizing 
mobile performance the default report will show this approach. The Lighthouse 
team have intentionally set the emulation settings to mimic a mobile device on a 
reasonable 3G connection and it is based on their objective: _"If your performance numbers are 
good on mobile, they'll be even better on desktop :) Users will be happy"_.

No [device emulation][13] is implemented as parameter option for this reason.

Using this containerized implementation gets a stable environment to get 
good results because:

- Lighthouse v3.0 is using a new internal auditing engine, codenamed [Lantern][14]. 
It completes your audits faster, with less variance between runs
- Chrome Headless gets a clean state every execution.

But it is only that... my own thoughts. No testing was done.

The facility of getting local user privileges for shared folders will be used in 
every containers execution.
 
## Using the Open Source Linux tool podman ([the next generation of Linux container tools][5])

Running **[podman][6]** after v1.0 should never require root access (it's his goal) 
and will be an advantage over docker at a future time. Podman's daemon-less 
architecture will be more flexible and secure than the docker architecture that must be 
running as root. It's a promise.

As this is a POC we will play with this tool.

```bash
$ podman -v
podman version 4.4.1
```

Podman looks for docker images in the explicit order showed executing the following command

```bash
$ podman info
host:
...
registries:
  docker.io:
    Blocked: false
    Insecure: true
    Location: docker.io
    MirrorByDigestOnly: false
    Mirrors: null
    Prefix: docker.io
    PullFromMirror: ""
store:
...
``` 

First looks on the local machine then _docker.io_, _registry.fedoraproject.org_ 
and go on with the registries list.

## Create nodejs / npm docker image

I am using the tag name **poc-puppeteer-and-lighthouse**.

```bash
$ podman build -t poc-puppeteer-and-lighthouse .
$ podman images
REPOSITORY                                        TAG               IMAGE ID       CREATED        SIZE
localhost/poc-puppeteer-and-lighthouse    latest           1c6e25302643  13 minutes ago  1.17 GB
docker.io/library/node                    19-slim          d636cb0562fb  15 hours ago    256 MB
```

As you can see the image name is preceded by the registry site. The new **poc-puppeteer-and-lighthouse** 
image is registered in the local machine. 

Nodejs and npm installed versions are

```bash
$ podman run -it poc-puppeteer-and-lighthouse node -v
v19.7.0
$ podman run -it poc-puppeteer-and-lighthouse npm -v
9.5.0
```

## Add puppeteer

[Puppeteer][1] installation is done with

```bash
$ podman run -v $(pwd)/app:/app:Z --userns=keep-id -it poc-puppeteer-and-lighthouse \
npm i puppeteer
npm WARN deprecated intl-messageformat-parser@1.8.1: We've written a new parser that's 6x faster and is backwards compatible. Please use @formatjs/icu-messageformat-parser

added 156 packages, and audited 391 packages in 18s

26 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Running _app/example-puppeteer.js_ 

```bash
$ podman run -v $(pwd)/app:/app:Z --userns=keep-id -it poc-puppeteer-and-lighthouse \
node example-puppeteer.js
```

must create an _app/example.png_ image 

## Add lighthouse

[Lighthouse][8] installation is done with

```bash
$ podman run -v $(pwd)/app:/app:Z --userns=keep-id -it poc-puppeteer-and-lighthouse \
npm i lighthouse
```

Running _app/example-lighthouse.js_ 

```bash
$ podman run -v $(pwd)/app:/app:Z --userns=keep-id -it poc-puppeteer-and-lighthouse \
node example-lighthouse.js | tee -a reports/example-lighthouse.json
```
must create a _reports/example-lighthouse.json_ json file that it can be uploaded 
at [Lighthouse Report Viewer][9] 

## Using the script

You can execute

```bash
$ podman run -v $(pwd)/app:/app:Z --userns=keep-id -it poc-puppeteer-and-lighthouse \
node get-report.js an_url
```

to getting the [Lighthouse scoring][12] report as json format.

Execute 

```bash
$ podman run -v $(pwd)/app:/app:Z --userns=keep-id -it poc-puppeteer-and-lighthouse \
node get-report -h
Usage: get-report [options] <url>

A JavaScript script to getting Lighthouse audit reports

Options:
  -V, --version                 output the version number
  -o, --output [html|json]      Output report format (default: "json")
  --disable-device-emulation    Disable mobile device emulation
  --disable-cpu-throttling      Disable CPU throttling
  --disable-network-throttling  Disable Network throttling
  -h, --help                    output usage information
```

for help.

### Some examples

Getting json output for desktop emulation

```bash
$ podman run -v $(pwd)/app:/app:Z --userns=keep-id -it poc-puppeteer-and-lighthouse \
node get-report <an-url> --disable-device-emulation --disable-network-throttling --disable-cpu-throttling \
 | tee reports/<an-url>.desktop.json
```

Getting html output for mobile emulation

```bash
$ podman run -v $(pwd)/app:/app:Z --userns=keep-id -it poc-puppeteer-and-lighthouse \
node get-report <an-url> -o html \
| tee reports/<an-url>.mobile.html
```

### Notes

As podman requires root privileges to run it's recommended to using current user 
at container execution.

### Errors at container build

Using as host

```bash
$ uname -rsm
Linux 4.19.8-arch1-1-ARCH x86_64
```

can abort the building process with an error like

```bash
...
dpkg: error: error creating new backup file '/var/lib/dpkg/status-old': Invalid cross-device link
E: Sub-process /usr/bin/dpkg returned an error code (2)
...
```

This [trick][7] was useful for me 

```bash
$ echo N | sudo tee /sys/module/overlay/parameters/metacopy
N
```

Use it under your own risk (remember undo it after image building).

To check this you can use a basic Dockerfile like the one existing in the
_./docker-overlay_ folder.


---
That's all Folks!. 

Hope it's helpful. Thanks.


[1]: https://developers.google.com/web/tools/puppeteer/
[2]: https://github.com/GoogleChrome/puppeteer/blob/v1.11.0/docs/api.md
[3]: https://developers.google.com/web/tools/lighthouse/
[4]: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker
[5]: https://developers.redhat.com/articles/podman-next-generation-linux-container-tools/?sc_cid=701f2000001CxXhAAK
[6]: https://podman.io/
[7]: https://bbs.archlinux.org/viewtopic.php?id=241866
[8]: https://www.npmjs.com/package/lighthouse
[9]: https://googlechrome.github.io/lighthouse/viewer/
[10]: https://developers.google.com/web/updates/2017/04/headless-chrome
[11]: https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically
[12]: https://developers.google.com/web/tools/lighthouse/v3/scoring
[13]: https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js
[14]: https://developers.google.com/web/updates/2018/05/lighthouse3
[15]: https://github.com/GoogleChrome/puppeteer/blob/master/.ci/node8/Dockerfile.linux
