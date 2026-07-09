---
sidebar_position: 2
title: "XFCE"
description: "Deep dive into XFCE configuration, customization, and optimization for ADL on Android devices."
---

# XFCE

XFCE is the default desktop environment for ADL. It hits the right balance between resource efficiency and a complete feature set, making it the best choice for running a Linux desktop inside proot on Android hardware.

For background on what XFCE is and how it compares to other desktop environments, see [What is XFCE?](/docs/learn/concepts/what-is-xfce).

## Why XFCE is the Default

XFCE was chosen as the ADL default for several practical reasons:

- **Low resource usage** --- runs comfortably in 180-250 MB of RAM, leaving room for applications on memory-constrained Android devices
- **GTK3-based** --- supports modern themes and HiDPI scaling without needing a legacy compatibility layer
- **Highly configurable panels** --- critical for adapting the interface to phone screens, tablets, and external monitors
- **Stable compositing** --- xfwm4's built-in compositor provides window shadows and transparency without additional software
- **Large ecosystem** --- more themes, plugins, and community support than any other lightweight DE
- **Tested in proot** --- XFCE runs reliably in the proot environment with minimal workarounds

## Panel Configuration

The XFCE panel (taskbar) is the most important element to configure correctly for your screen size. A panel layout that works on a 27-inch monitor will be unusable on a 6-inch phone screen.

### Phone Screens (under 7 inches)

On a phone, screen space is extremely limited. Use a single panel at the top with minimal items.

<CopyCommand command="xfce4-panel --preferences" />

Recommended phone configuration:

- **Single panel** at the top, height 28-32 pixels
- **Items**: Application Menu, Task List, Clock, Notification Area
- Remove the second (bottom) panel if present
- Set the Application Menu to use a compact icon-only button
- Enable "Automatically hide the panel" to reclaim screen space

<CopyCommand command="xfconf-query -c xfce4-panel -p /panels/panel-1/autohide-behavior -s 1" />

<Tip>
Setting autohide to 1 means "intelligently hide" --- the panel hides when a window would overlap it. Set to 2 for "always hide" (panel only appears on mouse-over at the edge).
</Tip>

### Tablet Screens (7-13 inches)

Tablets provide enough space for a more traditional layout. A single panel at the top with a full set of controls works well.

Recommended tablet configuration:

- **Single panel** at the top, height 32-36 pixels
- **Items**: Application Menu (with text label), Window Buttons, Separator (expand), Workspace Switcher, System Tray, Clock, Action Buttons
- No autohide needed at this size
- Consider adding a dock-style launcher panel at the bottom for frequently used applications

### External Monitor (DeX or wired display)

With an external monitor, you have full desktop real estate. Use the standard dual-panel XFCE layout.

Recommended monitor configuration:

- **Top panel**: Application Menu, Window Buttons, Separator (expand), Workspace Switcher, System Tray, Clock, Action Buttons
- **Optional bottom panel**: Launcher icons for frequently used apps
- Height 28-30 pixels (standard desktop size)
- Multiple workspaces (2-4) for organizing windows

<CopyCommand command="xfconf-query -c xfwm4 -p /general/workspace_count -s 4" />

## Touch-Friendly Configuration

Running XFCE on a touchscreen requires some adjustments. The default click targets are designed for mouse cursors, not fingertips.

### Increase Click Target Sizes

Increase the title bar button size:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/title_font -s 'Sans Bold 12'" />

Increase the panel height for easier touch targets:

<CopyCommand command="xfconf-query -c xfce4-panel -p /panels/panel-1/size -s 40" />

### Enable Edge Resistance

Edge resistance prevents you from accidentally dragging windows off-screen, which is common with touch input:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/snap_to_border -s true" />
<CopyCommand command="xfconf-query -c xfwm4 -p /general/snap_to_windows -s true" />

### Window Snapping

Enable window tiling so you can drag windows to screen edges to snap them into half-screen layouts:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/tile_on_move -s true" />

<BestPractice>
On touchscreen devices, increase the window border width to make window edges easier to grab for resizing. Set it to 4-6 pixels instead of the default 1-2.
</BestPractice>

## Keyboard Shortcuts

XFCE keyboard shortcuts are especially useful when you have a physical keyboard connected through DeX or Bluetooth.

### Default Useful Shortcuts

| Shortcut | Action |
|---|---|
| `Alt+F2` | Application finder (run dialog) |
| `Alt+F4` | Close window |
| `Alt+F9` | Minimize window |
| `Alt+F10` | Maximize/restore window |
| `Alt+Tab` | Switch between windows |
| `Ctrl+Alt+D` | Show desktop |
| `Super+Arrow` | Tile window to screen edge |

### Adding Custom Shortcuts

Open the keyboard settings to define your own shortcuts:

<CopyCommand command="xfce4-settings-manager" />

Navigate to Keyboard > Application Shortcuts. Common additions:

<CopyCommand command="xfconf-query -c xfce4-keyboard-shortcuts -p '/commands/custom/<Super>e' -s 'thunar' --create -t string" />

<CopyCommand command="xfconf-query -c xfce4-keyboard-shortcuts -p '/commands/custom/<Super>t' -s 'xfce4-terminal' --create -t string" />

These create `Super+E` to open the file manager and `Super+T` to open the terminal.

## Theme Configuration

XFCE separates appearance into several layers: the GTK theme (application widgets), the window manager theme (title bars and borders), the icon theme, and the cursor theme.

### Setting Themes via Command Line

Set the GTK theme:

<CopyCommand command="xfconf-query -c xsettings -p /Net/ThemeName -s 'Adwaita-dark'" />

Set the window manager theme:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/theme -s 'Default-hdpi'" />

Set the icon theme:

<CopyCommand command="xfconf-query -c xsettings -p /Net/IconThemeName -s 'Adwaita'" />

<Note>
For detailed theme installation and customization, including installing third-party themes and making XFCE look modern, see the [Customization](/docs/desktop-environments/customization) page.
</Note>

## Font Configuration

Proper font configuration is critical on Android devices, which often have high-DPI screens.

### DPI Settings

Check your current DPI:

<CopyCommand command="xfconf-query -c xsettings -p /Xft/DPI" />

For a typical phone screen (400+ PPI), a DPI of 140-192 works well. For tablets, 120-140. For external monitors, 96 (standard).

<CopyCommand command="xfconf-query -c xsettings -p /Xft/DPI -s 144" />

### Font Rendering

Enable font anti-aliasing and hinting for clear text:

<CopyCommand command="xfconf-query -c xsettings -p /Xft/Antialias -s 1" />
<CopyCommand command="xfconf-query -c xsettings -p /Xft/HintStyle -s 'hintslight'" />
<CopyCommand command="xfconf-query -c xsettings -p /Xft/RGBA -s 'rgb'" />

<BestPractice>
On high-DPI screens, use `hintslight` rather than `hintfull`. Full hinting distorts font shapes at high resolutions where subpixel accuracy matters more than grid-fitting.
</BestPractice>

## Compositor Settings

XFCE's built-in compositor (xfwm4) handles window transparency, shadows, and smooth window movement. On resource-constrained devices, you may want to adjust or disable it.

### Disable the Compositor

If you experience sluggish window movement or visual glitches:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/use_compositing -s false" />

### Adjust Compositor Settings

Reduce compositor effects while keeping basic compositing enabled:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/show_frame_shadow -s false" />
<CopyCommand command="xfconf-query -c xfwm4 -p /general/show_popup_shadow -s false" />

<PerformanceNote>
Disabling the compositor saves roughly 20-40 MB of RAM and reduces CPU usage during window animations. On devices with 4 GB of RAM or less, this is a worthwhile trade-off. You lose window shadows and transparency but gain noticeably smoother performance.
</PerformanceNote>

## Session Configuration

### Startup Applications

Control which applications start automatically when you log in:

<CopyCommand command="xfce4-session-settings" />

In a proot environment, many default startup services are unnecessary. Consider disabling:

- **Power Manager** (xfce4-power-manager) --- Android handles power management
- **Screensaver** (xfce4-screensaver) --- Android handles screen lock
- **Update notifier** --- package updates should be done manually in proot

### Saving Sessions

By default, XFCE saves your session (open windows and their positions) when you log out. In a proot environment, this can sometimes cause issues on restart. To disable session saving:

<CopyCommand command="xfconf-query -c xfce4-session -p /general/SaveOnExit -s false" />

<Troubleshooting items={[
  {
    problem: "Panel disappears or is not visible after login",
    solution: "The panel configuration may have been corrupted. Reset it by running: rm -rf ~/.config/xfce4/panel && xfce4-panel --preferences. This resets the panel to default settings. You may need to restart the session."
  },
  {
    problem: "Windows are very slow to move or resize",
    solution: "Disable the compositor with: xfconf-query -c xfwm4 -p /general/use_compositing -s false. This eliminates the transparency and shadow rendering that can cause sluggishness on less powerful devices."
  },
  {
    problem: "Text is too small or too large on screen",
    solution: "Adjust the DPI setting: xfconf-query -c xsettings -p /Xft/DPI -s VALUE. Start with 144 for phones, 120 for tablets, 96 for external monitors. You may need to restart applications for the change to take effect."
  },
  {
    problem: "Application menu is empty or missing entries",
    solution: "Run: xfce4-panel -r to restart the panel, or run: update-menus to regenerate the application menu entries. If specific applications are missing, check that their .desktop files exist in /usr/share/applications/."
  }
]} />

## Next Steps

- [Customization](/docs/desktop-environments/customization) --- install themes, icon packs, and transform the look of your desktop
- [Display Servers](/docs/desktop-environments/display-servers) --- configure Termux:X11 and VNC for rendering your desktop
- [Performance Optimization](/docs/performance/optimization) --- tune XFCE for the best performance on your device
