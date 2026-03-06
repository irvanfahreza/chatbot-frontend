# Chatbot Frontend

This project was generated with Angular CLI and serves as the modern chat interface for our AI Chatbot Application.

## Prerequisites
- Node.js (v18+)
- Angular CLI (v17+)

## Setup
First, make sure to install dependencies:
```bash
npm install
```

## Running the Development Server
Run the standard Angular serve command:
```bash
ng serve
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Environment configuration
The API Base URL is configurable in `src/environments/environment.ts`. By default, it points to `http://localhost:8080/api/chat`.
Make sure the Spring Boot Backend is running to process the chat completions!
