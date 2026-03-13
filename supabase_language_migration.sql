-- Add language column to members table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'members' 
        AND column_name = 'language'
    ) THEN
        ALTER TABLE members ADD COLUMN language TEXT DEFAULT '';
    END IF;
END $$;
