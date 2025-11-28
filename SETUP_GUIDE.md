# 🎯 Darts Scores - Complete Setup Guide for Beginners

This guide will walk you through everything you need to get the Darts Scores app running on your computer, even if you've never used Git or Node.js before.

---

## 📋 Table of Contents
1. [What You're Installing](#what-youre-installing)
2. [Step 1: Install Node.js](#step-1-install-nodejs)
3. [Step 2: Get the Project Files](#step-2-get-the-project-files)
4. [Step 3: Install Dependencies](#step-3-install-dependencies)
5. [Step 4: Run the Application](#step-4-run-the-application)
6. [Step 5: Using the App](#step-5-using-the-app)
7. [Troubleshooting](#troubleshooting)
8. [Stopping the App](#stopping-the-app)

---

## What You're Installing

This is a **Darts scoring application** that runs on your computer. You'll be able to:
- Track darts scores for 301, 501, or 701 games
- Practice solo or play with a friend
- View detailed statistics and game history
- Get checkout suggestions
- All your data is saved automatically

**You need:**
- A computer (Windows, Mac, or Linux)
- About 15 minutes
- An internet connection (only for setup)

---

## Step 1: Install Node.js

Node.js is the software that runs the app. Think of it like installing Java or .NET.

### For Windows:

1. **Download Node.js**
   - Go to: https://nodejs.org/
   - Click the **green button** that says "LTS" (Long Term Support)
   - This downloads a file like `node-v20.x.x-x64.msi`

2. **Install Node.js**
   - Double-click the downloaded file
   - Click "Next" through all the prompts
   - Accept the license agreement
   - **Keep all default settings**
   - Click "Install"
   - Wait for it to finish (takes 1-2 minutes)
   - Click "Finish"

3. **Verify Installation**
   - Press `Windows Key + R`
   - Type: `cmd` and press Enter
   - In the black window that appears, type:
     ```bash
     node --version
     ```
   - Press Enter
   - You should see something like `v20.11.0`
   - If you see a version number, you're good! If not, restart your computer and try again.

### For Mac:

1. **Download Node.js**
   - Go to: https://nodejs.org/
   - Click the **green button** that says "LTS"
   - This downloads a `.pkg` file

2. **Install Node.js**
   - Double-click the downloaded `.pkg` file
   - Follow the installation wizard
   - You may need to enter your Mac password
   - Click "Install"
   - Wait for completion
   - Click "Close"

3. **Verify Installation**
   - Press `Command + Space`
   - Type: `terminal` and press Enter
   - In the window that appears, type:
     ```bash
     node --version
     ```
   - Press Enter
   - You should see a version number like `v20.11.0`

---

## Step 2: Get the Project Files

You have **two options** to get the files:

### Option A: Using Git (Recommended)

**If you don't have Git yet:**

1. **Install Git**
   - Windows: Download from https://git-scm.com/download/win
   - Mac: Download from https://git-scm.com/download/mac
   - Install with all default settings

2. **Clone the Project**
   - Open Command Prompt (Windows) or Terminal (Mac)
   - Navigate to where you want the files:
     ```bash
     cd Documents
     ```
   - Download the project:
     ```bash
     git clone [YOUR_REPOSITORY_URL]
     ```
   - Replace `[YOUR_REPOSITORY_URL]` with the actual URL
   - The files will download into a folder called `darts-scores`

### Option B: Download as ZIP (No Git Required)

1. **Get the ZIP file from the person who sent you this**
   - They can create it by:
     - Going to the `darts-scores` folder on their computer
     - Right-click → Send to → Compressed (zipped) folder
     - Send you that ZIP file

2. **Extract the ZIP**
   - Save the ZIP file somewhere easy to find (like your Desktop or Documents)
   - Right-click the ZIP file
   - Choose "Extract All..." (Windows) or "Open" (Mac)
   - Remember where you extracted it!

---

## Step 3: Install Dependencies

The app needs some additional software libraries. Don't worry, this is automatic!

### Windows Instructions:

1. **Open Command Prompt**
   - Press `Windows Key + R`
   - Type: `cmd`
   - Press Enter

2. **Navigate to the Project**
   - Type this command (adjust the path to where YOU put the files):
     ```bash
     cd C:\Users\YourName\Documents\darts-scores
     ```
   - Replace `YourName` with your actual username
   - Press Enter

3. **Install Backend Dependencies**
   - Type:
     ```bash
     cd backend
     ```
   - Press Enter
   - Type:
     ```bash
     npm install
     ```
   - Press Enter
   - **Wait 30-60 seconds** while it downloads everything
   - You'll see lots of text scrolling - this is normal!

4. **Install Frontend Dependencies**
   - Type:
     ```bash
     cd ..\frontend
     ```
   - Press Enter
   - Type:
     ```bash
     npm install
     ```
   - Press Enter
   - **Wait 30-60 seconds** again
   - When it's done, you'll see your cursor blinking again

### Mac/Linux Instructions:

1. **Open Terminal**
   - Press `Command + Space`
   - Type: `terminal`
   - Press Enter

2. **Navigate to the Project**
   - Type:
     ```bash
     cd ~/Documents/darts-scores
     ```
   - Press Enter
   - (Adjust the path if you put it somewhere else)

3. **Install Backend Dependencies**
   - Type:
     ```bash
     cd backend
     npm install
     ```
   - Press Enter and wait

4. **Install Frontend Dependencies**
   - Type:
     ```bash
     cd ../frontend
     npm install
     ```
   - Press Enter and wait

---

## Step 4: Run the Application

You need to run TWO programs: the backend (server) and frontend (website).

### Windows Instructions:

**You'll need TWO Command Prompt windows:**

1. **Open First Command Prompt (Backend)**
   - Press `Windows Key + R`
   - Type: `cmd`
   - Press Enter
   - Navigate to backend:
     ```bash
     cd C:\Users\YourName\Documents\darts-scores\backend
     ```
   - Start the backend:
     ```bash
     npm start
     ```
   - **Keep this window open!** You should see:
     ```
     🎯 Darts Scores API running on http://localhost:3001
     ```

2. **Open Second Command Prompt (Frontend)**
   - Press `Windows Key + R` again
   - Type: `cmd`
   - Press Enter
   - Navigate to frontend:
     ```bash
     cd C:\Users\YourName\Documents\darts-scores\frontend
     ```
   - Start the frontend:
     ```bash
     npm run dev
     ```
   - **Keep this window open too!** You should see:
     ```
     ➜  Local:   http://localhost:5173/
     ```

3. **Open Your Browser**
   - Open Chrome, Firefox, Edge, or Safari
   - Go to: **http://localhost:5173**
   - The Darts Scores app should appear!

### Mac/Linux Instructions:

**You'll need TWO Terminal windows:**

1. **Open First Terminal (Backend)**
   - Press `Command + Space`
   - Type: `terminal`
   - Press Enter
   - Navigate and start:
     ```bash
     cd ~/Documents/darts-scores/backend
     npm start
     ```
   - **Keep this window open!**

2. **Open Second Terminal (Frontend)**
   - Press `Command + Space`
   - Type: `terminal`
   - Press Enter
   - Navigate and start:
     ```bash
     cd ~/Documents/darts-scores/frontend
     npm run dev
     ```
   - **Keep this window open!**

3. **Open Your Browser**
   - Go to: **http://localhost:5173**

---

## Step 5: Using the App

### First Time Setup

When you first open the app, you'll see the **Game Setup** screen:

1. **Enter Player Names**
   - Type your name (or names for 2-player mode)
   - Or choose "Solo Practice" for single-player

2. **Choose Game Type**
   - **301**: Quick games (5-10 minutes)
   - **501**: Standard games (10-20 minutes)
   - **701**: Long games (20-30 minutes)
   - **Endless**: Practice mode (no countdown, just accumulate score)

3. **Choose Format**
   - **Double Out**: Must finish on a double (traditional rules)
   - **Straight Out**: Can finish on any dart (easier)

4. **Number of Legs** (2-player only)
   - Choose Best of 1, 3, 5, 7, or 9

5. **Click "Start Game"**

### Playing a Game

1. **Score Entry Methods**
   - **Dartboard Tab**: Click on the dartboard where you hit
   - **Keypad Tab**: Enter numbers manually
   - **Table Tab**: Quick button access to all scores

2. **After Each Turn (3 Darts)**
   - Click "Complete Turn" to save and move to next player
   - Or click "Undo" to remove last dart
   - Or click "Reset" to clear all 3 darts

3. **View Statistics**
   - Click the **Stats** tab to see:
     - 3-dart average
     - 1-dart average
     - Highest score
     - Doubles/triples hit
     - And more!

4. **View History**
   - Click the **History** tab to see all throws

5. **Game Complete**
   - Game ends when someone reaches exactly 0
   - In multi-leg games, first to win majority of legs wins

### After the Game

- All your data is automatically saved to a database
- Click "View Player History" on the setup screen to see:
  - All-time statistics
  - Past games
  - Performance trends

---

## Troubleshooting

### "Command not found" or "node is not recognized"

**Problem**: Node.js isn't installed properly or not in your PATH.

**Solution**:
1. Restart your computer
2. Try the `node --version` check again
3. If still not working, uninstall Node.js and reinstall it
4. Make sure to check "Add to PATH" during installation

---

### "npm install" fails or gives errors

**Problem**: Network issues or permissions.

**Solution**:
1. Make sure you have internet connection
2. Try running as Administrator (Windows) or with `sudo` (Mac/Linux)
3. Windows users: If you see Python errors, you can ignore them - the app will still work

---

### Backend won't start - "Port 3001 already in use"

**Problem**: Something else is using port 3001.

**Solution**:
1. Close all Command Prompt/Terminal windows
2. Restart your computer
3. Try running the backend again
4. Or change the port:
   - Edit `backend/server.js`
   - Find `const PORT = process.env.PORT || 3001;`
   - Change `3001` to `3002`

---

### Frontend won't start - "Port 5173 already in use"

**Problem**: Something else is using port 5173.

**Solution**:
1. The frontend will usually auto-select a different port (like 5174)
2. Use whatever port number it shows you
3. Or close other programs using that port

---

### Browser shows "Cannot connect" or blank page

**Problem**: Backend isn't running, or wrong URL.

**Solution**:
1. Make sure BOTH Command Prompt/Terminal windows are still open
2. Check both show "running" messages
3. Make sure you're going to `http://localhost:5173` (not `https`)
4. Try refreshing the page (F5)

---

### "I closed the windows by accident"

**Solution**:
1. Just start over from Step 4
2. Open two new Command Prompt/Terminal windows
3. Run `npm start` in backend
4. Run `npm run dev` in frontend
5. Refresh your browser

---

### Data disappeared after closing

**Problem**: This shouldn't happen - data is saved to a database file.

**Solution**:
1. Check if `backend/darts.db` file exists
2. If it's missing, the database will recreate (but data is lost)
3. Make backups of `backend/darts.db` to save your data

---

## Stopping the App

When you're done playing:

1. **Close your browser tab** (the one with localhost:5173)

2. **Stop the Frontend**
   - Go to the Command Prompt/Terminal running frontend
   - Press `Ctrl + C` (Windows/Linux) or `Command + C` (Mac)
   - Type `Y` if asked "Terminate batch job?"

3. **Stop the Backend**
   - Go to the Command Prompt/Terminal running backend
   - Press `Ctrl + C` (Windows/Linux) or `Command + C` (Mac)
   - Type `Y` if asked "Terminate batch job?"

4. **Close both windows**

**Your data is saved!** Next time you run the app, your game history will still be there.

---

## Next Time You Want to Play

1. Open TWO Command Prompt/Terminal windows
2. In the first:
   ```bash
   cd path/to/darts-scores/backend
   npm start
   ```
3. In the second:
   ```bash
   cd path/to/darts-scores/frontend
   npm run dev
   ```
4. Open browser to `http://localhost:5173`

---

## Tips for Easy Access

### Windows - Create Batch Files

Create two files to make starting easier:

**start-backend.bat**:
```batch
@echo off
cd C:\Users\YourName\Documents\darts-scores\backend
npm start
pause
```

**start-frontend.bat**:
```batch
@echo off
cd C:\Users\YourName\Documents\darts-scores\frontend
npm run dev
pause
```

Double-click these files to start each part!

### Mac - Create Shell Scripts

Create two files:

**start-backend.sh**:
```bash
#!/bin/bash
cd ~/Documents/darts-scores/backend
npm start
```

**start-frontend.sh**:
```bash
#!/bin/bash
cd ~/Documents/darts-scores/frontend
npm run dev
```

Make them executable:
```bash
chmod +x start-backend.sh start-frontend.sh
```

Double-click to run!

---

## Getting Help

If you're still stuck:

1. **Check the README.md** - Has technical details
2. **Ask the person who sent you this** - They can help troubleshoot
3. **Check you completed all steps** - Go through this guide again

---

## Backing Up Your Data

Your game history is stored in:
```
backend/darts.db
```

**To backup:**
1. Close the app completely (both backend and frontend)
2. Copy the `darts.db` file somewhere safe
3. To restore, just copy it back

---

## Enjoy! 🎯

You're all set! Start tracking your darts games and watch your skills improve over time.

**Quick Start Summary:**
1. Install Node.js (one time)
2. Get the files (one time)
3. Run `npm install` in both folders (one time)
4. Run `npm start` in backend + `npm run dev` in frontend (every time)
5. Open browser to `localhost:5173`
6. Play darts!
