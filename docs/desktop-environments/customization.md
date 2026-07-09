---
sidebar_position: 3
title: "Customization"
description: "Install themes, icons, fonts, and transform the appearance of your XFCE desktop in ADL."
---

# Customization

One of the advantages of a full Linux desktop on your Android device is complete control over how it looks and feels. XFCE separates appearance into four layers --- GTK theme, window manager theme, icon theme, and cursor theme --- each of which can be changed independently.

## GTK Themes

GTK themes control how application widgets look: buttons, menus, scrollbars, text inputs, and other interface elements. XFCE uses GTK3, so you need GTK3-compatible themes.

### Installing Themes from Repositories

The simplest way to get themes is from the Ubuntu package repository:

<CopyCommand command="apt install arc-theme numix-gtk-theme greybird-gtk-theme -y" />

These install three solid theme options:

- **Arc** --- a modern flat theme with clean lines and good contrast (available in Arc, Arc-Dark, Arc-Darker variants)
- **Numix** --- a flat theme with subtle gradients and warm accent colors
- **Greybird** --- XFCE's own default theme, polished and well-tested

### Applying a GTK Theme

Through the settings GUI:

<CopyCommand command="xfce4-appearance-settings" />

Or via command line:

<CopyCommand command="xfconf-query -c xsettings -p /Net/ThemeName -s 'Arc-Dark'" />

### Installing Themes Manually

To install a theme downloaded as a tar archive:

<CopyCommand command="mkdir -p ~/.themes" />
<CopyCommand command="tar -xf theme-name.tar.gz -C ~/.themes/" />

The theme appears in the Appearance settings after extraction. The theme directory must contain a `gtk-3.0` subdirectory to work with XFCE's GTK3 applications.

<BestPractice>
Use dark themes on OLED-screen phones. Dark pixels consume less power on OLED displays, meaningfully extending battery life during long sessions. Arc-Dark and Adwaita-dark are both solid choices.
</BestPractice>

## Window Manager Themes

Window manager themes control the title bar, window borders, and window control buttons (minimize, maximize, close). These are separate from GTK themes.

### Installing Window Manager Themes

<CopyCommand command="apt install xfwm4-themes -y" />

This installs a collection of window manager themes. Apply one:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/theme -s 'Kokodi'" />

The window manager theme should complement your GTK theme. Arc includes matching xfwm4 themes --- if you use Arc-Dark as your GTK theme, set the window manager theme to Arc-Dark as well.

### Adjusting Title Bar

Make the title bar taller for touch-friendliness:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/title_font -s 'Sans Bold 11'" />

Change the button layout (which buttons appear and in what order):

<CopyCommand command="xfconf-query -c xfwm4 -p /general/button_layout -s 'CHM|O'" />

Button codes: C=close, H=hide (minimize), M=maximize, O=menu (left-click for window menu). The pipe `|` separates left-side from right-side buttons.

## Icon Themes

Icon themes change the look of file type icons, application icons, and action icons throughout the desktop.

### Installing Icon Themes

<CopyCommand command="apt install papirus-icon-theme numix-icon-theme-circle -y" />

- **Papirus** --- a large, comprehensive icon set with clean SVG icons and good coverage of modern applications
- **Numix Circle** --- circular application icons with a consistent style

Apply an icon theme:

<CopyCommand command="xfconf-query -c xsettings -p /Net/IconThemeName -s 'Papirus-Dark'" />

<Tip>
Papirus comes in several variants: Papirus (light), Papirus-Dark (dark), Papirus-Light (extra light), and ePapirus (for elementary OS styling). Use Papirus-Dark with dark GTK themes for consistent appearance.
</Tip>

## Cursor Themes

The default cursor can be small and hard to see on high-DPI Android screens. A larger cursor theme helps with both visibility and touch accuracy.

<CopyCommand command="apt install dmz-cursor-theme -y" />

Apply the cursor theme:

<CopyCommand command="xfconf-query -c xsettings -p /Gtk/CursorThemeName -s 'DMZ-White'" />

Set the cursor size (default is 16, increase for high-DPI screens):

<CopyCommand command="xfconf-query -c xsettings -p /Gtk/CursorThemeSize -s 32" />

## Wallpaper

### Setting a Wallpaper

Through the GUI, right-click the desktop and select "Desktop Settings." Through the command line:

<CopyCommand command="xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitorscreen/workspace0/last-image -s '/path/to/wallpaper.jpg'" />

### Downloading Wallpapers

You can download wallpapers directly from within your Linux environment:

<CopyCommand command="mkdir -p ~/Pictures/Wallpapers" />
<CopyCommand command="apt install wget -y" />

<Tip>
Store wallpapers in ~/Pictures/Wallpapers/ for organization. The XFCE desktop settings dialog lets you point to a directory and browse all images in it.
</Tip>

### Solid Color Background

For maximum performance and minimal resource usage, use a solid color background instead of an image:

<CopyCommand command="xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitorscreen/workspace0/image-style -s 0" />

## Font Configuration

### Installing Better Fonts

The default font selection in a minimal Ubuntu install is limited. Install additional fonts for better readability:

<CopyCommand command="apt install fonts-noto fonts-liberation fonts-dejavu -y" />

- **Noto** --- Google's font family with coverage for virtually every writing system
- **Liberation** --- metrically compatible with Arial, Times New Roman, and Courier New (useful for document compatibility)
- **DejaVu** --- extended Unicode coverage with good screen rendering

### Setting the Default Font

<CopyCommand command="xfconf-query -c xsettings -p /Gtk/FontName -s 'Noto Sans 10'" />

For monospace (terminal, code editors):

<CopyCommand command="xfconf-query -c xsettings -p /Gtk/MonospaceFontName -s 'Noto Sans Mono 10'" />

### HiDPI Font Scaling

On high-DPI Android screens, increase the font DPI for readable text:

<CopyCommand command="xfconf-query -c xsettings -p /Xft/DPI -s 144" />

Common DPI values:

| Screen type | Recommended DPI |
|---|---|
| Phone (5-7 inch) | 140-192 |
| Tablet (8-13 inch) | 120-144 |
| External monitor (1080p) | 96 |
| External monitor (4K) | 144-192 |

<Warning>
Changing DPI affects all applications. Some applications may not respond immediately --- restart them after changing DPI. If the entire desktop becomes unusable (text too large to navigate), you can reset from the Termux command line: `xfconf-query -c xsettings -p /Xft/DPI -s 96`.
</Warning>

## Panel Layout Examples

### Minimal Top Panel

A single panel at the top with essential items. Best for phones.

Items in order: Application Menu, Separator (expand), Clock, Notification Area

<CopyCommand command="xfce4-panel -r" />

### macOS-Style Layout

Top panel with a global menu, bottom panel as a dock with application launchers.

1. Create a second panel at the bottom
2. Set it to not expand (fixed width centered at the bottom)
3. Add launcher icons for your most-used applications
4. On the top panel, add the clock centered with a separator on each side

### Windows-Style Layout

Single panel at the bottom with a menu button on the left, system tray on the right.

Move the panel to the bottom:

<CopyCommand command="xfconf-query -c xfce4-panel -p /panels/panel-1/position -s 'p=8;x=0;y=0'" />

<BestPractice>
After configuring your panel layout, back up your panel configuration so you can restore it if something goes wrong: `cp -r ~/.config/xfce4/panel ~/.config/xfce4/panel.backup`
</BestPractice>

## Window Manager Tweaks

### Disable Window Animations

Window animations consume CPU and can feel sluggish in proot:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/box_move -s true" />
<CopyCommand command="xfconf-query -c xfwm4 -p /general/box_resize -s true" />

These settings show only a wire frame outline when moving or resizing windows, instead of rendering the full window content during the operation.

### Window Snapping and Tiling

Enable window tiling for efficient use of screen space:

<CopyCommand command="xfconf-query -c xfwm4 -p /general/tile_on_move -s true" />
<CopyCommand command="xfconf-query -c xfwm4 -p /general/snap_to_border -s true" />
<CopyCommand command="xfconf-query -c xfwm4 -p /general/snap_to_windows -s true" />
<CopyCommand command="xfconf-query -c xfwm4 -p /general/wrap_windows -s false" />

## Dark Mode Setup

A complete dark mode setup involves several components:

### Step 1: Set Dark GTK Theme

<CopyCommand command="xfconf-query -c xsettings -p /Net/ThemeName -s 'Arc-Dark'" />

### Step 2: Set Dark Window Manager Theme

<CopyCommand command="xfconf-query -c xfwm4 -p /general/theme -s 'Arc-Dark'" />

### Step 3: Set Dark Icon Theme

<CopyCommand command="xfconf-query -c xsettings -p /Net/IconThemeName -s 'Papirus-Dark'" />

### Step 4: Set Dark Desktop Background

<CopyCommand command="xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitorscreen/workspace0/image-style -s 0" />
<CopyCommand command="xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitorscreen/workspace0/color-style -s 0" />

### Step 5: Set GTK Prefer Dark Theme

Some GTK3 applications respect a "prefer dark" flag:

<CopyCommand command="mkdir -p ~/.config/gtk-3.0" />

Create or edit `~/.config/gtk-3.0/settings.ini`:

<Terminal title="~/.config/gtk-3.0/settings.ini">

```ini
[Settings]
gtk-application-prefer-dark-theme=1
```

</Terminal>

<Tip>
Install Arc-Dark plus Papirus-Dark for a consistent, modern dark desktop that works well on OLED screens and reduces eye strain during long sessions.
</Tip>

## Making XFCE Look Modern

A fresh XFCE install looks dated. With the right combination of themes and settings, you can make it look contemporary.

Recommended modern setup:

1. **GTK theme**: Arc-Dark or Adwaita-dark
2. **WM theme**: Match the GTK theme
3. **Icons**: Papirus-Dark
4. **Cursor**: DMZ-White at size 24-32
5. **Font**: Noto Sans 10 with DPI matching your screen
6. **Compositor**: Enabled with shadows but without transparency
7. **Panel**: Single top panel, height 30-32px, with a clean clock format

Apply this all at once:

<CopyCommand command="apt install arc-theme papirus-icon-theme dmz-cursor-theme fonts-noto -y" />

<CopyCommand command="xfconf-query -c xsettings -p /Net/ThemeName -s 'Arc-Dark' && xfconf-query -c xfwm4 -p /general/theme -s 'Arc-Dark' && xfconf-query -c xsettings -p /Net/IconThemeName -s 'Papirus-Dark' && xfconf-query -c xsettings -p /Gtk/CursorThemeName -s 'DMZ-White' && xfconf-query -c xsettings -p /Gtk/FontName -s 'Noto Sans 10'" />

<Note>
All customization settings are stored in ~/.config/xfce4/ and can be backed up, restored, or shared between devices by copying that directory.
</Note>

## Next Steps

- [Display Servers](/docs/desktop-environments/display-servers) --- configure how your desktop is rendered on screen
- [XFCE Configuration](/docs/desktop-environments/xfce) --- deeper configuration of XFCE components and behavior
- [Performance Optimization](/docs/performance/optimization) --- tune your desktop for best performance
