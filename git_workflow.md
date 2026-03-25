# MediConnect Git Submission Workflow

To ensure you save your changes to your own GitHub **and** contribute back to the team repo safely, follow these exact steps.

### 1. Initialize the Root Repository
Currently, only your `frontend` folder is a Git repo. To save the *full* project (Backend + Frontend), we need to initialize Git at the root.

1.  Open your terminal in the main project folder (`scratch`).
2.  Run:
    ```bash
    git init
    # Create a .gitignore to keep the repo clean
    echo "node_modules/\n.env\n.DS_Store\nfrontend/node_modules/\nbackend/node_modules/" > .gitignore
    ```

### 2. Save Your Changes Locally
1.  Stage all files:
    ```bash
    git add .
    ```
2.  Commit your work:
    ```bash
    git commit -m "MediConnect Upgrade: USSD Payment & Premium UI"
    ```

### 3. Push to YOUR Personal GitHub (Full Project)
1.  Create a **New Repository** on your GitHub (e.g., `MediConnect-Complete`).
2.  Copy your personal repo URL.
3.  Add it as a remote and push:
    ```bash
    git remote add personal <YOUR_PERSONAL_REPO_URL>
    git branch -M main
    git push -u personal main
    ```

### 4. Push Back to the Team Repo (Without Affecting the Frontend Guy)
To avoid overwriting the "frontend guy's" work, you should push to a **New Branch** instead of `main`.

1.  Add the team repo as another remote (call it `team`):
    ```bash
    git remote add team https://github.com/G0dfada/Hackathon.git
    ```
2.  Create and push to a new branch:
    ```bash
    git checkout -b feature/medicare-plus
    git push team feature/medicare-plus
    ```

**Now, both versions exist!** Your personal GitHub has the full 100% project, and the team repo has your specific upgrades on a safe, separate branch.
