LokSwar – AI Assistant for Indian Farmers

Tagline: “Understand government schemes in your own language”

Table of Contents

Problem Statement

Solution Overview

Features

Technology Stack

GenAI Integration

User Flow & Screenshots

Setup & Deployment

Future Improvements

Team

Problem Statement

Millions of Indian farmers struggle to access and understand government welfare schemes due to:

Complex eligibility rules

Language barriers

Scattered and confusing portals

Low digital literacy, especially in rural areas

Existing solutions are often English-centric, text-heavy, and hard to navigate.

Solution Overview

LokSwar is a production-ready web app that acts as a voice-first AI assistant to help farmers:

Evaluate scheme eligibility using official parameters

Receive personalized, multilingual explanations

Navigate schemes in a step-by-step, professional workflow

Optionally upload documents for AI-driven simplification

Core Principle: Deterministic rule-based eligibility + GenAI-powered accessibility and explanation.

This ensures trust, transparency, and inclusivity.

Features
✅ Mandatory & Working Features

Landing / Onboarding Page

App logo, tagline, and voice/text start options

Smooth animations, mobile-friendly layout

Language Selection

English, Hindi, Telugu, Tamil

Persists across sessions

Farmer Profile Form

Name, Age, State, District, Landholding, Category

Validation & progress indicator

Scheme Selection & Evaluation

Professional, official-style scheme cards

Multi-step eligibility workflow:

Scheme Selected

Profile Validation

Rule Evaluation (deterministic)

AI Explanation (GPT-4o)

Final Result

AI Integration

GPT-4o: Simplifies policy, generates multilingual explanations

Whisper: Converts regional language voice input into structured queries

Optional Upload Page

Upload PDFs/images → AI simplifies content

Responsive & Accessible UI

Mobile-first design

Step-based navigation

Clear buttons, readable typography

Data Persistence

Stores language and profile in browser storage

Ready for future backend integration

Deployment

Deployed via Vercel

Supports environment variable OPENAI_API_KEY

Technology Stack

Frontend: React + Next.js + Tailwind CSS + shadcn/ui

Backend (optional): Vercel serverless API (for production-scale AI calls)

AI Integration:

OpenAI GPT-4o (explanation & simplification)

OpenAI Whisper (voice input)

Storage: LocalStorage / Session Storage

Deployment: Vercel

GenAI Integration

Mandatory Core Layer:

All AI-generated content passes through GPT-4o

Generates multilingual explanations

Personalizes responses based on user profile

Handles voice input & document simplification

Rule Engine + AI:

Eligibility determined by deterministic government rules

GenAI only explains, simplifies, and personalizes

Ensures trustworthy and verifiable outcomes

Visibility:

Users see “Generating explanation based on government rules…” during AI processing

User Flow & Screenshots

Landing / Onboarding → Select Language

Profile Form → Enter Farmer Details

Scheme Selection → Click a scheme → “Begin Assessment”

Rule Evaluation → Progress bars & validation

AI Explanation → Personalized multilingual output

Final Result → Eligibility status, steps, documents

(Include screenshots or GIFs here for each step)

Setup & Deployment
Requirements

Node.js ≥ 18

NPM or Yarn

OpenAI API Key

Local Setup
git clone https://github.com/your-team/lokswar.git
cd lokswar
npm install
cp .env.example .env
# Add your API key
# OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
npm run dev

Deployment

Push to GitHub

Connect repo to Vercel

Set OPENAI_API_KEY as environment variable

Publish → Live URL

Future Improvements

Full backend with authentication & database storage

PDF / document parsing with AI summarization

SMS / WhatsApp notifications for scheme updates

Integration with government APIs for real-time eligibility

Team

Your Name: Frontend & Workflow Design

Teammate Name: AI Integration & GenAI Prompting

Hackathon: OpenAI x NxtWave Buildathon – Stage 2 Regional Qualifiers

Links (Example)

Deployed App: https://lokswar.vercel.app

GitHub Repo: https://github.com/your-team/lokswar

PPT Presentation: https://drive.google.com/
...

Demo Video (≤5min): https://drive.google.com/
...

Disclaimer: This AI guidance tool simplifies government schemes for better understanding. Eligibility is determined by official government rules. Users should verify with official sources.
