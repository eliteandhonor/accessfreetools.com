---
slug: localsend-transfer-files-phone-computer
title: "LocalSend: Move Files Between Your Phone and Computer"
description: "Use LocalSend to send files between nearby Windows, Mac, Linux, Android, and iOS devices. Learn the steps, network limits, and settings to check."
searchIntent: "The reader wants to move files between nearby devices with different operating systems."
status: review-draft
researchDate: 2026-10-08
project: localsend/localsend
license: Apache-2.0
release: v1.18.2
releasePublishedAt: 2026-08-21T14:02:01Z
releaseCommit: af0416be50770a97760f7070684bc667b759a15c
sourceMainCommit: c1ce322fb3acf08e44f329b8b7208b8b0d91e244
visual: ./localsend-transfer-diagram.svg
visualAlt: "Original illustration of a phone and laptop sending files through the same local network, with a reminder to confirm the receiving device."
visualCaption: "Original workflow illustration, not a LocalSend screenshot."
---

# LocalSend: Move Files Between Your Phone and Computer

Your photos are on an Android phone. Your presentation is on a Windows laptop. You need the photos on the laptop, but you don't want another cloud upload just to move files across the room.

[LocalSend](https://localsend.org/) handles that job over a local network. Its native app is available for Windows, macOS, Linux, Android, and iOS. Install it on the two devices, select your files, and choose the receiving device. The transfer doesn't need an internet connection or a LocalSend account. You still need a working local connection between the devices.

## What LocalSend helps you do

LocalSend is useful for a one-off handoff: photos from a phone to a computer, a PDF from a laptop to a tablet, or a short piece of text between devices. The project documents file and message sharing over your local network in its [README](https://github.com/localsend/localsend/blob/af0416be50770a97760f7070684bc667b759a15c/README.md).

The repository's full [licence](https://github.com/localsend/localsend/blob/af0416be50770a97760f7070684bc667b759a15c/LICENSE) is Apache 2.0. That makes this an open-source project, rather than code that is merely visible on GitHub. This guide covers the native app workflow documented for [v1.18.2](https://github.com/localsend/localsend/releases/tag/v1.18.2), published on 21 August 2026. Check the project's current downloads before installing.

If you're comparing it with another GitHub download, the [Access Free Tools guide to checking a project before installation](https://accessfreetools.com/blog/how-to-check-github-project-before-installing/) explains how to inspect its source, licence, release, and requested access.

## Send your first file

Start with one ordinary file so you can confirm the destination and save location before sending a larger batch.

1. **Install and open the app on both devices.** Use the links on the [official download page](https://localsend.org/download). The README recommends an app store or package manager because the app itself doesn't auto-update.

2. **Connect both devices to the same local network.** For this walkthrough, use your own Wi-Fi network. Allow LocalSend's local-network permission when your operating system requests it.

3. **Check the receiver.** Open its **Receive** tab and read its device name. On desktop or Android, check **Save to folder** in Settings. This option isn't shown on iOS. To review each file request yourself, turn off **Quick Save** and **Quick Save for Favorites**.

4. **Select the file on the sender.** Open **Send**, then choose **File** or **Media**, depending on your platform and what you're sending. Check the selected files and size, then choose the receiver under **Nearby devices**.

5. **Confirm the incoming request.** Check the sender and press **Accept** on the receiver when prompted. Wait for the transfer to finish, then open the received file and confirm it's the one you wanted.

These steps follow the release's [app labels and help text](https://github.com/localsend/localsend/blob/af0416be50770a97760f7070684bc667b759a15c/app/assets/i18n/en.json) and [receive screen source](https://github.com/localsend/localsend/blob/af0416be50770a97760f7070684bc667b759a15c/app/lib/pages/receive_page.dart). Automatic acceptance changes the fifth step: Quick Save accepts file requests automatically, and the favorites setting accepts requests from favorite devices. Check those settings before relying on a confirmation prompt.

## Example: 12 photos for a presentation

Suppose you need 12 photos, each about 4 MB, on your laptop. That's roughly 48 MB to transfer. Select those 12 photos in the phone app and check the file count before choosing the laptop's device name.

After the transfer finishes, check that all 12 files arrived and open a couple of them. The useful result is having the photos ready for your slides without adding a cloud upload to this workflow. The numbers are a hypothetical example, not a measured transfer test. They don't predict how long your Wi-Fi will take.

## If the other device doesn't appear

Wi-Fi alone isn't enough if the network keeps devices apart. LocalSend's [current troubleshooting notes](https://github.com/localsend/localsend/blob/c1ce322fb3acf08e44f329b8b7208b8b0d91e244/README.md#troubleshooting) name several causes:

- **Guest network isolation:** Some routers prevent guest devices from communicating with each other. Try your own main network. On a managed network, ask its administrator rather than changing shared settings.

- **Missing permission:** Check the app's local-network permission on macOS or iOS.

- **Firewall restrictions:** The documented default incoming port is **53317**, using TCP and UDP. Follow the project's setup instructions for the relevant local-network rule. Leave the firewall running.

- **VPN restrictions:** Some VPN configurations block local-network traffic. Check whether your VPN allows LAN connections.

The release's help text also offers **Manual sending**, where you enter the receiver's IP address. That can help when discovery is the problem. The receiver still needs to be reachable.

## Settings and limits to keep in mind

Leave **Encryption** enabled on both devices. The app supports HTTPS, but its [own warning text](https://github.com/localsend/localsend/blob/af0416be50770a97760f7070684bc667b759a15c/app/assets/i18n/en.json) says turning encryption off switches communication to unencrypted HTTP. Local transfer and an open-source licence don't establish that every file or device is safe to trust.

Keep LocalSend open during your first transfer. The v1.18 app notes say iOS must remain in the foreground. A larger batch may take longer than the small file you tried first. This guide makes no speed comparison.

LocalSend's documented local-network workflow won't deliver a file to someone in another city. It also isn't a backup plan by itself. Keep your original files until you have checked the received copies, and use a separate backup process for anything important.

For a nearby handoff, start with the [official downloads](https://localsend.org/download), check the receiving device, and send one file first.

## Sources and how this guide was prepared

This guide was prepared with AI assistance from the project's documentation and source files, checked on 8 October 2026. LocalSend was not installed or performance-tested for this article. The example is hypothetical. The illustration is original and is not an app screenshot.

The main sources are the [release-pinned README](https://github.com/localsend/localsend/blob/af0416be50770a97760f7070684bc667b759a15c/README.md), [full Apache 2.0 licence](https://github.com/localsend/localsend/blob/af0416be50770a97760f7070684bc667b759a15c/LICENSE), [v1.18.2 release notes](https://github.com/localsend/localsend/releases/tag/v1.18.2), [release app help text](https://github.com/localsend/localsend/blob/af0416be50770a97760f7070684bc667b759a15c/app/assets/i18n/en.json), and [current troubleshooting notes](https://github.com/localsend/localsend/blob/c1ce322fb3acf08e44f329b8b7208b8b0d91e244/README.md#troubleshooting). These describe the reviewed versions. Future releases may change the steps or requirements.
