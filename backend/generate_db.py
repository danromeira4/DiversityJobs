import sqlite3
import json
from datetime import datetime, timedelta
import random
import os

def create_database():
    # Caminho absoluto para o banco de dados
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DB_PATH = os.path.join(BASE_DIR, 'diversityjobs.db')

    # Conectar ao banco de dados SQLite (cria o arquivo se ele não existir)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Criação de tabelas a partir do esquema
    with open('backend/diversityjobs_schema.sql', 'r') as schema_file:
        statements = [stmt.strip() for stmt in schema_file.read().split(';') if stmt.strip()]
        for statement in statements:
            if statement.upper().startswith(('CREATE DATABASE', 'USE')):
                continue
            statement = statement.replace('AUTO_INCREMENT', 'AUTOINCREMENT')
            statement = statement.replace('ENUM', 'TEXT CHECK')
            statement = statement.replace('ON UPDATE CURRENT_TIMESTAMP', '')
            cursor.execute(statement)

    # Dados de exemplo para Users
    sample_users = [
        ('applicant', 'john@example.com', 'hash1', 'John Doe', '123-456-7890', '123 Main St', json.dumps(['LGBTQIA+', 'PCD']), None, '2024-01-01', None, 'linkedin.com/in/johndoe'),
        ('applicant', 'jane@example.com', 'hash2', 'Jane Smith', '123-456-7891', '456 Oak St', json.dumps(['Mulheres', 'Neurodiversidade']), None, '2024-01-02', None, 'linkedin.com/in/janesmith'),
        ('business', 'tech@company.com', 'hash3', 'Tech HR', '555-555-5555', '789 Corp Ave', None, None, '2024-01-03', 'Tech Company Inc', 'linkedin.com/company/techcompany'),
        ('business', 'retail@store.com', 'hash4', 'Retail HR', '555-555-5556', '321 Shop St', None, None, '2024-01-04', 'Retail Store LLC', 'linkedin.com/company/retailstore')
    ]

    cursor.executemany('''
    INSERT INTO Users (user_type, email, password_hash, name, phone_number, address, social_group, profile_photo_url, registration_date, business_name, linkedin)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_users)

    # Dados de exemplo para Resumes
    sample_resumes = [
        (1, 'resume1.pdf', 'Experienced professional', 'Python, SQL, Web Development', '2020: Bachelor in Computer Science, 2024: Master in Computer Science', '5 years of experience: TAG, 2 years of experience: Nasa', '2024-01-05'),
        (2, 'resume2.pdf', 'Marketing specialist', 'Marketing, Social Media, Analytics', '2022: Bachelor in Marketing, 2024: Master in Marketing', '3 years of experience: Youtube, 2 years of experience: Facebook', '2024-01-06')
    ]

    cursor.executemany('''
    INSERT INTO Resumes (user_id, resume_file_url, summary, skills, education, experience, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', sample_resumes)

    # Dados de exemplo para Jobs
    sample_jobs = [
        (3, json.dumps(['LGBTQIA+', 'PCD']), 'Software Developer', 'Developing accessible applications', 'San Francisco', '100k-150k', 'Python, SQL', '2024-01-07', '2024-06-01', 'Apply through website', 'Full-time', 'Health insurance, 401k'),
        (4, json.dumps(['Mulheres', 'Neurodiversidade']), 'Store Manager', 'Managing retail operations', 'New York', '60k-80k', '3+ years retail experience', '2024-01-08', '2024-05-01', 'Send resume', 'Full-time', 'Medical, Dental, Vision')
    ]

    cursor.executemany('''
    INSERT INTO Jobs (business_id, social_group, job_title, job_description, location, salary_range, requirements, posted_date, application_deadline, application_process, job_type, benefits)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_jobs)

    # Dados de exemplo para Applications
    sample_applications = [
        (1, 1, '2024-01-09', 'pending'),
        (2, 2, '2024-01-10', 'reviewed')
    ]

    cursor.executemany('''
    INSERT INTO Applications (user_id, job_id, application_date, status)
    VALUES (?, ?, ?, ?)
    ''', sample_applications)

    # Salvar alterações e fechar a conexão
    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_database()
    print("Database created and populated successfully!")
