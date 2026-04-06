# 🚀 cicd-jenkins-aws-demo

A sample web application used to demonstrate a **CI/CD pipeline** built with **Jenkins** and **AWS**.  
Every push to `main` automatically triggers a Jenkins pipeline that builds, tests, packages, and deploys this app to an AWS EC2 instance.

---

## 📌 Project Purpose

This repository is the source application used in the **CI/CD Pipeline Implementation Lab** (Jenkins + AWS).  
It is intentionally kept simple so the focus stays on the pipeline, not the application code.

---

## 🏗️ Architecture Overview

```
Developer (git push)
      │
      ▼
 GitHub Repository  ──── Webhook ────►  Jenkins (EC2 t2.medium)
                                              │
                              ┌───────────────┼──────────────────┐
                              ▼               ▼                  ▼
                           Build           Test              Package
                        (npm install)   (npm test)       (zip artifact)
                              │               │                  │
                              └───────────────┴──────────────────┘
                                              │
                                             S3 Bucket
                                      (artifact storage)
                                              │
                                             EC2
                                      (Target / Deploy)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Application | HTML5, CSS3, Vanilla JS |
| CI Server | Jenkins (on AWS EC2) |
| Source Control | GitHub |
| Artifact Storage | Amazon S3 |
| Deployment Target | Amazon EC2 |
| Remote Execution | AWS SSM (Systems Manager) |
| Access Control | AWS IAM |

---

## 📁 Repository Structure

```
cicd-jenkins-aws-demo/
├── index.html          # Main application page
├── Jenkinsfile         # Pipeline definition (CI/CD stages)
├── package.json        # App metadata and test scripts
├── README.md           # This file
└── test/
    └── app.test.js     # Basic smoke tests
```

---

## ⚙️ Jenkinsfile — Pipeline Stages

The `Jenkinsfile` at the root of this repo defines the following stages:

```
Checkout ──► Build ──► Test ──► Package ──► Deploy to AWS
```

| Stage | What happens |
|---|---|
| **Checkout** | Jenkins clones this repo onto the build agent |
| **Build** | `npm install` — installs dependencies |
| **Test** | `npm test` — runs automated tests |
| **Package** | App is zipped into `app-<BUILD_NUMBER>.zip` |
| **Deploy** | Artifact uploaded to S3, then deployed to EC2 via SSM |

---

## 🔧 Setup & Prerequisites

Before running the pipeline, make sure the following are in place:

- [ ] AWS account with an EC2 instance running Jenkins
- [ ] EC2 Security Group allowing ports `22`, `8080`, `80`
- [ ] IAM user `jenkins-deploy-user` with S3, EC2, SSM permissions
- [ ] GitHub webhook pointing to `http://<JENKINS-IP>:8080/github-webhook/`
- [ ] Jenkins credentials configured:
  - `github-credentials` — GitHub Personal Access Token
  - `aws-credentials` — AWS Access Key + Secret

---

## 🚦 How to Trigger the Pipeline

**Automatic (via webhook):**
```bash
git add .
git commit -m "Your change"
git push origin main
# Jenkins picks this up within seconds
```

**Manual:**
1. Open Jenkins at `http://<YOUR-EC2-IP>:8080`
2. Open the `my-cicd-pipeline` job
3. Click **Build Now**

---

## 📊 Viewing Pipeline Results

- **Classic UI:** `http://<JENKINS-IP>:8080/job/my-cicd-pipeline/`
- **Blue Ocean:** `http://<JENKINS-IP>:8080/blue/pipelines/`

Each build shows stage-by-stage status, console logs, and test results.

---

## 🌐 Accessing the Deployed App

Once the pipeline completes successfully:

```
http://<TARGET-EC2-PUBLIC-IP>/
```

---

## 🛡️ Security Notes

- Never commit AWS credentials or secrets to this repository
- Use Jenkins **Credentials Manager** for all secrets
- Restrict EC2 Security Group port `8080` to your IP only in production
- Rotate the GitHub PAT every 90 days

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| Webhook not triggering | Ensure port 8080 is open in EC2 Security Group |
| Clone fails | Check `github-credentials` ID matches Jenkinsfile |
| AWS CLI auth error | Verify `aws-credentials` in Jenkins Credentials Manager |
| Deploy fails | Check IAM user has `AmazonS3FullAccess` + `AmazonSSMFullAccess` |
| Build not starting | Verify "GitHub hook trigger for GITScm polling" is checked in job config |

---

## 📄 License

MIT — free to use for learning and lab purposes.

---

> Built as part of the **CI/CD Pipeline Lab — Jenkins & AWS**
