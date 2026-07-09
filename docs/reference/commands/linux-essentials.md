---
sidebar_position: 3
title: "Linux Essential Commands"
description: "Quick reference for essential Linux commands used in the ADL environment."
---

# Linux Essential Commands

A dense, scannable reference for the most commonly used Linux commands in the ADL environment.

## Navigation

| Command | Description | Example |
|---------|-------------|---------|
| `ls` | List directory contents | <CopyCommand command="ls" /> |
| `ls -la` | List all files (including hidden) in long format | <CopyCommand command="ls -la" /> |
| `ls -lh` | List files with human-readable sizes | <CopyCommand command="ls -lh" /> |
| `ls -R` | List directories recursively | <CopyCommand command="ls -R" /> |
| `cd` | Change to home directory | <CopyCommand command="cd" /> |
| `cd /path/to/dir` | Change to a specific directory | <CopyCommand command="cd /path/to/dir" /> |
| `cd ..` | Move up one directory | <CopyCommand command="cd .." /> |
| `cd -` | Switch to previous directory | <CopyCommand command="cd -" /> |
| `pwd` | Print current working directory | <CopyCommand command="pwd" /> |
| `tree` | Display directory tree structure | <CopyCommand command="tree" /> |
| `tree -L 2` | Limit tree depth to 2 levels | <CopyCommand command="tree -L 2" /> |
| `pushd /path` | Save current dir and change to `/path` | <CopyCommand command="pushd /path/to/dir" /> |
| `popd` | Return to the directory saved by `pushd` | <CopyCommand command="popd" /> |

## File Operations

| Command | Description | Example |
|---------|-------------|---------|
| `cp src dest` | Copy a file | <CopyCommand command="cp file.txt backup.txt" /> |
| `cp -r src dest` | Copy a directory recursively | <CopyCommand command="cp -r mydir/ mydir_backup/" /> |
| `cp -i src dest` | Copy with overwrite confirmation | <CopyCommand command="cp -i file.txt dest/" /> |
| `mv src dest` | Move or rename a file or directory | <CopyCommand command="mv old.txt new.txt" /> |
| `rm file` | Remove a file | <CopyCommand command="rm file.txt" /> |
| `rm -r dir` | Remove a directory and its contents | <CopyCommand command="rm -r mydir/" /> |
| `rm -f file` | Force remove without confirmation | <CopyCommand command="rm -f file.txt" /> |
| `rm -rf dir` | Force remove a directory recursively | <CopyCommand command="rm -rf mydir/" /> |
| `mkdir dir` | Create a directory | <CopyCommand command="mkdir newdir" /> |
| `mkdir -p a/b/c` | Create nested directories | <CopyCommand command="mkdir -p parent/child/grandchild" /> |
| `touch file` | Create an empty file or update timestamp | <CopyCommand command="touch newfile.txt" /> |
| `chmod 755 file` | Set permissions using numeric mode | <CopyCommand command="chmod 755 script.sh" /> |
| `chmod u+x file` | Add execute permission for owner | <CopyCommand command="chmod u+x script.sh" /> |
| `chmod go-w file` | Remove write for group and others | <CopyCommand command="chmod go-w config.txt" /> |
| `chown user:group file` | Change file owner and group | <CopyCommand command="chown user:group file.txt" /> |
| `ln -s target link` | Create a symbolic link | <CopyCommand command="ln -s /path/to/target linkname" /> |

<Warning title="Destructive Commands">
Commands like `rm -rf` are irreversible. Always double-check the path before executing, especially when running as root.
</Warning>

## Text Processing

| Command | Description | Example |
|---------|-------------|---------|
| `cat file` | Display file contents | <CopyCommand command="cat file.txt" /> |
| `less file` | View file with scrollable pager | <CopyCommand command="less file.txt" /> |
| `head -n 20 file` | Show first 20 lines | <CopyCommand command="head -n 20 file.txt" /> |
| `tail -n 20 file` | Show last 20 lines | <CopyCommand command="tail -n 20 file.txt" /> |
| `tail -f file` | Follow file updates in real time | <CopyCommand command="tail -f /var/log/syslog" /> |
| `grep pattern file` | Search for a pattern in a file | ```bash
grep 'error' log.txt
``` |
| `grep -r pattern dir` | Search recursively in a directory | ```bash
grep -r 'TODO' src/
``` |
| `grep -i pattern file` | Case-insensitive search | ```bash
grep -i 'warning' log.txt
``` |
| `grep -n pattern file` | Show line numbers with matches | ```bash
grep -n 'function' script.sh
``` |
| `grep -v pattern file` | Show lines that do not match | ```bash
grep -v 'debug' log.txt
``` |
| `grep -l pattern dir/*` | List files containing the pattern | ```bash
grep -l 'main' src/*.py
``` |
| `find . -name "*.txt"` | Find files by name pattern | ```bash
find . -name '*.txt'
``` |
| `find . -type d` | Find directories only | <CopyCommand command="find . -type d" /> |
| `find . -size +10M` | Find files larger than 10 MB | <CopyCommand command="find . -size +10M" /> |
| `find . -mtime -7` | Find files modified in last 7 days | <CopyCommand command="find . -mtime -7" /> |
| `wc file` | Count lines, words, and bytes | <CopyCommand command="wc file.txt" /> |
| `sort file` | Sort lines alphabetically | <CopyCommand command="sort names.txt" /> |
| `uniq` | Remove adjacent duplicate lines | <CopyCommand command="sort data.txt &#124; uniq" /> |
| `cut -d: -f1 file` | Extract fields by delimiter | <CopyCommand command="cut -d: -f1 /etc/passwd" /> |
| `tr 'a-z' 'A-Z'` | Translate characters | <CopyCommand command="echo 'hello' &#124; tr 'a-z' 'A-Z'" /> |
| `sed 's/old/new/g' file` | Substitute text in a file | ```bash
sed 's/foo/bar/g' file.txt
``` |
| `awk '{print $1}' file` | Print the first field of each line | ```bash
awk '{print $1}' data.txt
``` |

## System Information

| Command | Description | Example |
|---------|-------------|---------|
| `df -h` | Show disk space usage (human-readable) | <CopyCommand command="df -h" /> |
| `du -sh dir` | Show total size of a directory | <CopyCommand command="du -sh /home/user" /> |
| `du -h --max-depth=1` | Show sizes one level deep | <CopyCommand command="du -h --max-depth=1 ." /> |
| `free -h` | Display memory usage | <CopyCommand command="free -h" /> |
| `top` | Real-time process monitor | <CopyCommand command="top" /> |
| `htop` | Interactive process viewer (enhanced) | <CopyCommand command="htop" /> |
| `ps aux` | List all running processes (BSD style) | <CopyCommand command="ps aux" /> |
| `ps -ef` | List all running processes (POSIX style) | <CopyCommand command="ps -ef" /> |
| `kill PID` | Send SIGTERM to a process | <CopyCommand command="kill 1234" /> |
| `kill -9 PID` | Force kill a process | <CopyCommand command="kill -9 1234" /> |
| `killall name` | Kill all processes by name | <CopyCommand command="killall firefox" /> |
| `uname -a` | Show all system information | <CopyCommand command="uname -a" /> |
| `uptime` | Show system uptime and load | <CopyCommand command="uptime" /> |
| `whoami` | Print current username | <CopyCommand command="whoami" /> |

<Tip title="Process Management">
Use `htop` over `top` when available -- it provides a more intuitive, color-coded interface with mouse support and easier process filtering.
</Tip>

## Network

| Command | Description | Example |
|---------|-------------|---------|
| `ping host` | Test network connectivity | <CopyCommand command="ping -c 4 google.com" /> |
| `curl url` | Transfer data from a URL | <CopyCommand command="curl https://example.com" /> |
| `curl -O url` | Download a file (keep original name) | <CopyCommand command="curl -O https://example.com/file.tar.gz" /> |
| `curl -L url` | Follow redirects | <CopyCommand command="curl -L https://example.com/redirect" /> |
| `wget url` | Download a file | <CopyCommand command="wget https://example.com/file.tar.gz" /> |
| `ip addr` | Show network interface addresses | <CopyCommand command="ip addr" /> |
| `ss -tulnp` | Show listening TCP/UDP ports with process info | <CopyCommand command="ss -tulnp" /> |
| `hostname` | Display system hostname | <CopyCommand command="hostname" /> |

## Permissions Quick Reference

Understanding the numeric (octal) permission system:

| Value | Permission |
|-------|------------|
| `4` | Read (r) |
| `2` | Write (w) |
| `1` | Execute (x) |
| `0` | None (-) |

Common permission combinations:

| Numeric | Symbolic | Meaning |
|---------|----------|---------|
| `755` | `rwxr-xr-x` | Owner full, group/others read and execute |
| `644` | `rw-r--r--` | Owner read/write, group/others read only |
| `700` | `rwx------` | Owner full, no access for others |
| `600` | `rw-------` | Owner read/write, no access for others |
| `777` | `rwxrwxrwx` | Full access for everyone (avoid in production) |
| `444` | `r--r--r--` | Read-only for everyone |

<BestPractice>
Avoid using `777` permissions. Grant the minimum permissions necessary for the task. Use `755` for executable scripts and `644` for regular files as sensible defaults.
</BestPractice>

## Redirection and Pipes

| Command | Description | Example |
|---------|-------------|---------|
| `cmd > file` | Redirect stdout to file (overwrite) | ```bash
echo 'hello' > output.txt
``` |
| `cmd >> file` | Redirect stdout to file (append) | ```bash
echo 'world' >> output.txt
``` |
| `cmd 2> file` | Redirect stderr to file | <CopyCommand command="cmd 2> errors.log" /> |
| `cmd 2>&1` | Redirect stderr to stdout | <CopyCommand command="cmd > all.log 2>&1" /> |
| `cmd1 \| cmd2` | Pipe stdout of cmd1 into cmd2 | <CopyCommand command="ls -la &#124; grep '.txt'" /> |
| `cmd \| tee file` | Pipe output and write to file simultaneously | <CopyCommand command="ls -la &#124; tee listing.txt" /> |

<Note>
Use `>>` instead of `>` when you want to preserve existing file contents. The single `>` operator will overwrite the file without warning.
</Note>
