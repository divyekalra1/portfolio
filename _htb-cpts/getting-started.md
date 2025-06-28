---
layout: blog-posts
title: "Getting Started"
date: 2025-06-22
---
## Shell 
A program used to take user input and pass it on to the OS to perform a certain function/task. 
Most common one -- `bash` (Bourne Again Shell) -- is an enhanced version of the original Unix system's shell program `sh`. Others -- `zsh`, `tcsh`, `ksh`, `Fish shell`, etc.

**There are three main types of shell connections:**

| Shell Type | Description |
| --- | --- |
| `Reverse shell` | Initiates a connection back to a "listener" on our attack box. |
| `Bind shell` | "Binds" to a specific port on the target host and waits for a connection from our attack box. |
| `Web shell` | Runs operating system commands via the web browser, typically not interactive or semi-interactive. It can also be used to run single commands (i.e., leveraging a file upload vulnerability and uploading a `PHP` script to run a single command. |

`Gaining shell access` refers to getting **interactive** shell-level access on the exploited target. 


## TCP and UDP 


## Ports
	- https://www.youtube.com/watch?v=g2fT-g9PX9o
	- https://www.stationx.net/common-ports-cheat-sheet/
	- https://web.archive.org/web/20240315102711/https://packetlife.net/media/library/23/common-ports.pdf
	- https://nullsec.us/top-1-000-tcp-and-udp-ports-nmap-default/
Ports are virtual points where network connections begin and end. They are software-based and managed by the host operating system. Ports are associated with a specific process or service and allow computers to differentiate between different traffic types. 



## ssh
1. what is ssh?
Secure Shell (SSH) is an excellent tool for securely connecting to a remote machine. It is a network protocol that runs on port `22` by default and provides users such as system administrators a secure way to access a computer remotely.
SSH uses a client-server model, connecting a user running an SSH client application such as OpenSSH to an SSH server

2. how can ssh be configured? -- SSH can be configured with password authentication or passwordless using public-key authentication using an SSH public/private key pair.

	if you have the credentials of a user in plaintext, use : 
`ssh username@server` -- after which you will be prompted for the password of the user. 
if you get a private ssh key and username, use : 
`ssh '/path/to/private/key/file' username@server`

	the `server` mentioned in the above commands can either be an **IP address or a hostname**. 

Note : It is also possible to read local private keys on a compromised system or add our public key to gain SSH access to a specific user, as we'll discuss in a later section.

## netcat (for windows, unix-like systems)
`nc` is a tool used to connect to shells. It can be used to connect to any listening port and interact with the service running on that port. For example,  
`grilledBread@htb[/htb]$ netcat 10.10.10.10 22
SSH-2.0-OpenSSH_8.4p1 Debian-3`
Output is a banner which tells us that ssh is running on port `22`. This method of collecting information is called `banner grabbing`.  
`nc` can als9o be used for file transfer. 

For Windows systems, an alternative to the `nc` tool is the `PowerCat` tool. 
For unix systems, an alternative to the `nc` tool is the `socat` tool -- **unlike `nc`**, it has features like forwarding ports and connecting to serial devices. Socat can also be used to upgrade a shell to a fully interactive TTY.  Shell connections established using `socat` are more stable.
### `socat` syntax

## vim
text editor that can be used for writing code or editing text files on Linux systems.
`grilledBread@htb[/htb]$ vim /etc/hosts`
- If we want to create a new file, input the new file name, and Vim will open a new window with that file. Once we open a file, we are in read-only normal mode, which allows us to navigate and read the file. To edit the file, we hit i to enter insert mode, shown by the "-- INSERT --" at the bottom of Vim. Afterward, we can move the text cursor and edit the file.

- Once we are finished editing a file, we can hit the escape key esc to get out of insert mode, back into normal mode. When we are in normal mode, we can use the following keys to perform some useful shortcuts:

| Command | Description |
| --- | --- |
| `x` | Cut character |
| `dw` | Cut word |
| `dd` | Cut full line |
| `yw` | Copy word |
| `yy` | Copy full line |
| `p` | Paste |

**We can multiply any command to run multiple times by adding a number before it. For example, '4yw' would copy 4 words instead of one, and so on.**

For saving/quitting/naivgating vim, there are several commands we can use:

| Command | Description |
| --- | --- |
| `:1` | Go to line number 1. |
| `:w` | Write the file, save |
| `:q` | Quit |
| `:q!` | Quit without saving |
| `:wq` | Write and quit |

- https://vimsheet.com/

## tmux (Terminal Multiplexer)
### Difference between terminal emulators like terminator and tmux?
Imagine a web browser (Terminator):
- It provides the window on your desktop.
- You can open multiple tabs in the browser to view different websites.
- You can sometimes split the browser window to see two web pages side-by-side.
Now imagine a web application like Google Docs running inside one of those browser tabs (tmux):
- Google Docs itself allows you to have multiple documents open (like tmux windows) and perhaps even view different sections of a document side-by-side (like tmux panes).
- If you close the browser tab (lose connection), the document on Google Docs (your tmux session) is still there on the server, and you can open a new tab and log back in to continue working. This basically means that `tmux` allows you to disconnect from the server while the processes in the terminal(s) continue running, and reconnect later.
<img src="_htb-cpts/assets/getting-started/ba6ffa85877fab3508aee822220ee03b.png" alt="Dinosaur" height ="200" width ="400"/>
![ss1](/assets/getting-started/b59ebe4fde16e3f6f4c1b9b4b8dd03c7.png)
![ss2](/assets/getting-started/ba6ffa85877fab3508aee822220ee03b.png)

Use `Ctrl+B` and then `C` to open a new tmux window. These windows are indexed at the bottom of the terminal pane. We can switch to each window by hitting the prefix and then inputting the window number, like 0 or 1. We can also split a window vertically into panes by hitting the prefix and then [SHIFT + %]
- https://tmuxcheatsheet.com/
- http://youtube.com/watch?v=Lqehvpe_djs

