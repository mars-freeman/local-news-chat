# Local News Chat Application

A chat application that uses OpenAI's GPT-4 model to provide responses and stores all chat messages in a Supabase database.

## Features

- 🤖 AI-powered chat using OpenAI GPT-4
- 🔐 User authentication with Supabase
- 💾 Persistent chat history stored in database
- 📱 Responsive web interface
- 🔄 Real-time message loading

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Database Setup

The application uses a Supabase database with the following schema:

```sql
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  user_email text not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamp with time zone default now()
);

alter table messages enable row level security;

create policy "Allow all insert" on messages
  for insert with check (true);

create policy "Allow all select" on messages
  for select using (true);
```

### 3. Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables

3. Run the application:
   ```bash
   npm start
   ```

## How It Works

1. **Authentication**: Users log in with their email using Supabase authentication
2. **Chat Interface**: Users can send messages through the web interface
3. **AI Processing**: Messages are sent to OpenAI's GPT-4 API for processing
4. **Database Storage**: Both user messages and AI responses are stored in the Supabase database
5. **History Loading**: When users log in, their previous chat history is automatically loaded

## File Structure

- `chat.js` - Main API handler for chat functionality
- `api/supabase.js` - Supabase client configuration
- `script.js` - Frontend JavaScript with authentication and chat logic
- `index.html` - Main HTML interface
- `style.css` - Styling for the application
- `schema/local-news-chat.sql` - Database schema

## API Endpoints

- `POST /api/chat` - Send a message and get AI response
  - Body: `{ message: string, userEmail: string }`
  - Response: `{ reply: string }` or `{ error: string }`