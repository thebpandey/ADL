---
sidebar_position: 2
title: "DeX Optimization"
description: "Optimize resolution, performance, keyboard shortcuts, and compositor settings for the best ADL experience on Samsung DeX."
---

# DeX Optimization

A basic DeX setup gets your Linux desktop onto an external monitor. This page covers the adjustments that make it feel like a proper workstation -- correct resolution, efficient keyboard shortcuts, compositor tuning, and touchpad configuration. These optimizations are not required, but each one noticeably improves the day-to-day experience.

## Resolution Settings

### Finding Your Monitor's Native Resolution

Before changing anything, check what resolutions are available:

<CopyCommand command="xrandr --query" />

This lists every connected output and its supported modes. Look for the line with a `+` marker -- that is the monitor's preferred (native) resolution. You want to match it.

### Setting the Resolution

For a standard 1080p monitor:

<CopyCommand command="xrandr --output HDMI-1 --mode 1920x1080 --rate 60" />

For a 1440p monitor:

<CopyCommand command="xrandr --output HDMI-1 --mode 2560x1440 --rate 60" />

<Note>
The output name may not always be `HDMI-1`. Check the output of `xrandr --query` for the actual name. Common names include `HDMI-1`, `DP-1`, `VGA-1`, or `Virtual-1` depending on how Termux:X11 reports the display.
</Note>

### Adding a Custom Resolution

If your desired resolution is not listed in xrandr's output, you can add it manually. First, generate the modeline:

<CopyCommand command="cvt 1920 1200 60" />

This outputs something like:

```
Modeline "1920x1200_60.00" 193.25 1920 2056 2256 2592 1200 1203 1209 1245 -hsync +vsync
```

Use the values after `Modeline` to create and add the mode:

<CopyCommand command='xrandr --newmode "1920x1200_60.00" 193.25 1920 2056 2256 2592 1200 1203 1209 1245 -hsync +vsync' />

<CopyCommand command='xrandr --addmode HDMI-1 "1920x1200_60.00"' />

<CopyCommand command='xrandr --output HDMI-1 --mode "1920x1200_60.00"' />

<Tip>
To make a custom resolution persist across sessions, add the `xrandr --newmode`, `xrandr --addmode`, and `xrandr --output` commands to your `~/.xprofile` or the end of your `~/start-desktop.sh` script.
</Tip>

### Making Resolution Persistent

Resolution changes made with xrandr do not survive a restart. To apply your preferred resolution automatically every time the desktop starts, create or edit `~/.xprofile`:

<CopyCommand command='echo "xrandr --output HDMI-1 --mode 1920x1080 --rate 60" >> ~/.xprofile' />

<BestPractice>
Keep your `.xprofile` simple. It runs every time the X session starts, so limit it to display configuration and environment variables. Do not put long-running processes in it.
</BestPractice>

## Multi-Window Layout Tips

DeX supports windowed mode for Android apps, and XFCE has its own window management within the Termux:X11 window. Understanding how these layers interact helps you use screen space efficiently.

### Maximizing Termux:X11

For the best Linux desktop experience, maximize the Termux:X11 window on the external display so XFCE fills the entire screen. Double-click the title bar or use the maximize button in DeX.

### XFCE Window Tiling

XFCE does not have built-in tiling, but you can snap windows to half the screen using keyboard shortcuts:

<CopyCommand command="xfconf-query -c xfce4-keyboard-shortcuts -p '/commands/custom/<Super>Left' -n -t string -s 'xfce4-tile-left'" />

<CopyCommand command="xfconf-query -c xfce4-keyboard-shortcuts -p '/commands/custom/<Super>Right' -n -t string -s 'xfce4-tile-right'" />

If those tile commands are not available, you can achieve the same result with `wmctrl`:

<CopyCommand command="sudo apt install wmctrl" />

Then create tiling scripts. To tile the active window to the left half of a 1920x1080 screen:

<CopyCommand command="wmctrl -r :ACTIVE: -e 0,0,0,960,1080" />

To tile to the right half:

<CopyCommand command="wmctrl -r :ACTIVE: -e 0,960,0,960,1080" />

<PerformanceNote>
Running multiple graphical applications simultaneously (a browser, code editor, and terminal) is entirely feasible on modern Galaxy devices with 8GB or more of RAM. On devices with 4-6GB, you may notice slowdowns if you have too many heavy applications open alongside Android apps. Close unused Android apps in the DeX taskbar to free memory for your Linux session.
</PerformanceNote>

## Keyboard Shortcuts for XFCE on DeX

DeX intercepts certain key combinations before they reach XFCE. This means some default XFCE shortcuts do not work, and you need to either remap them or use alternatives.

### Shortcuts That Conflict with DeX

| Shortcut | DeX Action | XFCE Action |
|---|---|---|
| **Alt+Tab** | DeX app switcher | XFCE window switcher |
| **Alt+F4** | Close DeX window | Close XFCE window |
| **Super (Win key)** | DeX app menu | XFCE application menu |
| **Alt+F2** | DeX search | XFCE application finder |

### Remapping Conflicting Shortcuts

Since DeX claims Alt+Tab, remap the XFCE window switcher to a different key combination:

<CopyCommand command="xfconf-query -c xfce4-keyboard-shortcuts -p '/xfwm4/custom/<Super>Tab' -n -t string -s 'cycle_windows_key'" />

Remap the application menu to avoid the Super key conflict:

<CopyCommand command="xfconf-query -c xfce4-keyboard-shortcuts -p '/commands/custom/<Ctrl><Super>space' -n -t string -s 'xfce4-popup-whiskermenu'" />

<Tip>
A practical approach is to use Ctrl+Super as your modifier prefix for all XFCE shortcuts when running under DeX. This avoids every DeX conflict since DeX does not intercept three-key combinations that include both Ctrl and Super.
</Tip>

### Useful XFCE Shortcuts (DeX-Safe)

These shortcuts work without conflicting with DeX:

| Shortcut | Action |
|---|---|
| **Ctrl+Alt+T** | Open terminal |
| **Ctrl+Alt+D** | Show desktop |
| **Ctrl+Alt+Del** | Lock screen |
| **Super+D** | Minimize all windows |
| **Super+L** | Lock screen |
| **Super+E** | Open file manager |

To add a custom shortcut, use xfconf-query:

<CopyCommand command="xfconf-query -c xfce4-keyboard-shortcuts -p '/commands/custom/<Ctrl><Alt>b' -n -t string -s 'firefox'" />

This binds Ctrl+Alt+B to launch Firefox. Replace `firefox` with any command you want to bind.

## Touchpad and Input Configuration

When DeX is active, your phone screen can serve as a touchpad. This works for basic pointing and clicking, but the default sensitivity and gesture support may need adjustment.

### Adjusting Touchpad Sensitivity

If the cursor moves too fast or too slow when using your phone as a touchpad in DeX, adjust it through Samsung's DeX settings:

1. Open **Settings > Connected devices > Samsung DeX > Mouse/Trackpad**
2. Adjust the pointer speed slider

For finer control within XFCE, use xinput:

<CopyCommand command="xinput list" />

Find your pointing device in the list, then adjust its speed (replace `<device-id>` with the actual ID number):

<CopyCommand command="xinput set-prop <device-id> 'libinput Accel Speed' 0.5" />

Values range from -1.0 (slowest) to 1.0 (fastest). Start at 0.0 and adjust up or down.

### Configuring an External Touchpad

If you use a standalone Bluetooth touchpad, you can enable tap-to-click and natural scrolling:

<CopyCommand command="xinput set-prop <device-id> 'libinput Tapping Enabled' 1" />

<CopyCommand command="xinput set-prop <device-id> 'libinput Natural Scrolling Enabled' 1" />

<Note>
Gesture support (three-finger swipe, pinch-to-zoom) depends on the touchpad hardware and driver support within the proot environment. Most basic gestures work, but multi-finger gestures beyond three fingers are unreliable. For reliable gesture support, use a USB mouse with a scroll wheel instead.
</Note>

## Performance Tuning

### Compositor Settings

The XFCE compositor (the component that handles window transparency, shadows, and animations) has a measurable impact on performance. On a phone driving an external display, every frame matters.

To check if the compositor is currently enabled:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/use_compositing" />

To disable the compositor entirely for maximum performance:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/use_compositing -s false" />

To re-enable it:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/use_compositing -s true" />

<PerformanceNote>
Disabling the compositor improves frame delivery by 15-25% in graphical applications like browsers and code editors. The trade-off is the loss of window shadows, transparency effects, and smooth window dragging animations. For a productivity-focused workstation, this trade-off is almost always worth it.
</PerformanceNote>

If you want to keep the compositor but reduce its overhead, disable specific effects:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/show_frame_shadow -s false" />

<CopyCommand command="xfconf-query -c xfwm4 -p /general/show_popup_shadow -s false" />

<CopyCommand command="xfconf-query -c xfwm4 -p /general/frame_opacity -s 100" />

This keeps basic compositing (which prevents screen tearing) while eliminating the expensive shadow and transparency rendering.

### Render Options

XFCE's window manager can use different rendering backends. Force software rendering if you experience graphical glitches:

<CopyCommand command="export LIBGL_ALWAYS_SOFTWARE=1" />

Add this to your `~/.xprofile` to make it permanent:

<CopyCommand command='echo "export LIBGL_ALWAYS_SOFTWARE=1" >> ~/.xprofile' />

<BestPractice>
Only use software rendering as a fallback. Hardware-accelerated rendering (the default) is significantly faster when it works correctly. Switch to software rendering only if you see visual corruption, flickering, or application crashes related to OpenGL.
</BestPractice>

### Reducing Memory Pressure

When running XFCE through DeX, both Android and Linux compete for the same pool of RAM. Keep your Linux session responsive by managing memory:

Check current memory usage:

<CopyCommand command="free -h" />

See what is consuming the most memory:

<CopyCommand command="ps aux --sort=-%mem | head -20" />

<Tip>
Close Android apps you are not actively using. DeX keeps recently used apps in memory, which directly reduces the RAM available to your Linux session. Swipe them away from the DeX recent apps view to free memory.
</Tip>

### Disabling Unnecessary XFCE Services

Some XFCE background services consume resources without adding value in a DeX setup:

Disable the screen saver daemon (your phone handles locking):

<CopyCommand command="xfconf-query -c xfce4-session -p /startup/screensaver/enabled -n -t bool -s false" />

Disable the power manager (battery is managed by Android, not Linux):

<CopyCommand command="xfce4-power-manager --quit" />

<PerformanceNote>
Each disabled background service frees 10-30MB of RAM and eliminates periodic CPU wakeups. On a device with limited resources, these small savings add up. Disable anything that duplicates functionality already handled by Android.
</PerformanceNote>

## Recommended Optimization Sequence

If you are setting up a new DeX workstation, apply these optimizations in order:

1. Set the correct resolution with xrandr to match your monitor
2. Disable the compositor or at least disable shadows
3. Remap conflicting keyboard shortcuts (Alt+Tab especially)
4. Close unnecessary Android apps to free RAM
5. Add your xrandr and environment settings to `~/.xprofile` so they persist
6. Disable XFCE services that duplicate Android functionality

<BestPractice>
Apply one change at a time and test. If something breaks your display or input, you can identify which change caused it. Applying all optimizations at once makes debugging difficult.
</BestPractice>

## Next Steps

- [Accessories](/docs/samsung/accessories) -- hardware recommendations for building a complete DeX workstation
- [DeX Overview](/docs/samsung/dex-overview) -- if you skipped it, go back for the fundamentals of wired vs. wireless DeX
