/*
  # Create URLs table for URL shortener

  1. New Tables
    - `urls`
      - `id` (uuid, primary key)
      - `short_id` (text, unique) - The shortened URL identifier
      - `long_url` (text) - The original URL
      - `created_at` (timestamp)
      - `visits` (integer) - Track number of visits
      - `user_id` (uuid) - Reference to auth.users
  
  2. Security
    - Enable RLS on `urls` table
    - Add policies for:
      - Anyone can read URLs
      - Authenticated users can create URLs
      - Users can only update/delete their own URLs
*/

CREATE TABLE IF NOT EXISTS urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_id text UNIQUE NOT NULL,
  long_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  visits integer DEFAULT 0,
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read URLs (needed for redirects)
CREATE POLICY "URLs are publicly readable"
  ON urls
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to create URLs
CREATE POLICY "Authenticated users can create URLs"
  ON urls
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can only update their own URLs
CREATE POLICY "Users can update own URLs"
  ON urls
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can only delete their own URLs
CREATE POLICY "Users can delete own URLs"
  ON urls
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);