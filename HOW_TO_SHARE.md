# 📤 How to Share This Project with Friends

## Option 1: Share as ZIP File (Easiest for Non-Technical Friends)

### Creating the ZIP

1. **Navigate to the parent folder** containing `darts-scores`
   - On Windows: Right-click the `darts-scores` folder
   - Select "Send to" → "Compressed (zipped) folder"
   - This creates `darts-scores.zip`

2. **Share the ZIP**
   - Send via email (if under 25MB)
   - Upload to Google Drive, Dropbox, or OneDrive
   - Send via USB drive
   - Use WeTransfer for large files

### What Your Friend Does

1. Download and extract the ZIP file
2. Read `QUICK_START.txt` or `SETUP_GUIDE.md`
3. Double-click the launch scripts to run

---

## Option 2: Share via GitHub (Best for Tech-Savvy Friends)

### If You Haven't Created a GitHub Repository Yet

1. **Create GitHub Account** (free)
   - Go to https://github.com/signup
   - Follow the signup process

2. **Create New Repository**
   - Click "+" in top-right → "New repository"
   - Name: `darts-scores`
   - Description: "Professional darts scoring web application"
   - Keep it Public (or Private if you want)
   - Don't initialize with README (you already have one)
   - Click "Create repository"

3. **Push Your Code**
   - GitHub will show you commands like:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/darts-scores.git
   git branch -M master
   git push -u origin master
   ```
   - Run these commands in your `darts-scores` folder

4. **Share the Link**
   - Your repository URL: `https://github.com/YOUR_USERNAME/darts-scores`
   - Send this link to friends

### What Your Friend Does

1. Install Git (if needed): https://git-scm.com/
2. Open Terminal/Command Prompt
3. Run:
   ```bash
   git clone https://github.com/YOUR_USERNAME/darts-scores.git
   ```
4. Follow the QUICK_START.txt instructions

---

## Option 3: USB Drive

### Creating the USB Copy

1. Copy the entire `darts-scores` folder to a USB drive
2. Include a note that they should:
   - Copy the folder to their computer first
   - Read QUICK_START.txt
   - Double-click the launch scripts

### What Your Friend Does

1. Copy folder from USB to their computer
2. Follow QUICK_START.txt

---

## What Files to Include

### ✅ MUST Include (Core Application)
```
darts-scores/
├── backend/
│   ├── node_modules/ (optional - they can install)
│   ├── database.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
├── frontend/
│   ├── node_modules/ (optional - they can install)
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── index.html
├── README.md
├── SETUP_GUIDE.md
├── QUICK_START.txt
├── start-backend.bat
├── start-backend.sh
├── start-frontend.bat
└── start-frontend.sh
```

### ❌ SKIP These (Makes Download Smaller)
```
- backend/node_modules/ (can be installed with npm install)
- frontend/node_modules/ (can be installed with npm install)
- backend/darts.db (this is your personal game data)
- .git/ (unless sharing via Git)
- tmp/ (temporary files)
```

**Why skip node_modules?**
- Makes the download 100x smaller (from ~200MB to ~2MB)
- The launch scripts automatically install dependencies
- Avoids platform-specific binary issues

---

## Creating a "Clean" Distribution

### Method 1: Manual Copy

1. Create a new folder called `darts-scores-distribution`
2. Copy everything EXCEPT:
   - `node_modules` folders
   - `.git` folder
   - `darts.db` file
   - Any `.env` files
3. Zip this folder

### Method 2: Using Git (If You Use GitHub)

Your friends can just clone the repository and it won't include:
- `node_modules` (handled by .gitignore)
- `darts.db` (handled by .gitignore)

---

## Pre-Packaged Distribution (Advanced)

If you want to create an even easier distribution:

### Windows Executable (Using electron-builder)

This would create a double-click .exe file, but requires additional setup.
Most people won't need this - the scripts are already very easy.

### Mac App Bundle

Similar to Windows, but creates a .app file.
Again, the shell scripts are usually sufficient.

---

## Recommended Distribution Methods by User Type

### For Non-Technical Friends
**Best: ZIP File**
1. Create clean copy without node_modules
2. Zip it up
3. Share via Google Drive or email
4. Tell them to read QUICK_START.txt

### For Developer Friends
**Best: GitHub Repository**
1. Push to GitHub
2. Share repository link
3. They can `git clone` and go

### For Family/Coworkers
**Best: USB Drive or Network Share**
1. Copy to USB
2. Hand it to them
3. Show them QUICK_START.txt

---

## Support Instructions for Your Friends

### Point them to:

1. **First Stop**: `QUICK_START.txt`
   - 4-step process to get running

2. **Need More Detail**: `SETUP_GUIDE.md`
   - Complete walkthrough with screenshots-level detail
   - Troubleshooting section

3. **Technical Info**: `README.md`
   - For developers who want architecture details
   - API documentation link

4. **Backend API**: `backend/README.md`
   - If they want to understand the database
   - API endpoint reference

---

## Important Notes

### Node.js Installation
- Everyone needs to install Node.js (18+)
- This is the ONLY prerequisite
- Free download from https://nodejs.org/
- Takes 2 minutes to install

### Internet Connection
- Only needed for initial `npm install`
- After that, works completely offline
- All data stored locally

### Data Privacy
- Each person has their own database
- Data never leaves their computer
- Database file: `backend/darts.db`
- They can backup this file to save their game history

### Updates
- If you add features and want to share updates:
  - **GitHub users**: Just `git pull`
  - **ZIP users**: Send them the new files
  - **Important**: Tell them to backup their `darts.db` first!

---

## Sample Email to Send

```
Subject: Darts Scoring App - Setup Instructions

Hey!

I've shared a darts scoring app with you. It's a web app that runs
on your computer - tracks scores, statistics, and game history.

QUICK SETUP:
1. Install Node.js from https://nodejs.org/ (click the green "LTS" button)
2. Extract the ZIP file I sent you
3. Double-click "start-backend.bat" (or .sh on Mac)
4. Double-click "start-frontend.bat" (or .sh on Mac)
5. Open browser to http://localhost:5173

Full instructions are in QUICK_START.txt and SETUP_GUIDE.md.

Let me know if you have any questions!
```

---

## License Note

This project includes attribution to Claude Code. If you share it:
- Keep the README.md credits
- Keep the "Generated with Claude Code" notes
- Feel free to add your own name as maintainer

---

## Questions?

If your friends have issues:
1. Check SETUP_GUIDE.md troubleshooting section
2. Make sure they installed Node.js
3. Make sure both scripts are running
4. Check they're going to the right URL (http://localhost:5173)

Most issues are solved by:
- Restarting the scripts
- Clearing browser cache
- Checking Node.js is installed

---

Happy darts! 🎯
