---
title: "k8s-env: A Single-Node Kubernetes Box"
description: "Two bash scripts that turn a fresh Ubuntu 26.04 VM into a working single-node Kubernetes cluster, plus the fixes I needed after."
series: projects
order: 4
tags: ["kubernetes", "homelab", "proxmox", "bash"]
---
Every time I want to mess around with Kubernetes, there's the same boring hour of setup before anything fun happens. Disable swap. Load kernel modules. Install a container runtime. Remember which cgroup driver goes where. Add the apt repo. Init the cluster. Install a CNI. Untaint the node. Forget a step. Start over.

So I stopped doing it by hand. `k8s-env` is a VM on my Proxmox box (the dusty Optiplex from the [homelab post](../homelab-setup/)) running a single-node Kubernetes cluster, and the whole thing is set up by two bash scripts. Fresh Ubuntu install in, working cluster out.

This post walks through what the scripts do and why each step exists, then covers the two annoyances I hit once the box was actually running.

## What I Wanted

Nothing fancy:

1.  One VM, one node. Control plane and workloads on the same machine.
2.  Fully scripted, so I can nuke the VM and rebuild it without thinking.
3.  Key-based SSH from my laptop from the start.
4.  `k9s` installed, because staring at `kubectl get pods` output all day is not a lifestyle.

The stack ended up being:

- **OS:** Ubuntu Server 26.04
- **Container runtime:** `containerd`
- **Kubernetes:** v1.35, installed with `kubeadm`
- **CNI:** Flannel
- **Dashboard:** `k9s`

## Script 1: SSH Setup (Runs on Your Machine)

Before touching the server, `setup-local.sh` sets up SSH access from my local machine. It takes the remote user, the server IP, and an optional key name:

```bash
chmod +x setup-local.sh setup-k8s-node.sh

# Usage: ./setup-local.sh <remote_user> <server_ip> [optional_key_name]
./setup-local.sh ubuntu 192.168.1.50
```

It makes sure the OpenSSH client is installed, generates a dedicated ED25519 keypair at `~/.ssh/id_ed25519_k8s_node` (only if one doesn't already exist), copies the public key over with `ssh-copy-id`, and runs a test command to confirm it worked:

```bash
if [[ ! -f "$KEY_PATH" ]]; then
  ssh-keygen -t ed25519 -f "$KEY_PATH" -N "" -C "k8s-admin@$(hostname)"
else
  echo "Key ${KEY_PATH} already exists. Skipping creation."
fi

ssh-copy-id -i "${KEY_PATH}.pub" "${REMOTE_USER}@${REMOTE_HOST}"
ssh -i "$KEY_PATH" "${REMOTE_USER}@${REMOTE_HOST}" "echo 'SSH connection successful!'"
```

Why a dedicated key instead of reusing my main one? Because this VM is meant to be disposable. If I blow it away, I can revoke or delete one key without touching anything else.

Both scripts start with `set -euo pipefail`. If any command fails, the script stops right there instead of happily continuing and leaving you with a half-configured mess.

## Script 2: The Node Setup (Runs on the Server)

Copy the script over and run it:

```bash
scp -i ~/.ssh/id_ed25519_k8s_node setup-k8s-node.sh ubuntu@192.168.1.50:~
ssh -i ~/.ssh/id_ed25519_k8s_node ubuntu@192.168.1.50
chmod +x setup-k8s-node.sh
./setup-k8s-node.sh
```

This is where the actual work happens. Twelve steps. Here's what each one does and, more importantly, why.

### Swap Off

```bash
sudo swapoff -a
sudo sed -i '/\sswap\s/ s/^\(.*\)$/#\1/g' /etc/fstab
```

The kubelet expects swap to be off by default, and `kubeadm` will complain during preflight checks if it isn't. `swapoff -a` handles the current boot, and the `sed` comments out the swap line in `/etc/fstab` so it stays off after a reboot. Skip the second part and your cluster mysteriously breaks the next time the VM restarts. Fun.

### Kernel Modules and sysctl

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
```

- `overlay` is the filesystem driver containerd uses to layer container images.
- `br_netfilter` lets iptables see traffic crossing the Linux bridge. Without it, Kubernetes networking rules (Services, kube-proxy) just don't apply to pod traffic.
- `ip_forward` lets the node route packets between pods and the outside world.

Writing these to `/etc/modules-load.d/` and `/etc/sysctl.d/` means they survive reboots too. Same theme as swap: make it stick.

### containerd with SystemdCgroup

```bash
sudo apt install -y containerd
containerd config default | sudo tee /etc/containerd/config.toml > /dev/null
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml
```

This one is a classic footgun. The kubelet and the container runtime both manage cgroups, and they need to agree on *how*. `kubeadm` configures the kubelet to use the `systemd` cgroup driver, but containerd's default config uses `cgroupfs`. If they disagree, you get pods that keep restarting for no obvious reason. One `sed` line and they're on the same page.

### Kubernetes v1.35 from the Official Repo

```bash
curl -fsSL "https://pkgs.k8s.io/core:/stable:/${K8S_VERSION}/deb/Release.key" | \
  sudo gpg --dearmor --yes -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/${K8S_VERSION}/deb/ /" | \
  sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

The version lives in a variable at the top of the script (`K8S_VERSION="v1.35"`), so bumping it later is a one-line change. The repo is pinned to that minor version, and `apt-mark hold` stops a routine `apt upgrade` from silently upgrading Kubernetes underneath a running cluster. Cluster upgrades should be on purpose, not a side effect of patching the OS.

### Init, kubeconfig, Flannel

```bash
sudo kubeadm init --pod-network-cidr="10.244.0.0/16"

mkdir -p "$HOME/.kube"
sudo cp /etc/kubernetes/admin.conf "$HOME/.kube/config"
sudo chown "$(id -u):$(id -g)" "$HOME/.kube/config"

kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
```

`10.244.0.0/16` isn't random: it's Flannel's default pod network, so using it means Flannel works out of the box with zero config. The kubeconfig gets copied into my normal user's home so I'm not running `kubectl` as root.

Flannel is the simplest CNI I could pick. For a single node I don't need network policies or anything clever, I just need pods to get IPs and talk to each other.

### Untaint the Control Plane

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane- || true
```

By default, Kubernetes refuses to schedule regular workloads on control plane nodes. Makes sense in production. Makes zero sense when the control plane is the *only* node. The trailing `-` removes the taint, and `|| true` keeps the script from dying if the taint is already gone (remember `set -e`).

### k9s

```bash
wget -q "https://github.com/derailed/k9s/releases/latest/download/k9s_linux_amd64.deb"
sudo apt install -y ./k9s_linux_amd64.deb
```

The script finishes by printing `kubectl get nodes -o wide` and `kubectl get ns`, then telling you to run `k9s`. If the node shows `Ready`, you're done.

## Post-Setup Annoyance #1: Where Did Half My Disk Go?

A while after setting this up, I noticed `df -h` was showing a root filesystem way smaller than the disk I'd given the VM:

```text
Filesystem                         Size  Used Avail Use% Mounted on
/dev/mapper/ubuntu--vg-ubuntu--lv   62G  8.5G   51G  15% /
```

The VM had ~126GB. Root had 62GB. Turns out Ubuntu's installer only gives half of the LVM volume group to the root logical volume by default and leaves the rest sitting there unused. Container images eat disk fast, so this was going to be a problem eventually.

`vgs` confirmed it:

```text
  VG        #PV #LV #SN Attr   VSize    VFree
  ubuntu-vg   1   1   0 wz--n- <126.00g 63.00g
```

63GB free, already inside the volume group. That's the good scenario: no `fdisk`, no `parted`, no `pvresize`. Just one command:

```bash
sudo lvextend -r -l +100%FREE /dev/ubuntu-vg/ubuntu-lv
```

`-l +100%FREE` gives the logical volume all the remaining space, and `-r` resizes the ext4 filesystem in the same step. Online, while mounted, no reboot.

One gotcha: the device-mapper path is `/dev/mapper/ubuntu--vg-ubuntu--lv` (double dashes), but the LVM path is `/dev/ubuntu-vg/ubuntu-lv` (single dashes). Mix them up and LVM tells you `Volume group "ubuntu--vg" not found`.

After:

```text
Filesystem                         Size  Used Avail Use% Mounted on
/dev/mapper/ubuntu--vg-ubuntu--lv  124G  8.5G  110G   8% /
```

Doubled. Zero downtime.

## Post-Setup Annoyance #2: Typing the IP Every Single Time

The other thing driving me nuts was SSH. `ssh divye@k8s-env.local` would just hang or fail to resolve, because nothing on my machine knew what `k8s-env.local` was. So every session started with me digging up the IP.

I could've set up mDNS (Avahi/Bonjour) or added an `/etc/hosts` entry, but honestly the only thing that needed to know about this host was my SSH client. So I added a block to `~/.ssh/config`:

```text
Host k8s-env.local
    HostName 10.0.0.129
    User divye
```

Now it's just:

```bash
ssh k8s-env.local
```

```text
divye@k8s-env:~$
```

No IPs, no usernames, no scrolling through shell history.

## Things I'd Change

It works, but it's not perfect:

- **Flannel is pulled from `master`.** Not pinned to a release, so a future change upstream could break a rebuild. Should pin it to a tagged version.
- **k9s is hardcoded to `amd64`.** Fine for my Optiplex, breaks on anything ARM.
- **The local script assumes `apt`.** It runs `apt install openssh-client`, so it only works if your local machine is Debian/Ubuntu.
- **Single node means no HA.** Obviously. That's the point, but don't run anything important on it.

## Conclusion

Two scripts, one VM, and I can go from a blank Ubuntu install to a cluster I can actually deploy things to without remembering a single `kubeadm` flag. The disk resize and SSH config were small fixes, but they're the kind of thing that annoys you a little bit every day until you finally deal with it.

Now the fun part: actually breaking things on it.

**Update:** the cluster is now managed by ArgoCD. See [Part 2](../k8s-argocd/).
