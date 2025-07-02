/*
  # Create tasks table and setup RLS

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, required)  
      - `description` (text, optional)
      - `status` (text, enum: todo, in_progress, done)
      - `priority` (text, enum: low, medium, high)
      - `due_date` (timestamptz, optional)
      - `shared_with` (text array, emails of users with access)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for task owners and shared users
    - Owners can do all operations
    - Shared users can read and update status only

  3. Indexes
    - Index on created_by for performance
    - Index on due_date for filtering
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date timestamptz,
  shared_with text[] DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS tasks_created_by_idx ON tasks(created_by);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);

-- RLS Policies

-- Policy: Users can read their own tasks or tasks shared with them
CREATE POLICY "Users can read own or shared tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR 
    auth.email() = ANY(shared_with)
  );

-- Policy: Users can insert their own tasks
CREATE POLICY "Users can create own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Policy: Users can update their own tasks or update status of shared tasks
CREATE POLICY "Users can update own tasks or shared task status"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR 
    auth.email() = ANY(shared_with)
  )
  WITH CHECK (
    created_by = auth.uid() OR 
    (auth.email() = ANY(shared_with) AND 
     (OLD.title = NEW.title AND OLD.description = NEW.description AND 
      OLD.priority = NEW.priority AND OLD.due_date = NEW.due_date AND 
      OLD.shared_with = NEW.shared_with))
  );

-- Policy: Users can delete only their own tasks
CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;