---
sidebar_position: 3
title: "Battery Management"
description: "Understanding and extending battery life while running Linux on Android with ADL."
---

# Battery Management

Running a full Linux desktop environment on your phone draws more power than typical Android usage. This page covers what to expect, how to extend battery life, and how to manage heat when using ADL for extended sessions.

## How ADL Affects Battery Life

Under normal Android usage, your phone spends most of its time with the screen at moderate brightness and the CPU in low-power states. ADL changes this equation in several ways:

- **CPU usage increases** --- the desktop environment, window manager, and your applications keep the CPU active. Proot's syscall translation adds additional CPU cycles on top of every operation.
- **Screen stays on** --- desktop work requires a continuously active display, preventing the screen from sleeping.
- **RAM stays fully utilized** --- the memory controller remains active, and more RAM pages means more power draw.
- **No deep sleep** --- Android cannot enter deep sleep (Doze) while Termux is actively running a desktop session.

<PerformanceNote>
ADL typically drains battery 2-4x faster than idle Android usage. Expect your phone to consume 15-30% of its battery per hour of active desktop use, depending on your device, screen brightness, and workload. Light terminal work sits at the lower end; browser use with compilation sits at the higher end.
</PerformanceNote>

## Expected Battery Life by Device Class

These estimates assume active desktop use with XFCE, a text editor, and a terminal open. Add a browser and expect 20-30% less time.

| Device Class | Typical Battery | Estimated ADL Time |
|---|---|---|
| Budget (4,000 mAh) | 4,000 mAh | 2-3 hours |
| Mid-range (5,000 mAh) | 5,000 mAh | 3-4.5 hours |
| Flagship (5,000 mAh, efficient SoC) | 5,000 mAh | 3.5-5 hours |
| Tablet (8,000-10,000 mAh) | 8,000+ mAh | 5-8 hours |

<Note>
These are rough estimates for continuous active use. Your results will vary based on screen brightness, workload intensity, device age (battery degradation), and ambient temperature. Devices with OLED screens using dark themes will land toward the higher end.
</Note>

## Extending Battery Life

### Screen Brightness

The display is the largest single power consumer on your device. Reducing brightness has a direct, significant impact on battery life.

<BestPractice>
Set screen brightness to the lowest comfortable level. On OLED screens, reducing brightness from 75% to 25% can nearly double battery life during ADL sessions. Use Android's adaptive brightness or set a manual level that works for your lighting conditions.
</BestPractice>

If you are using Samsung DeX with an external monitor, turn off the phone screen entirely. The phone display consumes power even when the external monitor is your primary display:

- On Samsung devices, go to **Settings > Samsung DeX > Phone screen when using DeX** and select **Turn off screen**.

### Wi-Fi and Network

Wi-Fi radio power draw is modest but adds up over long sessions.

<Tip>
If you are working offline (editing code, writing documents, reading local files), enable Airplane Mode to eliminate all radio power consumption. This can add 30-60 minutes to your session. Toggle Wi-Fi back on when you need to install packages or browse the web.
</Tip>

Disable Bluetooth if you are not using a Bluetooth keyboard or mouse:

- **Settings > Bluetooth > Off**

### Reduce CPU Load

Lighter workloads draw less power. The [Optimization Guide](/docs/performance/optimization) covers this in detail, but the highest-impact battery-saving changes are:

- **Disable compositing** --- eliminates continuous CPU-based rendering of desktop effects
- **Close unnecessary applications** --- every running process consumes CPU cycles
- **Avoid sustained compilation** --- long build jobs keep all CPU cores at high frequencies

<PerformanceNote>
Disabling the XFCE compositor alone can reduce CPU power consumption by 10-20% during desktop use, because it eliminates the continuous software rendering loop that handles transparency and shadows.
</PerformanceNote>

### Use a Dark Theme

On OLED and AMOLED screens, dark pixels consume significantly less power than light pixels. XFCE supports dark themes out of the box.

Set the dark theme in XFCE:

- **Settings > Appearance > Style** and select **Adwaita-dark** or **Greybird-dark**

Combine this with a pure black wallpaper for maximum power savings on OLED:

- **Settings > Desktop > Background** and set a solid black color

<PerformanceNote>
Dark themes on OLED screens can reduce display power consumption by 30-50% compared to light themes. This translates to roughly 15-25% more total battery life during ADL sessions, since the display is the dominant power consumer.
</PerformanceNote>

### Terminal-Only Sessions

If your work does not require a graphical desktop, skip the desktop environment entirely and work in Termux's terminal. This dramatically reduces power consumption by eliminating the display rendering, window manager, and desktop environment overhead.

<Tip>
For SSH sessions, file editing, Git work, and scripting, a terminal-only session is both faster and far more battery-efficient. You can expect roughly double the battery life compared to running the full XFCE desktop.
</Tip>

## Charging While Using ADL

Using ADL while charging is common for extended sessions, but introduces thermal considerations.

### Thermal Behavior

Your phone generates heat from three sources simultaneously when charging during active use:

1. **Battery charging** --- the charging circuit itself generates heat
2. **CPU activity** --- ADL keeps the processor active
3. **Screen** --- the display generates heat, especially at high brightness

<Warning>
Sustained temperatures above 40-45 degrees Celsius trigger thermal throttling, where the device reduces CPU clock speeds, limits charging rates, or both. This protects the hardware but makes ADL noticeably slower. In extreme cases, Android may display a thermal warning and force applications to close.
</Warning>

### Managing Heat While Charging

Reduce thermal load to maintain performance during charging sessions:

- **Use a slower charger** --- a 5W or 10W charger generates less heat than a fast charger (25W+). If you are plugged in for a long session, charging speed matters less than sustained performance.
- **Remove the phone case** --- cases trap heat. Removing the case during extended ADL sessions allows better heat dissipation.
- **Use a fan or cooling pad** --- a small desk fan pointed at the back of your phone makes a measurable difference during sustained workloads.
- **Reduce screen brightness** --- lower brightness means less heat from the display.

<BestPractice>
For the best experience during long charging sessions, use a low-wattage charger (5-10W), remove your phone case, and reduce screen brightness. This combination minimizes heat generation and keeps the CPU from throttling, resulting in both faster performance and healthier battery longevity.
</BestPractice>

### Battery Health Considerations

Lithium-ion batteries degrade faster when kept at high temperatures and high charge levels. Running ADL while charging at 100% is the worst combination for long-term battery health.

<Tip>
Many Samsung devices support a "Protect Battery" feature (Settings > Battery > Battery Protection) that stops charging at 85%. Enable this if you frequently use ADL while plugged in. Other manufacturers offer similar features --- check your device's battery settings.
</Tip>

## Thermal Throttling

Thermal throttling is the most common cause of unexpected slowdowns during ADL sessions. Understanding how it works helps you manage it.

### How Throttling Works

Mobile processors have multiple performance states. Under normal conditions, the CPU runs at high clock speeds when active and drops to low speeds when idle. When the processor temperature exceeds a threshold (typically 40-45 degrees Celsius at the SoC), the device reduces maximum clock speeds to lower heat output.

The throttling is progressive --- mild overheating causes a small speed reduction, while sustained high temperatures cause aggressive throttling that can reduce performance to 50% or less of peak.

### Signs of Throttling

- Tasks that were fast suddenly become sluggish
- The back of the phone feels hot to the touch
- Charging slows down noticeably
- The UI becomes laggy and unresponsive

### Preventing Throttling

<BestPractice>
Take a "thermal break" during sustained heavy workloads. If you are compiling code, let the phone cool for a few minutes between builds. This sounds counterintuitive, but a 2-minute break can prevent 10 minutes of throttled performance during the next build.
</BestPractice>

Avoid using ADL in hot environments. Direct sunlight, warm rooms, and enclosed spaces without airflow all contribute to faster throttling. Air-conditioned environments are ideal for extended ADL sessions.

## Power Saving vs. Performance Modes

Most Android devices offer power management modes that affect ADL performance.

### Performance Mode

Some devices (especially Samsung and gaming phones) offer a performance or high-performance mode. This raises thermal limits and keeps CPU frequencies higher for longer.

- **Pros**: Better sustained performance, less throttling during heavy tasks
- **Cons**: Significantly higher battery drain, more heat generation, potential long-term battery degradation

Use performance mode for short, intensive tasks like compilation where you want maximum speed and are willing to accept higher power consumption.

### Power Saving Mode

Android's power saving mode typically reduces CPU frequencies, limits background activity, and may reduce screen brightness.

<Warning>
Aggressive power saving modes can make ADL unusable by severely limiting CPU speeds and potentially killing Termux as a background process. If you enable power saving, use the least aggressive level available, and ensure Termux is excluded from battery optimization (Settings > Apps > Termux > Battery > Unrestricted).
</Warning>

### Recommended Configuration

For most ADL sessions, the standard (balanced) power profile works best. Add these Android-side settings:

- **Exclude Termux from battery optimization** --- prevents Android from killing your session
- **Disable adaptive battery** for Termux --- stops Android from restricting Termux's CPU access
- **Set Termux as a "protected" or "unrestricted" app** --- the terminology varies by manufacturer

<FAQ items={[
  {
    question: "Will ADL damage my battery?",
    answer: "ADL itself does not damage your battery. However, sustained heavy use (especially while charging) keeps the battery at high temperatures, which accelerates normal degradation. This is the same effect as extended gaming sessions or video recording. Using the battery health tips in this guide --- lower charging wattage, battery protection limits, and thermal management --- minimizes the impact."
  },
  {
    question: "Can I use ADL while my phone charges wirelessly?",
    answer: "Yes, but wireless charging generates more heat than wired charging. This makes thermal throttling more likely during ADL sessions. If you notice performance dropping, switch to a wired charger at a lower wattage. Wireless charging is best reserved for light ADL workloads like terminal use and text editing."
  },
  {
    question: "My phone gets very hot running ADL. Is this dangerous?",
    answer: "Modern phones have hardware-level thermal protection that will shut down the device before it reaches dangerous temperatures. If your phone feels uncomfortably hot to the touch, the thermal throttling system is already active and reducing performance. Let it cool down, reduce your workload, and consider using a fan or removing the case. The phone will not sustain damage from normal ADL use."
  },
  {
    question: "Should I close ADL when I am not using it?",
    answer: "Yes. Unlike native Android apps that suspend cleanly, an active ADL desktop session continues consuming CPU and RAM even when you switch away. Stop the desktop environment when you are done, or at minimum switch to a terminal-only session. This reduces battery drain to near-normal Android levels."
  }
]} />

## Next Steps

- [Optimization Guide](/docs/performance/optimization) --- reduce CPU and memory usage for better battery life
- [Storage Management](/docs/performance/storage) --- manage disk space in your ADL installation
