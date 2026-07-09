---
sidebar_position: 1
title: "General FAQ"
description: "Frequently asked questions about ADL --- what it is, whether it is safe, and what to expect."
---

# General FAQ

Common questions about ADL, covering safety, compatibility, and everyday usage.

<FAQ items={[
  {
    question: "Is ADL free?",
    answer: "Yes, ADL is completely free and open source. All of its components --- Termux, proot, Ubuntu, and XFCE --- are free software distributed under open-source licenses. There are no hidden fees, subscriptions, or premium tiers."
  },
  {
    question: "Will it void my warranty?",
    answer: "No, ADL does not void your device warranty. It runs entirely within the Android application sandbox and makes no modifications to your system partition, bootloader, or firmware. From your device manufacturer's perspective, it is just another app running on your phone."
  },
  {
    question: "Does it need root access?",
    answer: "No, ADL does not require root access on your Android device. It runs entirely in userspace using proot, which translates system calls without needing elevated privileges. This is one of the key advantages of ADL over other Linux-on-Android approaches."
  },
  {
    question: "Is it safe to use?",
    answer: "Yes, ADL is safe to use. The Linux environment runs sandboxed within Android's application security model, meaning it cannot access or modify your Android system. All processes are confined to Termux's private directory, and the proot layer provides an additional boundary between the Linux environment and your device."
  },
  {
    question: "Will it slow down my phone?",
    answer: "ADL only uses system resources while it is actively running. When you close the Termux session and stop the desktop environment, all Linux processes terminate and free their memory. There are no background services, daemons, or startup hooks that persist after you stop ADL, so your phone returns to its normal performance immediately."
  },
  {
    question: "Can I use it as a daily driver?",
    answer: "Yes, many users rely on ADL daily for tasks like web browsing, document editing, coding, and running development servers. However, hardware-accelerated graphics, certain peripherals, and performance-intensive workloads like video editing may not match a native desktop experience. For productivity and development work, it is a capable and practical setup."
  },
  {
    question: "Does it work on tablets?",
    answer: "Yes, and tablets often provide a better experience than phones thanks to their larger screens. When paired with a Bluetooth keyboard and mouse, a tablet running ADL can function much like a lightweight laptop. Samsung DeX mode on Galaxy tablets further enhances the experience by providing a desktop-style window for Termux:X11."
  },
  {
    question: "Can I run Windows programs?",
    answer: "Not directly, as ADL runs a Linux environment on ARM hardware. However, some Windows applications can run through Wine combined with Box86 or Box64, which translate x86 instructions to ARM. Compatibility varies significantly by application, and performance will be slower than native execution. Simple applications and older software tend to work best."
  },
  {
    question: "How is this different from a virtual machine?",
    answer: "ADL uses proot to translate filesystem and system call paths rather than emulating or virtualizing an entire operating system. This means there is no separate kernel, no hardware emulation overhead, and no need for virtualization support in your device's firmware. The tradeoff is that some kernel-level features like Docker, systemd, and raw device access are unavailable, but general application performance is very close to native."
  },
  {
    question: "Can I dual-boot Android and Linux?",
    answer: "ADL is not a dual-boot solution --- it runs Linux alongside Android simultaneously. You do not need to reboot or switch between operating systems. Android continues to operate normally in the background while you use the Linux desktop, and you can switch between the two freely at any time."
  },
  {
    question: "Does it work offline?",
    answer: "After the initial setup, which requires an internet connection to download packages, most ADL functionality works offline. You can use installed applications, edit files, write code, and work with local tools without any network connection. Only tasks that inherently require the internet, like browsing the web or installing new packages, need connectivity."
  },
  {
    question: "Can I make phone calls while using ADL?",
    answer: "Yes, all Android functions continue working normally while ADL is running. You can receive and make phone calls, send text messages, and use any Android app as usual. The Linux desktop runs as a separate layer and does not interfere with Android's telephony or notification systems."
  },
  {
    question: "What happens if I restart my phone?",
    answer: "After a phone restart, you will need to reopen Termux and relaunch the Ubuntu environment and desktop session. Your files, installed applications, and configurations are preserved across reboots --- only the running processes are stopped. Starting the desktop again typically takes just a few seconds once you know the commands."
  },
  {
    question: "Can multiple users use it?",
    answer: "ADL supports one Linux user per Termux installation. While you can create additional Linux user accounts inside the proot environment, Termux itself is tied to a single Android user profile. If multiple people share a device with separate Android user profiles, each profile would need its own Termux installation."
  },
  {
    question: "Is my data safe?",
    answer: "Your data within ADL lives in Termux's private storage area, which is protected by Android's application sandboxing. Other Android apps cannot access these files without explicit permission. However, you should still maintain backups of important data, as uninstalling Termux will permanently delete all files stored within it."
  },
  {
    question: "What Android version do I need?",
    answer: "ADL requires Android 7.0 (Nougat) or higher. Newer Android versions generally provide a better experience with improved memory management and process handling. Most devices sold since 2017 meet this requirement. For the best experience, Android 10 or higher is recommended."
  },
  {
    question: "How much storage does it need?",
    answer: "The minimum storage requirement is approximately 4 GB, which covers Termux, the Ubuntu base system, and the XFCE desktop environment. For practical use with additional applications, development tools, and user files, 8 GB or more of free storage is recommended. A full development environment with compilers, editors, and libraries can use 10-15 GB."
  },
  {
    question: "Can I uninstall it completely?",
    answer: "Yes, uninstalling the Termux app from Android removes everything --- the Ubuntu environment, all installed Linux packages, your files, and all configurations. There are no leftover files, registry entries, or system modifications. If you used termux-setup-storage, the shared folders in your Android storage are not deleted, but no Linux-specific files remain there."
  }
]} />
