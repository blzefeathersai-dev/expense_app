# Building iOS Version via GitHub Actions (Cloud Route)

Since Xcode and iOS compilation require macOS, you can use **GitHub Actions** (which provides cloud `macos` runners) to build your iOS app automatically without needing a Mac locally.

---

## How It Works

We have added a GitHub Actions workflow at [`.github/workflows/build-ios.yml`](file:///.github/workflows/build-ios.yml).

When you push code to GitHub (or trigger the workflow manually):
1. GitHub spins up a virtual **macOS 14 (Xcode)** runner.
2. It installs Node.js and dependencies (`npm ci`).
3. It builds your React production bundle (`npm run build`).
4. It initializes `@capacitor/ios` and syncs the web app into native iOS project files.
5. It compiles the iOS app with `xcodebuild` (Simulator Debug target).
6. It zips and uploads `ExpenseTracker-iOS-Simulator.zip` as a downloadable artifact.

---

## Setup & Execution Steps

### 1. Push Code to a GitHub Repository
If your project is not yet connected to GitHub, initialize Git and push:

```bash
git init
git add .
git commit -m "Add Capacitor iOS support and GitHub Actions workflow"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/expense_app.git
git push -u origin main
```

### 2. Download the Built iOS App
1. Open your repository on GitHub.
2. Go to the **Actions** tab.
3. Click on the latest **Build iOS App** workflow run.
4. Scroll down to the **Artifacts** section.
5. Download **`ExpenseTracker-iOS-Simulator`**.

---

## Next Steps for App Store / TestFlight (.ipa)
To build a signed `.ipa` file for physical iPhones or App Store distribution:
1. Add your Apple Developer **Signing Certificate** and **Provisioning Profile** as secrets in your GitHub repository (`APPLE_CERTIFICATE_BASE64`, `PROVISIONING_PROFILE_BASE64`, etc.).
2. Update the workflow `xcodebuild` command to archive and export the `.ipa` package using `xcodebuild -exportArchive`.
