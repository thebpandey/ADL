---
sidebar_position: 3
title: "Office Suites"
description: "Install and configure LibreOffice or OnlyOffice on your ADL desktop for documents, spreadsheets, and presentations."
---

# Office Suites

A Linux desktop without an office suite is a tough sell. Whether you need to write a report, build a spreadsheet, or put together a slide deck, you have two solid options in ADL: LibreOffice and OnlyOffice. Both handle Microsoft Office formats and run well on ARM hardware with the right configuration.

## LibreOffice

LibreOffice is the standard open-source office suite. It ships in the Ubuntu repositories, which makes installation straightforward.

### Install the Full Suite

To install every LibreOffice application at once:

<CopyCommand command="apt install libreoffice -y" />

This pulls in Writer (documents), Calc (spreadsheets), Impress (presentations), Draw (diagrams), Base (databases), and Math (formulas). The full install uses roughly 800MB to 1GB of storage.

### Install Individual Components

If storage is tight or you only need specific tools, install components separately:

<CopyCommand command="apt install libreoffice-writer -y" />

<CopyCommand command="apt install libreoffice-calc -y" />

<CopyCommand command="apt install libreoffice-impress -y" />

<Tip>
Installing individual components saves significant storage. Writer alone takes roughly 400MB less than the full suite. Start with what you need and add more later.
</Tip>

### Launch LibreOffice

After installation, LibreOffice appears in the XFCE applications menu under **Office**. You can also launch it from the terminal:

<CopyCommand command="libreoffice --writer" />

<CopyCommand command="libreoffice --calc" />

<CopyCommand command="libreoffice --impress" />

## OnlyOffice

OnlyOffice Desktop Editors is a strong alternative, especially if your primary concern is compatibility with Microsoft Office documents. Its interface closely mirrors the ribbon layout found in modern versions of Microsoft Office, which can feel more familiar.

### Install OnlyOffice

OnlyOffice is not in the default Ubuntu repositories. You need to add their official repository first:

<CopyCommand command="apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys CB2DE8E5" />

<CopyCommand command="echo 'deb https://download.onlyoffice.com/repo/debian squeeze main' | tee /etc/apt/sources.list.d/onlyoffice.list" />

<CopyCommand command="apt update && apt install onlyoffice-desktopeditors -y" />

<Warning title="ARM Compatibility">
OnlyOffice does not always provide ARM builds for every release. If the installation fails, check the OnlyOffice website for the latest ARM availability. LibreOffice is the safer choice on ARM devices.
</Warning>

## Microsoft Office Compatibility

Both suites can open and save files in Microsoft Office formats. Here is what to expect.

### Format Support

| Format | LibreOffice | OnlyOffice |
|--------|-------------|------------|
| `.docx` (Word) | Opens and saves. Minor formatting differences possible with complex layouts. | Excellent compatibility. Preserves most formatting faithfully. |
| `.xlsx` (Excel) | Full support. Complex macros (VBA) may not execute. | Strong support. Macro compatibility is limited. |
| `.pptx` (PowerPoint) | Opens and saves. Animations and transitions may render differently. | Good compatibility. Closer visual match to PowerPoint output. |
| `.doc`, `.xls`, `.ppt` (legacy) | Full support for older formats. | Supported but less tested than modern formats. |

<BestPractice>
If you regularly exchange files with Microsoft Office users, save your documents in `.docx`, `.xlsx`, or `.pptx` format rather than the default ODF formats. In LibreOffice, go to **Tools > Options > Load/Save > General** and set the default file format to the Microsoft equivalent for each application.
</BestPractice>

<Note>
Neither LibreOffice nor OnlyOffice runs Microsoft Office macros (VBA) reliably. If you depend on complex macros, you will need to find alternative approaches or rewrite them.
</Note>

## Performance Tuning for ARM

ADL runs on ARM processors with memory shared between Android and your Linux desktop. Office suites can feel sluggish without some adjustments.

<PerformanceNote>
LibreOffice ships with Java support enabled by default. On ARM devices under proot, Java adds substantial startup time and memory usage with little benefit for most users. Disabling it is the single biggest performance improvement you can make.
</PerformanceNote>

### Disable Java in LibreOffice

Java powers a few niche features in LibreOffice (some Base wizards and a handful of extensions). Most users never touch these.

1. Open LibreOffice.
2. Go to **Tools > Options > LibreOffice > Advanced**.
3. Uncheck **Use a Java runtime environment**.
4. Click **OK** and restart LibreOffice.

### Reduce Undo Steps

LibreOffice stores 100 undo steps by default. Each step consumes memory. On a memory-constrained device, cutting this down helps.

1. Go to **Tools > Options > LibreOffice > Memory**.
2. Set **Undo > Number of steps** to **20** or **30**.
3. Click **OK**.

### Disable Autocorrect and AutoInput

Autocorrect runs continuously as you type, consuming CPU cycles on every keystroke. If you notice lag while typing:

1. Go to **Tools > AutoCorrect Options**.
2. Under the **Options** tab, uncheck features you do not need --- particularly **Capitalize first letter of every sentence** and **Correct TWo INitial Capitals**.
3. In Calc, go to **Tools > AutoInput** and uncheck it to stop cell auto-completion.

### Reduce Graphics Cache

For devices with 4GB of RAM or less:

1. Go to **Tools > Options > LibreOffice > Memory**.
2. Set **Graphics cache > Use for LibreOffice** to **20MB** (default is 128MB).
3. Set **Memory per object** to **5MB**.

<Tip>
If LibreOffice still feels slow after these changes, try closing other applications. Remember that Android itself, Termux, and the XFCE desktop all share the same pool of RAM. A browser with several tabs open alongside LibreOffice can push a 4GB device to its limits.
</Tip>

## LibreOffice vs OnlyOffice

<Decision
  title="Which office suite should you use?"
  options={[
    {
      choice: "LibreOffice",
      pros: [
        "Available directly from Ubuntu repositories with reliable ARM support",
        "Full suite of applications including Draw, Base, and Math",
        "Large community and extensive documentation",
        "Lightweight individual component installs",
        "More mature and battle-tested on Linux"
      ],
      cons: [
        "Microsoft Office formatting can shift on complex documents",
        "Interface looks different from Microsoft Office",
        "Can feel slow without performance tuning on ARM"
      ]
    },
    {
      choice: "OnlyOffice",
      pros: [
        "Superior Microsoft Office format compatibility",
        "Familiar ribbon-style interface similar to Microsoft Office",
        "Clean, modern design"
      ],
      cons: [
        "ARM builds are not always available",
        "Requires adding a third-party repository",
        "Fewer applications --- no equivalent to Draw, Base, or Math",
        "Smaller community and less Linux-specific documentation"
      ]
    }
  ]}
/>

## Memory Usage

Office suites are among the heavier applications you will run on ADL. Plan accordingly.

| Application | Approximate RAM Usage |
|-------------|----------------------|
| LibreOffice Writer (simple document) | 150--250 MB |
| LibreOffice Calc (moderate spreadsheet) | 200--350 MB |
| LibreOffice Impress (basic presentation) | 200--300 MB |
| OnlyOffice (any editor) | 300--500 MB |

<Warning title="Memory Pressure">
On devices with 4GB of RAM or less, running an office suite alongside a web browser can cause Android to kill background processes or even terminate the Termux session. Save your work frequently. If your device has 3GB or less, avoid running other heavy applications at the same time.
</Warning>

<BestPractice>
Get into the habit of saving often --- use **Ctrl+S** regularly. If Android terminates Termux under memory pressure, any unsaved work is lost. LibreOffice also supports auto-recovery: go to **Tools > Options > Load/Save > General** and set the auto-recovery interval to 5 minutes.
</BestPractice>
