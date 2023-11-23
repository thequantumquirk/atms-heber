# ATMS-Heber

Welcome to ATMS-Heber! This is an Advanced Task Management System built for Bishop Heber College.

## Getting Started

Follow these steps to set up the project:

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Clone the Repository

```bash
git clone https://github.com/fosslover69/atms-heber.git
cd atms-heber
```

### Install Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to see the app!

## Setting up Pre-Push Hook

**Setting up Pre-Push hook is mandatory to contribute to the main branch**.

This hook makes sure that the `npm build` succeeds before pushing to the main branch. As failing `npm build` will result in failed deployment

To automatically copy the `pre-push` file to the appropriate Git hooks directory, use the provided Python script. This script works on both Unix-like systems (Linux, macOS) and Windows.

### Prerequisites

- Python installed on your machine.

### Run the Setup Script

```bash
python setup-hooks.py
```

This script will detect your operating system and execute the corresponding shell script (`setup-hooks.sh` for Unix-like systems, `setup-hooks.bat` for Windows). The pre-push hook ensures that certain checks are performed before pushing changes to the remote repository.
