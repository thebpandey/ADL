---
sidebar_position: 4
title: "XFCE Shortcuts & Commands"
description: "Keyboard shortcuts, panel configuration, and window manager commands for XFCE desktop."
---

# XFCE Shortcuts & Commands

Quick reference for XFCE keyboard shortcuts, file manager navigation, panel configuration, and settings commands within the ADL environment.

## Window Manager Shortcuts

Default `xfwm4` keybindings for window and workspace management.

| Shortcut | Action |
|---|---|
| `Alt+F4` | Close window |
| `Alt+F5` | Maximize horizontal |
| `Alt+F6` | Maximize vertical |
| `Alt+F7` | Move window |
| `Alt+F8` | Resize window |
| `Alt+F9` | Minimize window |
| `Alt+F10` | Maximize / restore window |
| `Alt+F11` | Toggle fullscreen |
| `Alt+F12` | Toggle above / below other windows |
| `Alt+Tab` | Cycle windows forward |
| `Alt+Shift+Tab` | Cycle windows reverse |
| `Super+D` | Show desktop (minimize all) |

### Workspace Shortcuts

| Shortcut | Action |
|---|---|
| `Alt+Insert` | Add workspace |
| `Alt+Delete` | Remove last workspace |
| `Ctrl+Alt+Left` | Switch to workspace left |
| `Ctrl+Alt+Right` | Switch to workspace right |
| `Ctrl+Alt+Up` | Switch to workspace above |
| `Ctrl+Alt+Down` | Switch to workspace below |
| `Alt+Shift+Left` | Move window to workspace left |
| `Alt+Shift+Right` | Move window to workspace right |
| `Alt+Shift+Up` | Move window to workspace above |
| `Alt+Shift+Down` | Move window to workspace below |

## Thunar File Manager Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+L` | Focus location bar |
| `Ctrl+N` | New window |
| `Ctrl+T` | New tab |
| `Ctrl+W` | Close tab |
| `Ctrl+H` | Show / hide hidden files |
| `Ctrl+E` | Toggle side pane |
| `Ctrl+Shift+N` | Create new folder |
| `F2` | Rename selected item |
| `Delete` | Move to trash |
| `Shift+Delete` | Permanent delete |
| `Alt+Enter` | Properties dialog |
| `Backspace` | Go to parent directory |
| `Alt+Left` | Navigate back |
| `Alt+Right` | Navigate forward |

## Panel Configuration

### Panel Commands

| Command | Description |
|---|---|
| `xfce4-panel` | Start the panel |
| `xfce4-panel --restart` | Restart the panel process |
| `xfce4-panel --quit` | Stop the panel |
| `xfce4-panel --preferences` | Open panel preferences dialog |

<CopyCommand command="xfce4-panel --restart" />

### Common Panel Plugins

| Plugin | Package | Purpose |
|---|---|---|
| Whisker Menu | `xfce4-whiskermenu-plugin` | Application launcher |
| Task Manager | built-in | Window list |
| Clock | built-in | Date and time display |
| System Tray | built-in | Notification area |
| PulseAudio | `xfce4-pulseaudio-plugin` | Volume control |
| Battery Monitor | `xfce4-battery-plugin` | Battery status |
| CPU Graph | `xfce4-cpugraph-plugin` | CPU usage monitor |
| Weather | `xfce4-weather-plugin` | Weather information |

### Panel Properties via xfconf-query

<CopyCommand command="xfconf-query -c xfce4-panel -p /panels/panel-1/size -s 32" />

<CopyCommand command="xfconf-query -c xfce4-panel -p /panels/panel-1/position -s 'p=8;x=0;y=0'" />

<Tip title="Finding panel property names">
List all panel properties with `xfconf-query -c xfce4-panel -lv` to discover the exact keys before modifying them.
</Tip>

## XFCE Settings Commands

Launch individual settings dialogs from the command line.

| Command | Settings Dialog |
|---|---|
| `xfce4-settings-manager` | All settings (main hub) |
| `xfce4-display-settings` | Display and resolution |
| `xfce4-appearance-settings` | Themes, icons, fonts |
| `xfce4-keyboard-settings` | Keyboard layout and shortcuts |
| `xfce4-mouse-settings` | Mouse and touchpad |
| `xfce4-power-manager-settings` | Power management |
| `xfce4-notifyd-config` | Notification daemon |
| `xfce4-screensaver-preferences` | Screensaver and lock screen |

<CopyCommand command="xfce4-settings-manager" />

## Customizing Shortcuts

### Using the GUI

Open the keyboard settings dialog to add or modify shortcuts:

<CopyCommand command="xfce4-keyboard-settings" />

Navigate to the **Application Shortcuts** tab to bind custom commands to key combinations, or the **Window Manager** tab (via `xfwm4-settings`) to change window manager keybindings.

### Using xfconf-query

Set a custom shortcut from the command line. The key path uses the keybind string as the property name and the command as the value:

<CopyCommand command="xfconf-query -c xfce4-keyboard-shortcuts -p '/commands/custom/<Super>t' -n -t string -s 'xfce4-terminal'" />

Remove a shortcut:

<CopyCommand command="xfconf-query -c xfce4-keyboard-shortcuts -p '/commands/custom/<Super>t' -r" />

### Shortcut Configuration File

Shortcuts are stored in the xfconf XML backend:

```
~/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-keyboard-shortcuts.xml
```

<Note title="Manual edits">
If you edit the XML file directly, restart xfconfd or log out and back in for changes to take effect. Using `xfconf-query` applies changes immediately.
</Note>

## xfconf-query Reference

`xfconf-query` reads and writes XFCE configuration values stored in the xfconf daemon. Every XFCE settings dialog writes to an xfconf channel.

### Common Operations

| Operation | Command |
|---|---|
| List all channels | `xfconf-query -l` |
| List all properties in a channel | `xfconf-query -c <channel> -lv` |
| Read a property | `xfconf-query -c <channel> -p <property>` |
| Set a property | `xfconf-query -c <channel> -p <property> -s <value>` |
| Create a new property | `xfconf-query -c <channel> -p <property> -n -t <type> -s <value>` |
| Reset a property to default | `xfconf-query -c <channel> -p <property> -r` |
| Reset a property tree | `xfconf-query -c <channel> -p <property> -rR` |

### Useful Examples

Set the desktop wallpaper:

<CopyCommand command="xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitorVNC-0/workspace0/last-image -s '/path/to/wallpaper.png'" />

Change the window manager theme:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/theme -s 'Default'" />

Set the GTK theme:

<CopyCommand command="xfconf-query -c xsettings -p /Net/ThemeName -s 'Adwaita-dark'" />

Disable the compositor:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/use_compositing -s false" />

<CollapsibleSection title="Frequently used xfconf channels">

| Channel | Controls |
|---|---|
| `xfwm4` | Window manager behavior and appearance |
| `xfce4-panel` | Panel layout and plugins |
| `xfce4-desktop` | Desktop wallpaper and icons |
| `xfce4-keyboard-shortcuts` | All keyboard shortcuts |
| `xsettings` | GTK theme, fonts, DPI |
| `xfce4-session` | Session startup and behavior |
| `xfce4-power-manager` | Power and battery settings |
| `thunar` | File manager preferences |

</CollapsibleSection>

<BestPractice>
Before modifying settings via `xfconf-query`, read the current value first to note the default. This makes it easy to revert: `xfconf-query -c <channel> -p <property>`.
</BestPractice>
