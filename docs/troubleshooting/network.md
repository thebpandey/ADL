---
sidebar_position: 5
title: "Network Issues"
description: "Troubleshooting network connectivity problems including DNS, apt downloads, and proxy configuration."
---

# Network Issues

Networking inside ADL works differently than on a standard Linux system. Because proot does not create a real network namespace, the Ubuntu environment shares Android's network stack directly. This means your Linux apps use the same IP address, DNS servers, and routes as your Android device --- but it also means that certain network configurations require manual adjustments.

This page covers the most common network problems and how to fix them.

---

## No Internet Inside Ubuntu

If you can browse the web on your Android device but have no connectivity inside the Ubuntu environment, the issue is almost always related to how proot forwards network calls.

<Troubleshooting items={[
  {
    problem: "ping, curl, and wget all fail with &apos;Network is unreachable&apos;",
    solution: "First, confirm your Android device has a working internet connection. Then verify that Termux itself has network access by running &apos;curl https://example.com&apos; in a plain Termux shell (outside proot). If Termux works but Ubuntu does not, restart the proot session by exiting and re-entering Ubuntu. Proot inherits the network state at launch time, so if you connected to Wi-Fi after starting the session, the environment may not see the new connection."
  },
  {
    problem: "Network worked before but stopped after switching from Wi-Fi to mobile data (or vice versa)",
    solution: "Proot does not automatically detect network changes on the Android side. Exit your Ubuntu session and start it again. This forces proot to pick up the new network interface and DNS configuration."
  },
  {
    problem: "Everything times out but DNS resolves correctly",
    solution: "Some Android ROMs apply aggressive battery optimization to Termux, which throttles or kills background network sockets. Go to Android Settings > Apps > Termux > Battery and set it to &apos;Unrestricted&apos; or &apos;No restrictions&apos;. Also check that any VPN or firewall app on your device is not blocking Termux traffic."
  }
]} />

To restart your Ubuntu session, exit and re-enter:

<CopyCommand command="exit" />
<CopyCommand command="ubuntu" />

If you have not yet set up Ubuntu, see the [installation guide](/docs/quick-start/install-ubuntu).

---

## DNS Resolution Fails

DNS problems are the single most common network issue in proot environments. Because proot intercepts system calls but does not fully virtualize the network layer, the `/etc/resolv.conf` file inside Ubuntu can end up empty or pointing to an unreachable nameserver.

<Troubleshooting items={[
  {
    problem: "&apos;Temporary failure resolving&apos; errors when running apt or curl",
    solution: "Your /etc/resolv.conf is likely empty or misconfigured. Write a working nameserver configuration by running the command below. This points DNS resolution at Google&apos;s public DNS servers, which are reachable from virtually any network."
  },
  {
    problem: "resolv.conf keeps getting overwritten or emptied on each session start",
    solution: "Some proot startup scripts regenerate resolv.conf from Android&apos;s DNS settings, which may be empty if the device has not fully initialized networking. To make your DNS configuration persistent, create the file and then mark it as immutable with chattr. If chattr is not available inside proot (it often is not), add the nameserver write command to your .bashrc so it runs on each login."
  },
  {
    problem: "DNS works for some domains but not others",
    solution: "This usually indicates that your network provider or Android device is using a DNS server with filtering or split-horizon DNS. Switch to a public DNS provider to rule out provider-side filtering. If you are on a corporate or school network that requires their DNS for internal domains, see the Proxy Issues section below."
  }
]} />

Set up a working DNS configuration:

```bash
echo 'nameserver 8.8.8.8' > /etc/resolv.conf
echo 'nameserver 8.8.4.4' >> /etc/resolv.conf
```

Verify that DNS resolution works:

<CopyCommand command="nslookup google.com" />

<Tip>
If nslookup is not installed, you can test DNS with ping instead. Run `ping -c 1 google.com` --- if it resolves to an IP address, DNS is working even if the ping itself times out (ICMP is often blocked).
</Tip>

To make the fix persistent across sessions, add it to your shell profile:

```bash
echo "echo 'nameserver 8.8.8.8' > /etc/resolv.conf" >> ~/.bashrc
```

---

## apt Cannot Download Packages

Package manager failures are often a downstream symptom of DNS or connectivity problems, but apt has its own set of issues related to repository configuration and transport.

<Troubleshooting items={[
  {
    problem: "&apos;Could not resolve&apos; errors when running apt update",
    solution: "This is a DNS problem. Follow the steps in the DNS Resolution Fails section above to configure /etc/resolv.conf with a working nameserver."
  },
  {
    problem: "&apos;Failed to fetch&apos; with 404 Not Found errors",
    solution: "The Ubuntu mirror you are using may be out of date or unreachable from your region. Update your sources.list to use the main Ubuntu archive. Run: sed -i &apos;s|http://ports.ubuntu.com|http://archive.ubuntu.com|g&apos; /etc/apt/sources.list and then run apt update again. If you are on an ARM device (most Android phones), make sure you are using ports.ubuntu.com, not archive.ubuntu.com --- the latter only hosts x86 packages."
  },
  {
    problem: "&apos;Hash Sum mismatch&apos; errors during apt update",
    solution: "This typically happens when a transparent proxy or network middlebox is modifying the package metadata in transit. Clear the apt cache and try again. If the problem persists, switch to an HTTPS mirror to prevent tampering."
  },
  {
    problem: "apt hangs or is extremely slow during downloads",
    solution: "Try switching to a geographically closer mirror. You can also set apt to use IPv4 only, which avoids issues on networks with broken IPv6 connectivity."
  }
]} />

Clear the apt cache and rebuild:

<CopyCommand command="rm -rf /var/lib/apt/lists/*" />
<CopyCommand command="apt clean" />
<CopyCommand command="apt update" />

Force apt to use IPv4 only:

```bash
echo 'Acquire::ForceIPv4 "true";' > /etc/apt/apt.conf.d/99force-ipv4
```

<Warning>
Do not run `apt upgrade` immediately after fixing network issues. Run `apt update` first to refresh the package lists, then upgrade. Running upgrade with stale lists can lead to broken dependencies.
</Warning>

---

## wget/curl Fails with SSL or Connection Errors

SSL and TLS errors inside proot usually stem from missing or outdated certificate bundles rather than actual security problems.

<Troubleshooting items={[
  {
    problem: "curl reports &apos;SSL certificate problem: unable to get local issuer certificate&apos;",
    solution: "The CA certificate bundle is either missing or outdated. Install or update it by running: apt install --reinstall ca-certificates. Then run update-ca-certificates to rebuild the certificate store."
  },
  {
    problem: "wget reports &apos;ERROR: cannot verify certificate&apos; for HTTPS URLs",
    solution: "This is the same root cause as the curl SSL error --- a missing CA bundle. Install ca-certificates as described above. As a temporary workaround, you can pass --no-check-certificate to wget, but this disables all certificate verification and should not be used as a permanent solution."
  },
  {
    problem: "Connection refused or connection reset errors on port 443",
    solution: "Some networks block outbound HTTPS traffic or route it through a proxy. Test whether you can reach any HTTPS site at all by trying: curl -v https://1.1.1.1. If even IP-based HTTPS fails, your network is likely intercepting TLS traffic. See the Proxy Issues section below."
  },
  {
    problem: "SSL errors only appear for specific sites",
    solution: "If you are on a corporate or school network, a local TLS inspection appliance may be re-signing certificates with its own CA. You need to install the organization&apos;s root CA certificate into the Ubuntu trust store. Obtain the certificate file (usually a .crt or .pem) and copy it to /usr/local/share/ca-certificates/, then run update-ca-certificates."
  }
]} />

Reinstall and update certificates:

<CopyCommand command="apt install --reinstall ca-certificates" />
<CopyCommand command="update-ca-certificates" />

<Note>
If apt itself fails with SSL errors (a chicken-and-egg problem), temporarily switch your sources.list to use `http://` instead of `https://` to install ca-certificates, then switch back to HTTPS afterward.
</Note>

---

## Proxy Issues (Corporate/School Networks)

If you are behind a corporate firewall, school network, or any environment that requires a proxy server for internet access, you need to configure both the shell environment and individual tools to route traffic through the proxy.

<Troubleshooting items={[
  {
    problem: "All network requests time out, but the device has internet through a proxy",
    solution: "Proot inherits Android&apos;s network stack but not its proxy settings. You need to manually set the HTTP_PROXY and HTTPS_PROXY environment variables inside Ubuntu. Ask your network administrator for the proxy address and port."
  },
  {
    problem: "apt works through the proxy but git/curl/wget do not",
    solution: "Each tool reads proxy settings differently. Set the proxy in your shell environment so all tools pick it up. Add the export lines to your .bashrc for persistence. For git specifically, you may also need to run: git config --global http.proxy http://proxy:port"
  },
  {
    problem: "Proxy requires authentication and tools keep prompting for credentials",
    solution: "Include the username and password in the proxy URL using the format http://user:password@proxy:port. Note that this stores credentials in plain text in your shell profile, which is acceptable inside a personal proot environment but should not be done on shared systems."
  },
  {
    problem: "apt fails with &apos;407 Proxy Authentication Required&apos;",
    solution: "Configure apt&apos;s proxy settings separately from the shell environment. Create a proxy configuration file for apt with the authenticated proxy URL."
  }
]} />

Set proxy environment variables for the current session:

<CopyCommand command="export HTTP_PROXY=http://proxy.example.com:8080" />
<CopyCommand command="export HTTPS_PROXY=http://proxy.example.com:8080" />
<CopyCommand command="export NO_PROXY=localhost,127.0.0.1" />

Make the proxy configuration persistent:

```bash
echo 'export HTTP_PROXY=http://proxy.example.com:8080' >> ~/.bashrc
echo 'export HTTPS_PROXY=http://proxy.example.com:8080' >> ~/.bashrc
echo 'export NO_PROXY=localhost,127.0.0.1' >> ~/.bashrc
```

Configure apt to use the proxy:

```bash
echo 'Acquire::http::Proxy "http://proxy.example.com:8080";' > /etc/apt/apt.conf.d/99proxy
```

<BestPractice>
Replace `proxy.example.com:8080` with your actual proxy address and port. If you do not know your proxy settings, check your Android Wi-Fi configuration --- tap the connected network, look for "Proxy" settings --- or ask your network administrator.
</BestPractice>

<Tip>
If your organization uses a PAC (Proxy Auto-Configuration) file instead of a fixed proxy address, you will need to read the PAC file to determine the actual proxy server. Most PAC files are JavaScript that returns a proxy address based on the destination URL. Open the PAC URL in a browser to inspect it, or ask your IT department for the direct proxy address.
</Tip>

---

## IPv6 Issues

IPv6 support inside proot is inconsistent. Many networks provide partial or broken IPv6 connectivity, which can cause tools to attempt IPv6 connections, time out, and only then fall back to IPv4 --- making everything feel slow.

<Troubleshooting items={[
  {
    problem: "Connections are slow or time out before eventually succeeding",
    solution: "Your system is likely attempting IPv6 connections first, timing out, then falling back to IPv4. If your network does not fully support IPv6, disable IPv6 preference in the resolver or force tools to use IPv4. This eliminates the timeout delay on each connection attempt."
  },
  {
    problem: "apt update is extremely slow or produces &apos;Cannot initiate the connection&apos; errors referencing IPv6 addresses",
    solution: "Force apt to use IPv4 only. This bypasses the IPv6 resolution entirely and connects directly over IPv4."
  },
  {
    problem: "IPv6 works on the Android device but not inside proot",
    solution: "Proot&apos;s system call translation layer does not always handle IPv6 socket operations correctly. This is a known limitation. For most use cases, forcing IPv4 inside proot is a reliable workaround that does not sacrifice functionality since all major Ubuntu mirrors and services are accessible over IPv4."
  },
  {
    problem: "wget and curl hang when connecting to IPv6-only services",
    solution: "If a service is only reachable via IPv6 and your proot environment cannot handle IPv6 sockets, you have limited options. Try running the request from Termux directly (outside proot) where IPv6 may work. For recurring needs, set up a forwarding proxy in Termux that accepts IPv4 connections and relays them over IPv6."
  }
]} />

Force apt to use IPv4 only:

```bash
echo 'Acquire::ForceIPv4 "true";' > /etc/apt/apt.conf.d/99force-ipv4
```

Configure the system resolver to prefer IPv4 over IPv6:

```bash
echo 'precedence ::ffff:0:0/96 100' >> /etc/gai.conf
```

Force curl to use IPv4:

<CopyCommand command="curl -4 https://example.com" />

Force wget to use IPv4:

<CopyCommand command="wget -4 https://example.com" />

<BestPractice>
Unless you specifically need IPv6 connectivity, set the apt IPv4 preference and the gai.conf resolver preference as part of your initial ADL setup. This prevents a common class of mysterious slowness and timeout errors that are difficult to diagnose.
</BestPractice>

---

## Still Having Issues?

If none of the solutions above resolve your problem:

1. Verify basic connectivity step by step --- Android browser, then Termux, then Ubuntu inside proot.
2. Check that Termux has network permission granted in Android settings.
3. Try a different network (switch between Wi-Fi and mobile data) to rule out network-specific filtering.
4. Restart Termux completely --- swipe it away from Android's recent apps and reopen it.

For setup-related issues, refer to the [Ubuntu installation guide](/docs/quick-start/install-ubuntu).
