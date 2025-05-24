-- Drop the foreign key constraint first
ALTER TABLE employee_files
DROP FOREIGN KEY employee_files_ibfk_2;

-- Then drop the column
ALTER TABLE employee_files
DROP COLUMN uploaded_by; 