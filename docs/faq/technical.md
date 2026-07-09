---
sidebar_position: 2
title: "Technical FAQ"
description: "Technical frequently asked questions about ADL --- kernel, Docker, GPU, systemd, and other advanced topics."
---

# Technical FAQ

In-depth answers to common technical questions about ADL's architecture, capabilities, and limitations.

<FAQ items={[
  {
    question: "What Linux kernel version does it use?",
    answer: "ADL does not ship or run its own Linux kernel. Instead, it uses the Linux kernel that is already built into your Android device's firmware. Proot translates system calls from the Ubuntu userspace to the host Android kernel, so your kernel version matches whatever your device manufacturer shipped. You can check it by running 'uname -r' inside the proot environment."
  },
  {
    question: "Can I use Docker?",
    answer: "No, Docker cannot run inside ADL's proot environment. Docker requires direct access to kernel features such as cgroups, namespaces, and overlay filesystems, none of which are available through proot's system call translation layer. For containerized workflows, consider using chroot-based alternatives or running services directly. Podman in rootless mode also does not work, as it has similar kernel dependencies."
  },
  {
    question: "Can I compile code?",
    answer: "Yes, compiling code works well in ADL. You can install gcc, g++, clang, make, cmake, and other build tools through APT just as you would on a regular Ubuntu system. Languages like C, C++, Rust, Go, Python, and Java all compile and run natively on ARM. Compilation speeds depend on your device's CPU and available RAM, but most projects build without issues."
  },
  {
    question: "Does GPU acceleration work?",
    answer: "GPU acceleration is limited in ADL. By default, the desktop environment uses software rendering through Mesa's llvmpipe driver, which handles basic desktop compositing adequately on modern devices. Hardware-accelerated OpenGL is not available through proot because it cannot access the device's GPU drivers directly. VirGL is an experimental option that provides partial GPU acceleration on some devices, but it is not stable for all hardware configurations."
  },
  {
    question: "Can I run servers?",
    answer: "Yes, you can run web servers, databases, and other network services inside ADL. Apache, Nginx, PostgreSQL, MySQL, Redis, and Node.js all work as expected. The main restriction is that you cannot bind to privileged ports below 1024 without root, so use ports like 3000, 5432, or 8080 instead. Services are accessible from the device itself at localhost, and from other devices on the same network using your phone's IP address."
  },
  {
    question: "Can I use systemd?",
    answer: "No, systemd cannot run inside ADL because it requires PID 1 status and direct kernel control, neither of which proot can provide. For managing services, you can start processes manually, use shell scripts, or use lightweight alternatives like runit or supervisor. The 'sysvinit' init scripts and 'service' command also do not function, so launch daemons directly from the command line."
  },
  {
    question: "What about SELinux?",
    answer: "Android's SELinux policies operate at the kernel level and enforce security on the host system, but they do not directly interfere with processes running inside the proot environment. Proot translates system calls before they reach the kernel, effectively abstracting away most SELinux restrictions for the guest userspace. In practice, you will not encounter SELinux denials inside your Ubuntu environment, though certain low-level operations may still be blocked by Android's security model."
  },
  {
    question: "Can I access USB devices?",
    answer: "Direct USB passthrough is not available in ADL's proot environment because access to /dev entries for USB hardware requires kernel-level permissions that proot cannot grant. You cannot directly use USB serial adapters, Arduino boards, or other USB peripherals from within the Linux environment. However, files on USB storage can be accessed if you mount the drive through Android and share it with Termux via termux-setup-storage."
  },
  {
    question: "What is the maximum RAM available?",
    answer: "The amount of RAM available to ADL depends on your device's total RAM and what Android allocates to the Termux process. Typically, Android makes 50-70% of total RAM available to foreground applications, so a device with 8 GB of RAM might provide 4-5 GB to ADL. Android's low-memory killer may terminate Termux if the system is under heavy memory pressure from other apps, so closing background Android apps can improve stability."
  },
  {
    question: "Can I use Bluetooth from Linux?",
    answer: "No, Bluetooth hardware is managed entirely by Android and is not accessible from within the proot environment. Linux Bluetooth tools like bluetoothctl and bluez cannot interface with the device's Bluetooth adapter. However, Bluetooth peripherals like keyboards and mice that are paired through Android work seamlessly with ADL, since Android handles the input layer and forwards events to all running applications including Termux."
  },
  {
    question: "Can I run 32-bit applications?",
    answer: "This depends on your device's architecture and Android version. Most modern ARM64 devices include multilib support that allows 32-bit ARM binaries to execute alongside 64-bit ones, and you can install the necessary 32-bit libraries through APT's multiarch support. However, some newer devices and Android versions have dropped 32-bit support entirely. Test with 'dpkg --print-architecture' and 'dpkg --print-foreign-architectures' to check what your environment supports."
  },
  {
    question: "What architectures are supported?",
    answer: "ADL primarily supports ARM64 (aarch64), which is the architecture used by virtually all modern Android smartphones and tablets. ARM32 (armhf/armv7l) is also supported for older devices, though the available software and performance may be more limited. x86 and x86_64 Android devices are rare but can also run ADL, with the added benefit that more prebuilt Linux packages are available for those architectures."
  },
  {
    question: "Can I use snap or flatpak?",
    answer: "No, neither snap nor flatpak works in ADL's proot environment. Snap requires systemd and snapd, along with kernel features like squashfs mounts and AppArmor confinement. Flatpak depends on bubblewrap sandboxing and system-level D-Bus services. Both package managers expect a level of kernel and init system control that proot cannot provide. Install software through APT, build from source, or use AppImage where compatible."
  },
  {
    question: "Can I access the Android filesystem?",
    answer: "Yes, you can access shared storage on your Android device from within ADL by running 'termux-setup-storage' in Termux before launching the proot environment. This creates symlinks in your Termux home directory pointing to Android's shared directories such as Downloads, DCIM, Music, and Documents. Files placed in these shared directories are visible to both Android apps and the Linux environment, making it easy to transfer files between the two systems."
  }
]} />
