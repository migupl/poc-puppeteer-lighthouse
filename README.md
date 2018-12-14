# Playing with [Puppetteer][1] ([API c1.11.0][2]) and [LightHouse][3] running at [Debian][4]

## Using the Open Source Linux tool [podman][5] (The next generation of Linux container tools)

Running **podman** ([doc][6]) after v1.0 should never require root access (it's his goal) and will be an advantage over docker at future time. Podman's daemon-less architecture will be more flexible and secure than docker architecture that is necessarily running as root. It's promise.

As this is a POC we will play with this tool althoug it's not an advantage now

```bash
$ sudo podman -v
podman version 0.12.1.1
$ sudo docker -v
Docker version 18.09.0-ce, build 4d60db472b
```

Podman looks for docker images by the explicit order showed executing 

```bash
$ sudo podman info
host:
  ...
registries:
  registries:
  - docker.io
  - registry.fedoraproject.org
  - quay.io
  - registry.access.redhat.com
  - registry.centos.org
store:
  ...
``` 

It first looks on the local machine, then it checks _docker.io_, _registry.fedoraproject.org_ and go on with the registries list.

## Create nodejs / npm docker image

I am using the tag name **poc-puppeteer-and-lighthouse**.

```bash
$ sudo podman build -t poc-puppeteer-and-lighthouse .
$ sudo podman images
REPOSITORY                                        TAG               IMAGE ID       CREATED        SIZE
localhost/poc-puppeteer-and-lighthouse            latest            b2106442811a   16 hours ago   466 MB
docker.io/library/node                            10-stretch-slim   3a7160ffbbb6   40 hours ago   151 MB
```

As you can see the image name is preceded by the registry site. The new **poc-puppeteer-and-lighthouse** image is registered on the local machine. 

Nodejs and npm installed versions are

```bash
$ sudo podman run -it poc-puppeteer-and-lighthouse node -v
v10.14.2
$ sudo podman run -it poc-puppeteer-and-lighthouse npm -v
6.4.1
```

## Add puppeteer

[Puppeteer][1] installation, with current user privileges, is done with

```bash
$ sudo podman run -v $(pwd)/app:/app -u $(id -u ${USER}):$(id -g ${USER}) -it poc-puppeteer-and-lighthouse npm i puppeteer
```

Running _app/example.js_ 

```bash
$ sudo podman run -v $(pwd)/app:/app -u $(id -u ${USER}):$(id -g ${USER}) -it poc-puppeteer-and-lighthouse node example.js
```

must create an _app/example.png_ image 

## Add lighthouse

[Lighthouse][8] installation, with current user privileges, is done with


### Notes

As podman requires root privileges to run it's recommended to using current user at container execution.

### Build errors

Using as host

```bash
$ uname -rsm
Linux 4.19.8-arch1-1-ARCH x86_64
```

can abort the building process with an error error like

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

Use it under your own risk (remember undo it after image build).

To check this you can use a basic Debian Dockerfile like the one in the _./docker-overlay_ folder.






[1]: https://developers.google.com/web/tools/puppeteer/
[2]: https://github.com/GoogleChrome/puppeteer/blob/v1.11.0/docs/api.md
[3]: https://developers.google.com/web/tools/lighthouse/
[4]: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker
[5]: https://developers.redhat.com/articles/podman-next-generation-linux-container-tools/?sc_cid=701f2000001CxXhAAK
[6]: https://podman.io/
[7]: https://bbs.archlinux.org/viewtopic.php?id=241866
[8]: https://www.npmjs.com/package/lighthouse