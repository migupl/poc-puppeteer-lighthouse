# Playing with [Puppetteer][1] and [LightHouse][2]

## Using the Open Source Linux tool [podman][3] (The next generation of Linux container tools)

Running **podman** ([doc][4]) after v1.0 should never require root access (it's his goal) and will be an advantage over docker at future time. Podman's daemon-less architecture will be more flexible and secure than docker architecture that is necessarily running as root. It's promise.

As this is a POC we will play with this tool althoug it's not an advantage now

```bash
$ sudo podman -v
podman version 0.11.1.1
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

## Create nodejs docker image

```bash
$ sudo podman build -t node-10-lts .
$ sudo podman images
  REPOSITORY               TAG         IMAGE ID       CREATED          SIZE
  localhost/node-10-lts    latest      a0bcbbe766a1   45 seconds ago   74.4 MB
  docker.io/library/node   10-alpine   c7f513f4c081   7 days ago       74.4 MB
$ sudo podman run -it node-10-lts node --version
v10.14.1
```

As you can see the image name is preceded by the registry site. The new **node-10-lts** image is registered on the local machine. 

[1]: https://developers.google.com/web/tools/puppeteer/
[2]: https://developers.google.com/web/tools/lighthouse/
[3]: https://developers.redhat.com/articles/podman-next-generation-linux-container-tools/?sc_cid=701f2000001CxXhAAK
[4]: https://podman.io/