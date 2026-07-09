---
title: "What is a Terminal?"
sidebar_position: 11
description: Understanding terminals — the text-based interface that gives you direct control over your Linux system.
---

# What is a Terminal?

A terminal (also called a terminal emulator) is a program that provides a **text-based interface** to your computer. Instead of clicking icons and tapping buttons, you type commands and read text output. The terminal is where you type instructions, and the computer responds with results.

Termux is a terminal. When you open Termux on your phone, you see a blinking cursor on a dark background -- that is a terminal waiting for your commands.

## GUI vs. CLI

There are two fundamental ways to interact with a computer:

**GUI (Graphical User Interface)** -- what most people use every day. You see windows, buttons, icons, and menus. You interact by tapping, clicking, and dragging. Android, Windows, and macOS are all GUI-based.

**CLI (Command Line Interface)** -- what a terminal provides. You see text. You type commands. The computer responds with text output. There are no buttons to click.

| Task | GUI Approach | CLI Approach |
|---|---|---|
| Create a folder | Right-click > New Folder > Type name | `mkdir my-folder` |
| Copy a file | Right-click > Copy, navigate, right-click > Paste | `cp report.pdf backup/` |
| See folder contents | Open the folder, look at icons | `ls` |
| Rename 100 files | Click each one, rename manually | One command with a pattern |
| Install software | Open app store, search, tap Install | `sudo apt install firefox` |
| Find a file | Use the search function, wait | `find / -name "report.pdf"` |

Neither approach is better in all situations. GUIs are intuitive for visual tasks and casual use. CLIs are faster for repetitive tasks, automation, and system administration.

<Note>
You do not have to choose one or the other. In ADL, you have both. The XFCE desktop gives you a GUI with windows and menus, and you can open a terminal inside that desktop whenever you need the command line. Most ADL users switch between both regularly.
</Note>

## Why Termux is a Terminal

Termux is a terminal emulator for Android. "Terminal emulator" means it recreates the experience of a hardware terminal (the physical machines that connected to mainframe computers in the 1970s) as a software application.

When you open Termux, it:

1. Creates a terminal window on your screen
2. Starts a **shell** (a command interpreter, usually bash) inside that terminal
3. Displays the shell's prompt, indicating it is ready for your input
4. Sends your typed commands to the shell for execution
5. Displays the output the shell produces

Termux is special among Android terminal apps because it comes with a complete Linux package ecosystem. It is not just a terminal -- it is a terminal with access to thousands of real Linux tools.

## Anatomy of a Terminal

When you open a terminal, you see a **prompt**. It looks something like this:

```
user@localhost:~$
```

Each part has meaning:

| Part | Meaning |
|---|---|
| `user` | Your username |
| `@localhost` | The machine name |
| `~` | Your current directory (~ means home directory) |
| `$` | Indicates you are a normal user (# means root/admin) |

After the prompt, you type a command and press Enter. The terminal displays the result, then shows a new prompt ready for the next command.

## Common First Commands

If you have never used a terminal before, here are the most fundamental commands to learn:

### pwd -- Print Working Directory

Shows where you currently are in the filesystem:

<CopyCommand command="pwd" />

<ExpectedResult>
/home/user
</ExpectedResult>

### ls -- List Files

Shows the files and folders in your current location:

<CopyCommand command="ls" />

Add `-la` for detailed information including hidden files:

<CopyCommand command="ls -la" />

<ExpectedResult>
A list of files and folders with details like permissions, owner, size, and modification date. Lines starting with 'd' are directories. Lines starting with '-' are regular files. Files starting with '.' are hidden files.
</ExpectedResult>

### cd -- Change Directory

Moves you to a different folder:

<CopyCommand command="cd Documents" />

Special shortcuts:

| Shortcut | Meaning |
|---|---|
| `cd ~` or just `cd` | Go to your home directory |
| `cd ..` | Go up one level (parent directory) |
| `cd /` | Go to the root of the filesystem |
| `cd -` | Go back to the previous directory |

### mkdir -- Make Directory

Creates a new folder:

<CopyCommand command="mkdir my-project" />

### cp -- Copy Files

Copies a file or directory:

<CopyCommand command="cp file.txt backup/file.txt" />

### mv -- Move or Rename Files

Moves a file to a new location, or renames it:

<CopyCommand command="mv old-name.txt new-name.txt" />

### rm -- Remove Files

Deletes a file:

<CopyCommand command="rm unwanted-file.txt" />

<Warning>
The `rm` command deletes files immediately and permanently. There is no recycle bin or trash can in the terminal. Once a file is removed with `rm`, it is gone. Double-check your command before pressing Enter, especially when using `rm -r` (which deletes directories and everything inside them).
</Warning>

### cat -- Display File Contents

Shows the contents of a text file:

<CopyCommand command="cat notes.txt" />

### clear -- Clear the Screen

Clears all text from the terminal window:

<CopyCommand command="clear" />

## Terminal Inside the Desktop

Once your XFCE desktop is running, you can open a terminal inside the graphical environment. XFCE includes **xfce4-terminal**, which provides a terminal window that runs alongside your other graphical applications.

This means you can have Firefox open in one window, a file manager in another, and a terminal in a third -- just like on a regular Linux PC.

You can open a terminal in XFCE by:

- Clicking the terminal icon in the panel
- Right-clicking the desktop and selecting "Open Terminal Here"
- Using the keyboard shortcut (usually Ctrl+Alt+T)

<Tip>
Using a terminal inside XFCE is often more convenient than switching back to the Termux app. The XFCE terminal runs inside the Ubuntu environment directly, so you do not need to manually enter the proot environment -- you are already there.
</Tip>

## Terminal Tips for Beginners

| Tip | Details |
|---|---|
| **Use Tab to autocomplete** | Start typing a file name or command and press Tab. The terminal will complete it for you or show options |
| **Use the up arrow** | Press the up arrow to scroll through previous commands. You do not need to retype them |
| **Commands are case-sensitive** | `ls` works, `LS` does not. Linux commands are almost always lowercase |
| **Spaces matter in commands** | `cd Documents` is correct. `cdDocuments` is not |
| **Use Ctrl+C to cancel** | If a command is running and you want to stop it, press Ctrl+C |
| **Read error messages** | Terminal errors are usually descriptive. Read them carefully -- they often tell you exactly what went wrong |

<FAQ items={[
  {
    question: "Do I need to memorize all these commands?",
    answer: "No. You will naturally remember the commands you use frequently. For everything else, searching online for 'linux command to [do something]' will give you the answer quickly. Over time, the common commands become second nature."
  },
  {
    question: "Can I break my system by typing wrong commands?",
    answer: "Most commands are safe. The potentially dangerous ones require sudo (administrator privileges) and usually ask for confirmation before doing anything destructive. As a beginner, avoid running commands you found online without understanding what they do, especially anything with sudo, rm -rf, or dd."
  },
  {
    question: "What is the difference between the Termux terminal and the XFCE terminal?",
    answer: "The Termux terminal runs in the Termux (Android) environment. The XFCE terminal (xfce4-terminal) runs inside the Ubuntu proot environment. Commands and packages available in each are different. For desktop Linux tasks, use the XFCE terminal. For Termux-specific tasks (like starting PulseAudio), switch to the Termux app."
  },
  {
    question: "Is there a way to undo a command?",
    answer: "There is no universal undo button. Some commands (like moving a file) can be reversed by running the opposite command (move it back). Others (like deleting a file with rm) cannot be undone. This is why it is important to be careful with destructive commands."
  }
]} />

## Summary

A terminal is a text-based interface where you type commands to control your computer. Termux is a terminal emulator that brings Linux command-line tools to your Android phone. In ADL, you use the terminal for system setup and administration, while the XFCE desktop provides a graphical interface for daily use. Learning a handful of basic commands -- `ls`, `cd`, `pwd`, `cp`, `mv`, `rm`, and `mkdir` -- gives you the foundation to navigate and manage your Linux system.

**Next:** Learn about [shells](./what-is-a-shell.md), the program inside the terminal that actually interprets your commands.

For a comprehensive command reference, see the [Termux commands guide](/docs/reference/commands/termux-commands).
