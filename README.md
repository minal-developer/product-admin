# Next.js Product Admin Dashboard

A full-featured Product Admin Dashboard built with Next.js 14 (App Router, JavaScript), Tailwind CSS, React Context, and Axios.

## 🚀 Features
- **Auth Flow**: JWT Login (`emilys` / `emilyspass`), token storage in `localStorage`, protected routes.
- **Axios Interceptors**: Global request auth header injection and automatic response error handling.
- **Product Management**: Desktop table view & mobile card layout with pagination, search, category filter, and multi-column sorting.
- **Debounced Search**: Cancellable API requests using standard browser `AbortController`.
- **Local State Sync**: Simulated Add, Edit, and Delete actions maintaining optimistic local state.

## 📦 Local Setup

1. Install dependencies:
   ```bash
   npm install