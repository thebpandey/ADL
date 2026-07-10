---
sidebar_position: 1
title: "Glossary of Terms"
description: "A comprehensive A-Z reference of technical terms used throughout the ADL documentation."
---

# Glossary of Terms

A reference of technical terms and concepts used throughout the ADL documentation.

## A

### ADL

Android Desktop Linux --- a project that enables running a full Linux desktop environment on Android devices using Termux, proot, Ubuntu, and XFCE. ADL requires no root access and makes no modifications to the Android system.

### Android

A mobile operating system developed by Google, based on the Linux kernel. Android serves as the host operating system on which ADL runs, providing the underlying kernel, hardware drivers, and application framework.

### APK

Android Package Kit --- the file format used to distribute and install applications on the Android operating system. Termux is distributed as an APK, which you install to provide the foundation for ADL.

### APT

Advanced Package Tool --- the package management system used by Debian-based Linux distributions including Ubuntu. In ADL, APT is the primary way to install, update, and remove software packages within the proot Ubuntu environment.

### ARM

A family of reduced instruction set computing (RISC) processor architectures widely used in mobile devices. Most Android devices that run ADL use ARM-based processors, which determines what precompiled software packages are available.

### ARM64

The 64-bit extension of the ARM architecture, also known as aarch64. ARM64 is the primary architecture supported by ADL, as virtually all modern Android smartphones and tablets use ARM64 processors.

## B

### Bash

The Bourne Again Shell --- a command-line interpreter and scripting language that serves as the default shell in most Linux distributions. In ADL, Bash is the default shell you interact with when using the terminal inside the Ubuntu environment.

### Binary

A compiled executable file containing machine code that can be run directly by the processor. In the context of ADL, binaries must be compiled for the ARM or ARM64 architecture to run natively on your Android device.

## C

### CLI

Command-Line Interface --- a text-based interface for interacting with software by typing commands. ADL uses the CLI extensively, particularly for initial setup, launching the desktop environment, and system administration tasks.

### Compositor

A window management component that combines the visual output of multiple applications into a single screen image. In ADL's XFCE desktop, the compositor handles window transparency, shadows, and visual effects using software rendering.

### Container

An isolated environment for running applications that shares the host system's kernel but has its own filesystem and process space. ADL's proot environment behaves similarly to a container, though it uses system call translation rather than kernel namespaces.

### CPU

Central Processing Unit --- the primary processor that executes instructions in a computing device. The CPU's architecture (typically ARM64 in Android devices) and clock speed directly affect ADL's performance for tasks like compilation and application responsiveness.

## D

### DeX

Samsung DeX --- a feature on Samsung Galaxy devices that provides a desktop-like interface when connected to an external display or used in desktop mode. DeX enhances the ADL experience by allowing Termux:X11 to run in a resizable desktop window alongside other Android apps.

### Display Server

A program that manages graphical output and input devices, acting as an intermediary between applications and the screen. ADL uses either X11 (via Termux:X11) or VNC as its display server to render the Linux desktop on your Android device.

### Distribution

A complete operating system built around the Linux kernel, bundled with package management and pre-selected software. ADL's guides use Ubuntu as their default distribution, giving access to Ubuntu's extensive software repositories and community support; other distributions are documented too.

### DNS

Domain Name System --- the protocol that translates human-readable domain names into IP addresses. In ADL, DNS resolution uses the host Android device's network configuration, so network connectivity inside the Linux environment follows whatever network your phone is connected to.

### dpkg

Debian Package Manager --- the low-level tool that handles the installation and removal of .deb software packages. In ADL, dpkg works underneath APT to manage individual package files within the Ubuntu environment.

## E

### Environment Variable

A named value stored in the shell session that configures the behavior of programs and the operating system. In ADL, environment variables like DISPLAY and PULSE_SERVER are critical for connecting the Linux desktop to the display server and audio system.

## F

### F-Droid

An open-source app store for Android that provides free and open-source applications. F-Droid is the recommended source for installing Termux and Termux:X11, as the versions there are more up to date than those on the Google Play Store.

### Filesystem

The structure and method by which files are organized, stored, and retrieved on a storage device. ADL's filesystem exists within Termux's private storage on Android, with an optional bridge to Android's shared storage directories through termux-setup-storage.

## G

### GPU

Graphics Processing Unit --- a specialized processor designed to accelerate graphics rendering. In ADL, direct GPU access is not available through proot, so the desktop environment relies on software rendering via the CPU, which is adequate for standard desktop tasks.

### GUI

Graphical User Interface --- a visual interface that allows users to interact with software through windows, icons, menus, and pointers. ADL provides a full GUI through the XFCE desktop environment, displayed via Termux:X11 or VNC.

## H

### Home Directory

The default personal directory for a user account, typically located at /home/username in Linux. In ADL, the home directory inside the proot environment is where your personal files, configuration files, and application settings are stored.

## K

### Kernel

The core component of an operating system that manages hardware resources and provides services to software. ADL does not include its own kernel --- it relies on the Android device's existing Linux kernel, with proot translating system calls between the Ubuntu userspace and the host kernel.

## L

### Latency

The delay between an input action and the corresponding response on screen. In ADL, latency can be noticeable in the desktop interface because of the overhead from proot's system call translation and software-based graphics rendering, though it remains acceptable for most productivity tasks.

## P

### Package

A bundled collection of files, metadata, and installation scripts that together provide a piece of software. In ADL, packages are distributed in the .deb format and installed through APT, just as they would be on a standard Ubuntu system.

### Package Manager

A tool that automates the process of installing, upgrading, configuring, and removing software packages. ADL uses APT as its package manager within the Ubuntu environment, providing access to thousands of prebuilt packages from Ubuntu's repositories.

### Path

The string that specifies the location of a file or directory in the filesystem hierarchy. In ADL, paths inside the proot environment appear as standard Linux paths (like /usr/bin) even though they are physically stored within Termux's private Android storage.

### Permission

A rule that determines what actions a user or process is allowed to perform on a file, directory, or system resource. In ADL, Linux file permissions work normally within the proot environment, though they are simulated by proot rather than enforced by the actual kernel.

### PID

Process Identifier --- a unique number assigned by the operating system to each running process. In ADL, PIDs inside the proot environment are translated by proot, which is why system managers like systemd (which require PID 1) cannot function.

### Port

A numbered endpoint for network communication that allows multiple services to run on a single IP address. In ADL, you can run servers on unprivileged ports (1024 and above), which are accessible from the device at localhost and from the local network using the device's IP address.

### Process

An instance of a running program, including its code, data, and system resources. In ADL, processes run within the proot environment and appear as child processes of Termux to the Android operating system.

### Proot

A userspace implementation of chroot, mount --bind, and binfmt_misc that runs without requiring root privileges. Proot is the core technology that makes ADL possible, translating system calls to allow an Ubuntu filesystem to operate on top of the Android kernel without any special permissions.

### PulseAudio

A sound server that manages audio input and output streams on Linux systems. In ADL, PulseAudio can be configured to route audio from Linux applications to Android's audio system, enabling sound playback from the desktop environment.

## R

### RAM

Random Access Memory --- the volatile memory used by the device to store data for running applications. In ADL, the available RAM is shared with Android and other running apps, typically leaving 50-70% of the device's total RAM for the Linux environment.

### Repository

A remote server that hosts a collection of software packages available for download and installation. ADL uses Ubuntu's official package repositories, giving you access to the same software catalog available on desktop Ubuntu installations.

### Resolution

The number of pixels displayed on screen, expressed as width by height. In ADL, the desktop resolution can be configured in Termux:X11 or VNC settings, and higher resolutions provide more screen space but may reduce performance due to the increased rendering workload.

### Root (Linux)

The superuser account in Linux with unrestricted access to all commands and files, identified as user ID 0. Inside ADL's proot environment, you operate as a "fake root" --- proot simulates root privileges for package installation and file operations, but no actual elevated privileges are granted on the host Android system.

### Root (Android)

The process of gaining superuser access to the Android operating system, bypassing manufacturer restrictions. ADL does not require Android root and should not be confused with it --- the "root" you see inside the Linux environment is simulated by proot and has no effect on the Android system.

## S

### Shell

A program that interprets commands typed by the user and passes them to the operating system for execution. In ADL, the default shell is Bash, and it serves as the primary interface for running commands, managing files, and launching applications within the Linux environment.

### SSH

Secure Shell --- a network protocol for encrypted remote access to a computer's command line. In ADL, you can install and run an SSH server to access your Linux environment remotely from another device, or use the SSH client to connect to remote servers.

### Storage

The persistent memory on a device used to store files, applications, and data. ADL's files reside in Termux's private storage allocation, and the total space available depends on your device's internal storage or SD card capacity.

### Sudo

A command that allows a permitted user to execute a command as the superuser. In ADL's proot environment, sudo works through proot's fake root simulation --- it grants apparent root-level access within the Linux environment without any actual privilege escalation on the Android system.

### Swap

A portion of storage used as an extension of RAM when physical memory is full. ADL does not have access to swap by default because Android manages memory at the kernel level, though some users create swap files within the proot environment for marginal benefit on memory-constrained devices.

## T

### Terminal

A text-based interface for entering commands and viewing output. In ADL, the terminal is your primary tool for system setup, launching the desktop, installing packages, and performing any tasks that require command-line access.

### Terminal Emulator

An application that provides a terminal interface within a graphical environment. Termux serves as the terminal emulator on the Android side, while applications like xfce4-terminal provide terminal access within the ADL Linux desktop environment.

### Termux

An Android application that provides a Linux command-line environment and package manager without requiring root access. Termux is the foundation of ADL, providing the base environment in which proot and Ubuntu are installed and run.

### Termux:X11

A companion Android application for Termux that provides a native X11 display server. Termux:X11 renders the Linux desktop directly on Android's display system, offering significantly better performance and lower latency compared to VNC-based display solutions.

## U

### Ubuntu

A popular Linux distribution based on Debian, known for its extensive software repositories and community support. ADL's guides install Ubuntu inside the proot environment, giving you access to a familiar and well-documented Linux system with thousands of available packages.

### USB-C

A reversible connector standard used for charging, data transfer, and video output on modern devices. In ADL, USB-C connections enable the use of external displays, keyboards, mice, and hubs, which can transform a phone or tablet into a more desktop-like workstation.

## V

### VNC

Virtual Network Computing --- a protocol for remotely viewing and controlling a desktop environment. In ADL, VNC is one of two methods for displaying the Linux desktop, using a VNC server inside the Linux environment and a VNC viewer app on Android to render the graphical interface.

## W

### Wayland

A modern display server protocol designed as a replacement for X11 with improved security and performance. Wayland support in ADL is experimental and limited because most Wayland compositors require direct kernel mode-setting access that is not available through proot.

### Window Manager

A program that controls the placement, appearance, and behavior of application windows on the desktop. In ADL, XFCE includes its own window manager (xfwm4) that handles window borders, title bars, resizing, and workspace management within the Linux desktop.

## X

### XFCE

A lightweight, modular desktop environment for Linux that prioritizes performance and low resource usage. XFCE is the recommended desktop environment for ADL because its modest CPU and memory requirements make it well-suited to running on mobile hardware through proot.

### X11

The X Window System --- a display protocol that provides the foundation for graphical interfaces on Unix-like operating systems. In ADL, X11 is the protocol used by Termux:X11 to transmit the Linux desktop's graphical output to the Android display, enabling full desktop interaction with keyboard and pointer input.
