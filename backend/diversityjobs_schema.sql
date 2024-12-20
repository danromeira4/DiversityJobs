-- Create the database
-- Note: SQLite creates database file automatically, no CREATE DATABASE needed
-- USE statement not needed for SQLite

CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_type TEXT CHECK(user_type IN ('applicant', 'business')) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone_number TEXT,
    address TEXT,
    social_group TEXT, -- Stores JSON array of social groups
    profile_photo_url TEXT,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    linkedin TEXT,
    business_name TEXT -- Only for businesses
);

-- Table to store resumes for applicants
CREATE TABLE Resumes (
    resume_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    resume_file_url TEXT,
    summary TEXT,
    skills TEXT,
    education TEXT,
    experience TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Table to store job postings by businesses
CREATE TABLE Jobs (
    job_id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    social_group TEXT, -- Armazena um array de strings em formato JSON
    job_title TEXT NOT NULL,
    job_description TEXT NOT NULL,
    location TEXT,
    salary_range TEXT,
    requirements TEXT,
    posted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    application_deadline DATE,
    application_process TEXT,
    job_type TEXT,
    benefits TEXT,
    FOREIGN KEY (business_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Table to track job applications by applicants
CREATE TABLE Applications (
    application_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    application_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('pending', 'reviewed', 'accepted', 'rejected')) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES Jobs(job_id) ON DELETE CASCADE
);