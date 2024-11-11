import sqlite3
from datetime import datetime, timedelta
import random

def create_database():
    # Connect to SQLite database (creates it if it doesn't exist)
    conn = sqlite3.connect('diversityjobs.db')
    cursor = conn.cursor()

    # Create Users table
    # Read and execute schema from file
    with open('diversityjobs_schema.sql', 'r') as schema_file:
        # Split into individual statements and filter out empty ones
        statements = [stmt.strip() for stmt in schema_file.read().split(';') if stmt.strip()]
        
        # Execute each statement, converting MySQL syntax to SQLite
        for statement in statements:
            # Skip CREATE DATABASE and USE statements
            if statement.upper().startswith(('CREATE DATABASE', 'USE')):
                continue
                
            # Convert MySQL-specific syntax to SQLite
            statement = statement.replace('AUTO_INCREMENT', 'AUTOINCREMENT')
            statement = statement.replace('ENUM', 'TEXT CHECK')
            
            # Remove ON UPDATE CURRENT_TIMESTAMP as it's not supported in SQLite
            statement = statement.replace('ON UPDATE CURRENT_TIMESTAMP', '')
            
            # Execute the converted statement
            cursor.execute(statement)

    # Sample data for Users
    sample_users = [
        ('applicant', 'john@example.com', 'hash1', 'John Doe', '123-456-7890', '123 Main St', 'Visual Impairment', None, '2024-01-01', None),
        ('applicant', 'jane@example.com', 'hash2', 'Jane Smith', '123-456-7891', '456 Oak St', 'Hearing Impairment', None, '2024-01-02', None),
        ('business', 'tech@company.com', 'hash3', 'Tech HR', '555-555-5555', '789 Corp Ave', None, None, '2024-01-03', 'Tech Company Inc'),
        ('business', 'retail@store.com', 'hash4', 'Retail HR', '555-555-5556', '321 Shop St', None, None, '2024-01-04', 'Retail Store LLC')
    ]

    cursor.executemany('''
    INSERT INTO Users (user_type, email, password_hash, name, phone_number, address, disability_type, profile_photo_url, registration_date, business_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_users)

    # Sample data for Resumes
    sample_resumes = [
        (1, 'resume1.pdf', 'Experienced professional', 'Python, SQL, Web Development', 'Bachelor in Computer Science', '5 years of experience', '2024-01-05'),
        (2, 'resume2.pdf', 'Marketing specialist', 'Marketing, Social Media, Analytics', 'Bachelor in Marketing', '3 years of experience', '2024-01-06')
    ]

    cursor.executemany('''
    INSERT INTO Resumes (user_id, resume_file_url, summary, skills, education, experience, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', sample_resumes)

    # Sample data for Jobs
    sample_jobs = [
        (3, 'Visual Impairment', 'Software Developer', 'Developing accessible applications', 'San Francisco', '100k-150k', 'Python, SQL', '2024-01-07', '2024-06-01', 'Apply through website'),
        (4, 'Hearing Impairment', 'Store Manager', 'Managing retail operations', 'New York', '60k-80k', '3+ years retail experience', '2024-01-08', '2024-05-01', 'Send resume')
    ]

    cursor.executemany('''
    INSERT INTO Jobs (business_id, disability_type, job_title, job_description, location, salary_range, requirements, posted_date, application_deadline, application_process, job_type, benefits)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', [(3, 'Visual Impairment', 'Software Developer', 'Developing accessible applications', 'San Francisco', '100k-150k', 'Python, SQL', '2024-01-07', '2024-06-01', 'Apply through website', 'Full-time', 'Health insurance, 401k'),
          (4, 'Hearing Impairment', 'Store Manager', 'Managing retail operations', 'New York', '60k-80k', '3+ years retail experience', '2024-01-08', '2024-05-01', 'Send resume', 'Full-time', 'Medical, Dental, Vision')])

    # Sample data for Applications
    sample_applications = [
        (1, 1, '2024-01-09', 'pending'),
        (2, 2, '2024-01-10', 'reviewed')
    ]

    cursor.executemany('''
    INSERT INTO Applications (user_id, job_id, application_date, status)
    VALUES (?, ?, ?, ?)
    ''', sample_applications)

    # Commit the changes and close the connection
    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_database()
    print("Database created and populated successfully!")