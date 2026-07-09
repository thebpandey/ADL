---
sidebar_position: 3
title: "Accessories"
description: "Recommended accessories for building a Samsung DeX workstation with ADL -- hubs, monitors, keyboards, mice, and portable setups."
---

# Accessories

A Samsung DeX workstation is only as good as the peripherals around it. The right USB-C hub, monitor, keyboard, and mouse turn a phone-on-a-desk into a productive Linux workstation. The wrong ones create frustrating bottlenecks. This page covers what to look for in each category, how to balance cost against capability, and how to build a setup you can carry with you.

<Note>
This guide intentionally avoids naming specific brands or models. Product availability and pricing change rapidly. Instead, it describes the features and specifications that matter so you can evaluate whatever is currently on the market.
</Note>

## USB-C Hubs

The USB-C hub is the single most important accessory for a wired DeX setup. It sits between your phone and everything else -- monitor, keyboard, mouse, power. A bad hub undermines the entire experience.

### What to Look For

**Required features:**

- **HDMI output** -- at least HDMI 2.0 for 4K@30Hz or 1080p@60Hz. HDMI 1.4 hubs cap you at 1080p@30Hz, which produces visible flickering
- **USB-C Power Delivery (PD) passthrough** -- charges your phone while DeX is active. Look for at least 45W passthrough; 60W or higher is better
- **At least one USB-A port** -- for a wired keyboard or mouse if you prefer USB over Bluetooth

**Strongly recommended features:**

- **Two or more USB-A ports** -- one for a keyboard, one for a mouse, one for a USB drive
- **USB 3.0 on the USB-A ports** -- USB 2.0 works for keyboards and mice but bottlenecks file transfers from USB drives
- **Ethernet port** -- wired networking is more stable than Wi-Fi, and the latency difference matters for remote development work

**Features that do not matter for DeX:**

- SD card readers (Android handles these through its own USB interface)
- DisplayPort output (DeX uses HDMI)
- VGA output (no modern monitor needs this)

<BestPractice>
Buy a hub from a manufacturer that explicitly lists Samsung DeX compatibility. Some hubs technically support USB-C video output but use protocols that DeX does not recognize. DeX requires DisplayPort Alternate Mode over USB-C -- hubs that use DisplayLink (a software-based video solution) will not work.
</BestPractice>

<Decision
  question="What type of USB-C hub should you get?"
  options={[
    {
      label: "Compact travel hub (4-6 ports)",
      description: "Small enough to fit in a pocket alongside your phone. Typically includes HDMI, 1-2 USB-A ports, and PD passthrough. Ideal if portability is a priority and you use Bluetooth peripherals.",
      recommended: false,
    },
    {
      label: "Full-size docking hub (7-12 ports)",
      description: "Larger but provides everything: HDMI, multiple USB-A ports, Ethernet, audio jack, and high-wattage PD passthrough. Best for a permanent desk setup where the hub stays connected to the monitor and peripherals.",
      recommended: true,
    },
  ]}
/>

### Power Delivery Details

Not all PD passthrough is equal. The wattage your phone actually receives through the hub depends on:

1. **The hub's passthrough wattage** -- cheap hubs cap at 15-30W, which is too slow to keep up with DeX power consumption. Your phone will slowly drain even while "charging"
2. **Your charger's output** -- the charger plugged into the hub must deliver more wattage than the hub passes through. Use at least a 45W charger with a hub that passes through 45W
3. **Cable quality** -- the USB-C cable between the charger and hub must support the wattage. Thin cables cap out at 15-30W regardless of what the charger and hub support

<Tip>
To verify your phone is actually charging while DeX is active, check **Settings > Battery** on your Samsung device. It should say "Charging" or "Fast charging," not "Slow charging." If it says "Slow charging," your hub or charger is not delivering enough power.
</Tip>

## Monitors

### Portable USB-C Monitors

Portable monitors with USB-C input are the natural pairing for a mobile DeX setup. They draw power directly from the hub or phone, require no separate power brick, and weigh under a kilogram.

**What to look for:**

- **15.6-inch size** -- the sweet spot between usability and portability. Smaller screens (13.3 inch) are more portable but cramped for desktop work. Larger screens (17.3 inch) are less portable than a laptop
- **1920x1080 resolution** -- sufficient for most work. 4K portable monitors exist but drain significantly more power and offer marginal benefit at this screen size
- **IPS panel** -- wide viewing angles matter when the screen is on a desk at varying heights. TN panels wash out at slight angles
- **USB-C with DisplayPort Alt Mode** -- some portable monitors only accept USB-C for power, not video. You need a monitor that accepts video over USB-C or has a separate HDMI input
- **Built-in kickstand or case stand** -- you need something to prop it up

<Note>
Some USB-C portable monitors can connect directly to your Samsung phone without a hub, receiving both video and power through a single cable. This is the simplest possible DeX setup -- one cable, one monitor, no hub. Check that the monitor explicitly supports this with Samsung DeX.
</Note>

### Desktop Monitors

For a permanent desk setup, a regular desktop monitor connected through your USB-C hub's HDMI port is the better choice. Desktop monitors are cheaper per inch, brighter, and have better color accuracy than portable alternatives.

**What to look for:**

- **24-27 inch size** -- matches the experience of a standard desktop workstation
- **1920x1080 or 2560x1440 resolution** -- 1080p is the safe choice for all Samsung devices. 1440p works on newer Galaxy S and Tab S devices but verify your device supports it through DeX first
- **HDMI input** -- virtually all desktop monitors have this
- **Adjustable stand** -- height and tilt adjustment prevents neck strain during long sessions

<BestPractice>
If you are buying a monitor specifically for DeX use, 1080p at 24 inches is the most reliable and cost-effective choice. Every Samsung device with DeX supports 1080p output reliably, and a 24-inch screen provides ample workspace for split-window productivity.
</BestPractice>

## Keyboards

Your keyboard choice affects both typing comfort and compatibility. Not all keyboards work identically with DeX and the Linux desktop layer.

### Bluetooth vs. USB

| Feature | Bluetooth Keyboard | USB Keyboard |
|---|---|---|
| **Pairing** | Paired through Samsung Bluetooth settings | Plug into USB-C hub |
| **Latency** | 5-15ms (imperceptible for typing) | ~1ms |
| **Portability** | No cables, no hub dependency | Requires hub |
| **Battery** | Requires charging or battery replacement | Powered by hub |
| **Multi-device** | Many support switching between 2-3 devices | Single device |
| **Reliability** | Occasional disconnects after sleep | Always connected |

<Decision
  question="Bluetooth or USB keyboard?"
  options={[
    {
      label: "Bluetooth",
      description: "Better for portability and desk cleanliness. Choose a keyboard that supports multi-device pairing so you can switch between your phone and another device. Slight risk of disconnection after the phone sleeps.",
      recommended: false,
    },
    {
      label: "USB",
      description: "Better for reliability. Zero pairing issues, zero latency, and no batteries to manage. Requires a USB-C hub with available USB-A ports. The clear winner for a stationary desk setup.",
      recommended: true,
    },
  ]}
/>

### Keyboard Features That Matter

- **Standard layout** -- avoid keyboards with non-standard key sizes or missing keys. Linux relies on keys like Ctrl, Alt, Super, and the function row more than Android does
- **Dedicated Super (Windows) key** -- used extensively in XFCE shortcuts (though you may remap it to avoid DeX conflicts, as described in [DeX Optimization](/docs/samsung/dex-optimization))
- **Full-size vs. compact** -- a 75% or tenkeyless (TKL) layout removes the number pad to save space while keeping all the keys you need for Linux work. A 60% layout drops the function row, which creates friction with XFCE shortcuts

<Tip>
If you use a Bluetooth keyboard, pair it through your Samsung device's Bluetooth settings rather than from within the Linux environment. Bluetooth paired at the Android level works across both DeX and XFCE. Bluetooth paired inside Linux only works inside Linux and may conflict with Android's Bluetooth stack.
</Tip>

## Mice

### Bluetooth vs. USB

The same trade-offs as keyboards apply to mice, with one addition: Bluetooth mice have a small but measurable tracking latency that is noticeable in precise work like image editing or selecting small text. For general use and terminal work, Bluetooth mice are perfectly adequate.

**What to look for in either type:**

- **Scroll wheel** -- essential for navigating code, documents, and web pages. A smooth-scrolling wheel (rather than notched) is better for long documents
- **Side buttons** -- programmable side buttons can be mapped to useful Linux actions like back/forward in browsers or workspace switching
- **Ergonomic shape** -- if you are building a workstation for extended use, invest in a mouse that fits your hand. A phone-sized travel mouse causes strain over long sessions
- **USB wireless receiver** (if not Bluetooth) -- a small 2.4GHz USB dongle is another option. It uses a USB-A port on your hub but provides lower latency than Bluetooth without the pairing hassle

## Portable Workstation Setup

One of DeX's most compelling features is that your entire workstation fits in a small bag. Here is what a portable DeX+ADL setup looks like.

### Essential Carry Kit

| Item | Weight (approx.) | Notes |
|---|---|---|
| Samsung phone | 200g | You are carrying this anyway |
| Compact USB-C hub | 50-100g | 4-6 port travel hub |
| 15.6" portable monitor | 700-900g | With protective case |
| Folding Bluetooth keyboard | 150-200g | Tri-fold style |
| Bluetooth mouse | 80-100g | Compact travel mouse |
| USB-C cable | 30g | For monitor connection |
| 45W USB-C charger | 100-150g | Powers phone through hub |

**Total weight: approximately 1.3-1.6 kg** -- lighter than most laptops and significantly lighter than a laptop plus its charger.

<Tip>
Look for a portable monitor that includes a protective case that doubles as a stand. This eliminates the need for a separate stand and protects the screen during transport.
</Tip>

### Desk Setup Tips

For a stationary desk where the DeX workstation lives permanently:

- Mount the USB-C hub to the underside of the desk or behind the monitor to keep cables tidy. When you sit down, you plug in a single USB-C cable to your phone, and everything connects
- Use a monitor with a USB-C input that supports both video and power delivery. This reduces the cable count to one between your phone and the monitor
- Keep a phone stand or wireless charging pad on the desk so your phone sits at an angle where you can see notifications while the Linux desktop runs on the monitor

<BestPractice>
The ideal permanent desk setup is a "single cable" experience: you plug your phone into one USB-C cable, and it connects to the monitor, charges the phone, and routes the keyboard and mouse through the monitor's built-in USB hub. Some monitors support this natively. It turns DeX from a "setting up my workstation" ritual into a "sit down and start working" experience.
</BestPractice>

## Budget vs. Premium Options

The total cost of a DeX workstation varies dramatically based on what you already own and what you prioritize.

| Component | Budget Option | Premium Option |
|---|---|---|
| **USB-C Hub** | Basic 4-port hub with HDMI + PD ($15-25) | Full dock with Ethernet, multiple USB 3.0, 100W PD ($50-80) |
| **Monitor** | Used 22" 1080p desktop monitor ($50-80) | New 15.6" USB-C portable monitor ($150-250) |
| **Keyboard** | Basic USB keyboard ($10-15) | Compact mechanical Bluetooth keyboard ($60-100) |
| **Mouse** | Basic USB mouse ($8-12) | Ergonomic Bluetooth mouse ($40-70) |
| **Charger** | Samsung included charger (free) | 65W GaN charger ($25-40) |
| **Total** | **$83-132** | **$325-540** |

<Note>
The budget setup delivers the same functional outcome as the premium setup. Your Linux desktop does not run faster because you spent more on peripherals. The premium option buys portability, build quality, and ergonomic comfort -- not performance.
</Note>

<Decision
  question="Budget or premium build?"
  options={[
    {
      label: "Budget desk setup",
      description: "Use an existing monitor, a basic USB hub, and inexpensive wired peripherals. Total cost under $100 if you already have a monitor. Best for trying out a DeX workstation before committing.",
      recommended: true,
    },
    {
      label: "Portable premium setup",
      description: "Invest in a portable USB-C monitor, compact Bluetooth peripherals, and a high-quality hub. Total cost $300-500 but you get a workstation that fits in a messenger bag and sets up in under 60 seconds.",
      recommended: false,
    },
  ]}
/>

## Compatibility Notes

Not every accessory works perfectly with every Samsung device. A few things to verify before purchasing:

- **USB-C hub compatibility** -- search for your specific Samsung model plus "DeX hub" in online forums. Some older Galaxy devices have known issues with certain chipsets used in hubs
- **Monitor resolution support** -- Galaxy S10 and newer support up to 4K through DeX. Older devices cap at 1080p. Galaxy Tab S series generally matches the phone generation's capabilities
- **Bluetooth codec support** -- if you plan to use Bluetooth audio while working, Samsung devices support SBC, AAC, and Samsung Scalable codecs. aptX support varies by model
- **USB peripheral power draw** -- some USB devices (external hard drives, DACs) draw more power than a phone's USB-C port can supply through a hub. If a USB device is not recognized, it may need its own power source

<BestPractice>
Before investing in a full accessory kit, test DeX with whatever you have on hand -- any HDMI monitor, any USB keyboard and mouse, even a basic hub borrowed from a friend. Confirm that DeX meets your needs before spending money on optimized hardware.
</BestPractice>

## Next Steps

- [DeX Overview](/docs/samsung/dex-overview) -- wired vs. wireless DeX and display configuration fundamentals
- [DeX Optimization](/docs/samsung/dex-optimization) -- software-side tuning to get the best performance from your hardware
