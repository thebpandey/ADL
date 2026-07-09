---
sidebar_position: 3
title: "Peripherals"
description: "Setting up keyboards, mice, monitors, and audio devices for your ADL desktop experience."
---

# Peripherals

Your ADL desktop experience depends on the peripherals you connect. A good keyboard, a responsive mouse, a properly configured monitor, and reliable audio make the difference between a usable workstation and a frustrating one.

This page covers how to set up and optimize each type of peripheral for use with your Android phone running ADL.

## Bluetooth Keyboards

A Bluetooth keyboard is the most convenient input option for ADL. No cables, no adapters — just pair and type.

### Pairing a Bluetooth Keyboard

1. Put your keyboard into **pairing mode** (usually by holding a Bluetooth button until an LED flashes)
2. On your phone, open **Settings > Connected devices > Pair new device**
3. Select your keyboard from the list of available devices
4. Type the pairing code shown on screen and press Enter
5. The keyboard connects and is ready to use

<Tip>
Multi-device Bluetooth keyboards let you pair with your phone, tablet, and computer simultaneously and switch between them with a dedicated key. This is ideal if you use ADL alongside other devices on the same desk.
</Tip>

### Keyboard Layout Considerations

Android defaults to a US keyboard layout. If you use a different layout, you need to configure it:

1. Open **Settings > System > Languages & input > Physical keyboard**
2. Select your keyboard from the list
3. Choose the correct layout (QWERTY, AZERTY, QWERTZ, etc.)

<Note title="Layout in Linux">
The keyboard layout you set in Android applies to the Linux desktop as well in most ADL configurations. If the layout is wrong inside Linux, you can override it using the desktop environment's keyboard settings or by running `setxkbmap` with your layout code.
</Note>

### Function Keys and Media Keys

| Key | Behavior in ADL |
|---|---|
| F1-F12 | Work as standard function keys in Linux applications |
| Volume Up/Down | Controls Android system volume |
| Play/Pause/Skip | Controls the active Android media player |
| Brightness keys | Adjusts phone screen brightness (not external monitor) |
| Print Screen | Triggers Android screenshot |
| Ctrl+C, Ctrl+V, etc. | Standard shortcuts work in Linux and Android apps |

<PerformanceNote>
Bluetooth keyboards add a small amount of input latency compared to wired USB keyboards. For typing and general use, this is not noticeable. If you do work that requires precise timing (like certain terminal-based games), a wired USB keyboard through your hub eliminates this latency.
</PerformanceNote>

## Bluetooth Mice

A Bluetooth mouse gives you precise pointer control on your external monitor. Android has built-in mouse support, and it extends seamlessly into the Linux desktop.

### Pairing a Bluetooth Mouse

1. Put your mouse into **pairing mode** (check the bottom of the mouse for a pairing button)
2. On your phone, open **Settings > Connected devices > Pair new device**
3. Select your mouse from the list
4. The mouse connects — you should see a cursor appear on screen

### Pointer Configuration

After pairing, adjust these settings to match your preferences:

- **Pointer speed** — go to **Settings > System > Languages & input > Pointer speed** and adjust the slider
- **Scroll direction** — Android uses natural (reverse) scrolling by default; this can be changed in the Linux desktop environment's mouse settings
- **Button mapping** — left and right click work out of the box; additional buttons may need configuration in the Linux desktop settings

### DPI Considerations

Higher-DPI mice are more responsive but may feel too fast at default settings. If your mouse has adjustable DPI (often via a button on the mouse itself), start at 800-1200 DPI for a good balance on a 1080p monitor. On higher-resolution monitors, 1600 DPI or above feels more natural.

<BestPractice>
Set your mouse DPI to a comfortable level on the hardware first, then fine-tune pointer speed in Android and Linux settings. This gives you the most precise control without excessive cursor acceleration.
</BestPractice>

## Monitors

Your external monitor is the centerpiece of the ADL desktop experience. The right monitor makes everything more comfortable and productive.

### Resolution Support

| Resolution | Experience with ADL |
|---|---|
| 1080p (1920x1080) | Best compatibility, smooth performance on all supported phones |
| 1440p (2560x1440) | Sharp text, good performance on flagship phones |
| 4K (3840x2160) | Very sharp but demanding — may run at 30Hz on some phones, UI elements can be very small |
| Ultrawide (2560x1080) | Works if your phone supports the resolution; check compatibility |

<Warning title="4K limitations">
Many phones cap video output at 1080p or 1440p regardless of the monitor's native resolution. Even phones that support 4K output may default to 30Hz at that resolution, which makes cursor movement and window dragging feel sluggish. For most ADL users, a 1080p or 1440p monitor provides the best experience.
</Warning>

### Refresh Rate

Most phone video output is limited to **60Hz**. Buying a 120Hz or 144Hz monitor will not improve your ADL experience — the phone will still output at 60Hz. Save your budget for better resolution or screen quality instead.

### HDR Support

Android supports HDR output on some flagship phones, but Linux applications running in ADL generally do not take advantage of it. HDR is not a priority feature when choosing a monitor for ADL.

### Portable vs Desktop Monitors

<Decision question="Which monitor type suits your ADL setup?" options={[
  {
    label: "Portable USB-C monitor (13-17 inches)",
    description: "Lightweight, powered by your phone or hub, easy to travel with. Lower resolution options are more affordable. Great if you use ADL in multiple locations.",
    recommended: false
  },
  {
    label: "Desktop monitor (22-27 inches)",
    description: "Larger screen, better ergonomics for long sessions, higher resolution options, requires a dedicated desk space. Best for a permanent ADL workstation.",
    recommended: true
  }
]} />

### Connecting Your Monitor

You have two options for connecting a monitor:

1. **Through a USB-C hub** — the hub converts the USB-C signal to HDMI. This is the most common setup and lets you charge your phone and connect peripherals simultaneously.
2. **Direct USB-C connection** — if your monitor has a USB-C input with DisplayPort support, you can connect your phone directly. Some USB-C monitors also provide power to your phone, eliminating the need for a hub.

<Tip>
A USB-C monitor that provides power delivery can replace both your hub and your charger for a single-cable setup. Check that the monitor provides at least 45W of power to connected devices.
</Tip>

## Audio Output

ADL supports multiple audio output methods. Your choice depends on your setup and preferences.

### Bluetooth Audio

Bluetooth headphones and speakers pair with your phone like any other Bluetooth device. Audio from both Android and the Linux desktop routes through the active Bluetooth audio device.

1. Put your headphones/speaker into **pairing mode**
2. Open **Settings > Connected devices > Pair new device**
3. Select the device and confirm pairing

<Note title="Audio routing">
By default, Android routes all audio — including audio from the Linux desktop — to whatever output device is active (phone speaker, Bluetooth device, or wired output). If you hear audio from the wrong device, check **Settings > Sound** and select the correct output.
</Note>

### Wired Audio Through a Hub

Some USB-C hubs include a 3.5mm headphone jack. Wired audio has no latency and provides consistent quality, making it a good choice for video calls or media playback.

### Audio Codec Considerations

| Bluetooth Codec | Latency | Quality | Availability |
|---|---|---|---|
| SBC | Higher | Basic | All Bluetooth audio devices |
| AAC | Moderate | Good | Most modern devices |
| aptX / aptX HD | Low | High | Selected Android phones and headphones |
| LDAC | Low | Highest | Sony and selected devices |

<PerformanceNote>
Bluetooth audio adds latency that can cause audio-video sync issues during video playback. If you notice this, switch to a low-latency codec (aptX) in your phone's Bluetooth settings under developer options, or use wired audio for latency-sensitive work.
</PerformanceNote>

## Tips for the Best Peripheral Experience

<CollapsibleSection title="Optimizing your peripheral setup">

- **Charge your peripherals** before long sessions — a dead keyboard mid-workflow is disruptive
- **Keep firmware updated** — keyboard and mouse firmware updates often fix connectivity issues
- **Reduce Bluetooth interference** — keep your phone within 1-2 meters of Bluetooth peripherals and away from Wi-Fi routers operating on 2.4GHz
- **Use a mousepad** — optical and laser mice track better on a consistent surface
- **Set up keyboard shortcuts** in your Linux desktop environment to speed up common tasks
- **Disable phone screen** when using the external monitor to save battery — some desktop modes do this automatically
- **Test everything together** before committing to a permanent setup — some combinations of hub, monitor, and peripherals can cause power or bandwidth conflicts

</CollapsibleSection>

## Troubleshooting

<Troubleshooting items={[
  {
    problem: "Bluetooth keyboard will not pair",
    solution: "Confirm the keyboard is in pairing mode (LED should be flashing). Remove any existing pairing for this keyboard in Settings > Connected devices and try again. If it still fails, restart Bluetooth on your phone by toggling it off and on. Some keyboards require you to hold the pairing button for 5+ seconds."
  },
  {
    problem: "Mouse cursor lags or jumps",
    solution: "Bluetooth interference is the most common cause. Move your phone closer to the mouse, and move away from other 2.4GHz devices (Wi-Fi routers, microwaves). If using a hub, try plugging in a wired USB mouse to confirm the issue is Bluetooth-related. Lowering the mouse DPI can also help on lower-powered phones."
  },
  {
    problem: "Monitor flickers or shows artifacts",
    solution: "Replace your USB-C cable with a higher-quality one (USB 3.1 Gen 2 or Thunderbolt). If the problem persists, lower the output resolution in your display settings. Flickering can also result from an overheating hub — ensure it has adequate ventilation."
  },
  {
    problem: "Audio crackles or cuts out over Bluetooth",
    solution: "Move closer to your phone to strengthen the Bluetooth connection. Switch to the SBC codec if you are using aptX or LDAC, as some phones handle the simpler codec more reliably under CPU load. Closing unnecessary Android apps can also free up resources for stable Bluetooth audio."
  },
  {
    problem: "Keyboard types wrong characters",
    solution: "Your physical keyboard layout does not match what Android expects. Go to Settings > System > Languages & input > Physical keyboard, select your keyboard, and choose the correct layout. Inside Linux, run setxkbmap with your layout code if the Android setting does not carry over."
  },
  {
    problem: "No audio from the Linux desktop",
    solution: "Audio from the Linux desktop routes through Android's audio system. Check that your phone's volume is up and that the correct output device is selected in Settings > Sound. Inside the Linux desktop, verify PulseAudio is running and the correct sink is selected."
  }
]} />

## Next Steps

- Choose and configure a [USB-C hub](/docs/learn/hardware/usb-c-hubs) to connect everything together
- Review the [recommended setup](/docs/learn/hardware/recommended-setup) for a complete hardware list

<FAQ items={[
  {
    question: "Can I use wired USB peripherals instead of Bluetooth?",
    answer: "Yes. Connect wired USB keyboards and mice through your USB-C hub's USB-A ports. Wired peripherals have zero latency and do not need batteries or pairing. The trade-off is cable clutter and using hub ports that could serve other devices."
  },
  {
    question: "Do gaming peripherals work with ADL?",
    answer: "Basic functions (typing, clicking, scrolling) work with any USB or Bluetooth peripheral. Advanced features like programmable macro buttons, RGB lighting control, and high polling rates may not work as expected because these rely on manufacturer-specific software that is typically only available on Windows."
  },
  {
    question: "Can I use two monitors with ADL?",
    answer: "This depends on your phone and hub. Most phones support only a single external display. Some Samsung DeX-compatible phones and specialized docking stations support dual monitors, but this is not common. For most ADL users, a single monitor is the practical setup."
  },
  {
    question: "Will any Bluetooth keyboard work?",
    answer: "Any standard Bluetooth keyboard will pair with Android and work with ADL. Keyboards with proprietary wireless dongles (non-Bluetooth RF) will work only if plugged into a USB-A port on your hub. Bluetooth Low Energy (BLE) keyboards are supported on Android 8.0 and later."
  }
]} />
