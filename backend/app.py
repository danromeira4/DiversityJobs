from fastapi import FastAPI, HTTPException
from typing import List, Optional
import sqlite3
from pydantic import BaseModel
from contextlib import contextmanager
from fastapi.middleware.cors import CORSMiddleware
import json
import datetime


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

DATABASE_URL = "diversityjobs.db"

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row  # This allows accessing columns by name
    try:
        yield conn
    finally:
        conn.close()

# Pydantic models remain the same
class Resume(BaseModel):
    resume_id: int
    resume_file_url: Optional[str]
    summary: Optional[str]
    skills: Optional[str]
    education: Optional[str]
    experience: Optional[str]

class Applicant(BaseModel):
    user_id: int
    nome: str
    email: str
    telefone: Optional[str]
    localizacao: Optional[str]
    linkedin: Optional[str]
    grupoSocial: Optional[List[str]]
    resumoProfissional: Optional[str]
    experiencias: Optional[List[dict]]
    formacoes: Optional[List[dict]]
    habilidades: Optional[List[str]]

class ApplicantCreate(BaseModel):
    email: str
    nome: str
    senha: str
    telefone: Optional[str] = None
    localizacao: Optional[str] = None
    linkedin: Optional[str] = None
    grupoSocial: Optional[List[str]] = None  # Agora aceita lista
    resumoProfissional: Optional[str] = None
    experiencias: Optional[List[dict]] = None
    formacoes: Optional[List[dict]] = None
    habilidades: Optional[List[str]] = None

class Business(BaseModel):
    user_id: int
    email: str
    name: str
    phone_number: Optional[str]
    address: Optional[str]
    profile_photo_url: Optional[str]
    business_name: Optional[str]

class Job(BaseModel):
    job_id: int
    business_id: int
    social_group: Optional[List[str]]  # Aceita uma lista de strings
    job_title: str
    job_description: str
    location: Optional[str]
    salary_range: Optional[str]
    requirements: Optional[str]
    posted_date: str
    application_deadline: Optional[str]
    application_process: Optional[str]

class JobCreate(BaseModel):
    business_email: str
    social_group: Optional[List[str]]  # Aceita uma lista de strings
    job_title: str
    job_description: str
    location: Optional[str]
    salary_range: Optional[str]
    requirements: Optional[str]
    posted_date: str
    application_deadline: Optional[str]
    application_process: Optional[str]

# Modelo para atualização de vaga
class JobUpdate(BaseModel):
    job_title: Optional[str] = None
    job_description: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    requirements: Optional[str] = None
    application_deadline: Optional[str] = None  # Campo para o prazo de aplicação
    application_process: Optional[str] = None
    social_group: Optional[list[str]] = None  # Aceita uma lista de strings

class JobApplication(BaseModel):
    applicant_email: str


# 1. Get applicant information with resume
@app.get("/applicants/{email}", response_model=Applicant)
async def get_applicant_info(email: str):
    with get_db() as conn:
        cursor = conn.cursor()
        
        query = """
        SELECT u.user_id, u.name as nome, u.email, u.phone_number as telefone, 
               u.address as localizacao, u.linkedin, u.social_group as grupoSocial,
               r.resume_id, r.resume_file_url, r.summary as resumoProfissional, 
               r.skills as habilidades, r.education as formacoes, r.experience as experiencias
        FROM Users u
        LEFT JOIN Resumes r ON u.user_id = r.user_id
        WHERE u.email = ? AND u.user_type = 'applicant'
        """
        
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Applicant not found")
        
        # Create resume dict if resume data exists
        experiencias = []
        formacoes = []
        habilidades = []
        
        if result['experiencias']:
            experiencias = result['experiencias'].split(',')
            experiencias_list = []
            for experiencia in experiencias:
                try:
                    experiencia_dict = {
                        'tempo': experiencia.split(':')[0],
                        'empresa': experiencia.split(':')[1]
                    }
                except:
                    experiencia_dict = {
                        'tempo': '',
                        'empresa': experiencia
                    }
                experiencias_list.append(experiencia_dict)
        
        if result['formacoes']:
            formacoes = result['formacoes'].split(',')
            formacoes_list = []
            for formacao in formacoes:
                try:
                    formacao_dict = {
                        'tempo': formacao.split(':')[0],
                        'instituicao': formacao.split(':')[1]
                    }
                except:
                    formacao_dict = {
                        'tempo': '',
                        'instituicao': formacao
                    }
                formacoes_list.append(formacao_dict)
                
        if result['habilidades']:
            habilidades_list = result['habilidades'].split(',')

        # Create applicant dict with resume field
        applicant = {
            'user_id': result['user_id'],
            'nome': result['nome'],
            'email': result['email'],
            'telefone': result['telefone'],
            'localizacao': result['localizacao'],
            'linkedin': result['linkedin'],
            'grupoSocial': [result['grupoSocial']] if result['grupoSocial'] else [],
            'resumoProfissional': result['resumoProfissional'],
            'experiencias': experiencias_list,
            'formacoes': formacoes_list,
            'habilidades': habilidades_list
        }
        
        return applicant

# 2. Get business information
@app.get("/businesses/{email}", response_model=Business)
async def get_business_info(email: str):
    with get_db() as conn:
        cursor = conn.cursor()
        
        query = """
        SELECT user_id, email, name, phone_number, address, 
               profile_photo_url, business_name
        FROM Users
        WHERE email = ? AND user_type = 'business'
        """
        
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Business not found")
        
        return dict(result)

# 3. Get job information
@app.get("/jobs/{job_id}", response_model=Job)
async def get_job_info(job_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        
        query = """
        SELECT *
        FROM Jobs
        WHERE job_id = ?
        """
        cursor.execute(query, (job_id,))
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Convertendo `social_group` de JSON para lista
        job = dict(result)
        if job.get("social_group"):
            job["social_group"] = json.loads(job["social_group"])  # Desserializar JSON para lista
        
        return job


# 4. Get all applicants for a job
@app.get("/jobs/{job_id}/applicants", response_model=List[Applicant])
async def get_job_applicants(job_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        
        query = """
        SELECT u.user_id, u.email, u.name, u.phone_number, u.address, 
               u.social_group, u.profile_photo_url,
               r.resume_id, r.resume_file_url, r.summary, r.skills, 
               r.education, r.experience
        FROM Users u
        LEFT JOIN Resumes r ON u.user_id = r.user_id
        INNER JOIN Applications a ON u.user_id = a.user_id
        WHERE a.job_id = ?
        """
        
        cursor.execute(query, (job_id,))
        results = cursor.fetchall()
        
        applicants = []
        for row in results:
            resume = {
                'resume_id': row['resume_id'],
                'resume_file_url': row['resume_file_url'],
                'summary': row['summary'],
                'skills': row['skills'],
                'education': row['education'],
                'experience': row['experience']
            }
            
            applicant = {
                'user_id': row['user_id'],
                'email': row['email'],
                'name': row['name'],
                'phone_number': row['phone_number'],
                'address': row['address'],
                'social_group': row['social_group'],
                'profile_photo_url': row['profile_photo_url'],
                'resume': resume
            }
            applicants.append(applicant)
            
        return applicants

# 5. Get jobs matching applicant's disability type
@app.get("/applicants/{email}/matching-jobs", response_model=List[Job])
async def get_matching_jobs(email: str):
    with get_db() as conn:
        cursor = conn.cursor()
        
        query = """
        SELECT j.*
        FROM Jobs j
        INNER JOIN Users u ON u.social_group = j.social_group
        WHERE u.email = ? AND u.user_type = 'applicant'
        """
        
        cursor.execute(query, (email,))
        results = cursor.fetchall()
        
        return [dict(row) for row in results]

# 6. List all jobs for a business
@app.get("/businesses/{email}/jobs", response_model=List[Job])
async def get_business_jobs(email: str):
    with get_db() as conn:
        cursor = conn.cursor()

        # Query para buscar as vagas do negócio
        query = """
        SELECT j.*
        FROM Jobs j
        INNER JOIN Users u ON u.user_id = j.business_id
        WHERE u.email = ? AND u.user_type = 'business'
        """
        cursor.execute(query, (email,))
        results = cursor.fetchall()

        # Transformar resultados em dicionários e desserializar social_group
        jobs = []
        for row in results:
            job = dict(row)
            if job.get("social_group"):
                job["social_group"] = json.loads(job["social_group"])  # Desserializar JSON para lista
            jobs.append(job)

        return jobs


# 7. Get all available jobs
@app.get("/jobs", response_model=List[dict])
async def get_all_jobs():
    with get_db() as conn:
        cursor = conn.cursor()
        
        query = """
        SELECT j.job_id as id, 
               j.job_title as title,
               u.business_name as company,
               j.location,
               j.job_type as type,
               j.social_group as tags,
               j.job_description as description,
               j.requirements as skills,
               j.benefits,
               j.salary_range as salary
        FROM Jobs j
        INNER JOIN Users u ON u.user_id = j.business_id
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        
        jobs = []
        for row in results:
            job = dict(row)
            
            # Desserializar JSON, tratando possíveis erros
            try:
                job["tags"] = json.loads(job["tags"]) if job["tags"] else []
            except json.JSONDecodeError:
                job["tags"] = []

            try:
                job["skills"] = json.loads(job["skills"]) if job["skills"] else []
            except json.JSONDecodeError:
                job["skills"] = []

            try:
                job["benefits"] = json.loads(job["benefits"]) if job["benefits"] else []
            except json.JSONDecodeError:
                job["benefits"] = []
            
            jobs.append(job)
            
        return jobs

# 8. Get all jobs applications for an applicant
@app.get("/applicants/{email}/applications")
async def get_applicant_applications(email: str):
    with get_db() as conn:
        cursor = conn.cursor()
        
        query = """
        SELECT 
            j.job_id as id,
            j.job_title as vaga,
            u.business_name as empresa,
            j.location as localizacao,
            a.application_date as dataAplicacao,
            a.status,
            j.job_type as tipo
        FROM Applications a
        INNER JOIN Jobs j ON j.job_id = a.job_id
        INNER JOIN Users u ON u.user_id = j.business_id
        INNER JOIN Users applicant ON applicant.user_id = a.user_id
        WHERE applicant.email = ? AND applicant.user_type = 'applicant'
        ORDER BY a.application_date DESC
        """
        
        cursor.execute(query, (email,))
        results = cursor.fetchall()
        
        return [dict(row) for row in results]
    
# Create a new job
@app.post("/jobs", response_model=JobCreate)
async def create_job(job: JobCreate):
    social_group_json = json.dumps(job.social_group) if job.social_group else None  # Serializa para JSON
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Obter business_id a partir do e-mail
        get_business_query = """
        SELECT user_id 
        FROM Users 
        WHERE email = ? AND user_type = 'business'
        """
        cursor.execute(get_business_query, (job.business_email,))
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Business not found")
            
        business_id = result['user_id']
        
        # Inserir na tabela Jobs
        query = """
        INSERT INTO Jobs (
            business_id,
            social_group,
            job_title,
            job_description,
            location,
            salary_range,
            requirements,
            posted_date,
            application_deadline,
            application_process
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        try:
            cursor.execute(query, (
                business_id,
                social_group_json,  # Salvar como JSON
                job.job_title,
                job.job_description,
                job.location,
                job.salary_range,
                job.requirements,
                job.posted_date,
                job.application_deadline,
                job.application_process
            ))
            conn.commit()
            
            return job
            
        except sqlite3.Error as e:
            raise HTTPException(status_code=400, detail=str(e))


@app.post("/applicants", response_model=ApplicantCreate)
async def create_applicant(applicant: ApplicantCreate):
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if email already exists
        cursor.execute("SELECT email FROM Users WHERE email = ?", (applicant.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Insert into Users table
        user_query = """
        INSERT INTO Users (
            email, password_hash, name, phone_number, address, linkedin, 
            social_group, user_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'applicant')
        """
        
        try:
            cursor.execute(user_query, (
                applicant.email,
                applicant.senha,
                applicant.nome,
                applicant.telefone,
                applicant.localizacao,
                applicant.linkedin,
                applicant.grupoSocial
            ))
            user_id = cursor.lastrowid
            
            # Insert into Resumes table if professional info exists
            if any([applicant.resumoProfissional, applicant.experiencias, 
                   applicant.formacoes, applicant.habilidades]):
                
                # Format experiences, education and skills as strings
                experiencias_str = None
                if applicant.experiencias:
                    experiencias_str = ','.join(
                        f"{exp['tempo']}:{exp['empresa']}" 
                        for exp in applicant.experiencias
                    )
                
                formacoes_str = None
                if applicant.formacoes:
                    formacoes_str = ','.join(
                        f"{form['tempo']}:{form['instituicao']}" 
                        for form in applicant.formacoes
                    )
                
                habilidades_str = None
                if applicant.habilidades:
                    habilidades_str = ','.join(applicant.habilidades)
                
                resume_query = """
                INSERT INTO Resumes (
                    user_id, summary, experience, education, skills
                ) VALUES (?, ?, ?, ?, ?)
                """
                
                cursor.execute(resume_query, (
                    user_id,
                    applicant.resumoProfissional,
                    experiencias_str,
                    formacoes_str,
                    habilidades_str
                ))
            
            conn.commit()
            return applicant
            
        except sqlite3.Error as e:
            raise HTTPException(status_code=400, detail=str(e))
        

@app.get("/users/businesses", response_model=List[dict])
async def get_business_users():
    with get_db() as conn:
        cursor = conn.cursor()
        query = "SELECT * FROM Users WHERE user_type = 'business';"
        cursor.execute(query)
        results = cursor.fetchall()
        return [dict(row) for row in results]
    
@app.put("/jobs/{job_id}")
async def update_job(job_id: int, job: JobUpdate):
    with get_db() as conn:
        cursor = conn.cursor()

        # Verifica se a vaga existe
        cursor.execute("SELECT * FROM Jobs WHERE job_id = ?", (job_id,))
        existing_job = cursor.fetchone()
        if not existing_job:
            raise HTTPException(status_code=404, detail="Job not found")

        # Atualiza os campos fornecidos
        update_data = {key: value for key, value in job.dict().items() if value is not None}

        # Converte `social_group` para JSON, se necessário
        if "social_group" in update_data:
            update_data["social_group"] = json.dumps(update_data["social_group"])

        # Verifica se há algo para atualizar
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        # Atualiza os dados no banco de dados
        update_query = ", ".join([f"{key} = ?" for key in update_data.keys()])
        values = list(update_data.values()) + [job_id]

        try:
            cursor.execute(
                f"UPDATE Jobs SET {update_query} WHERE job_id = ?",
                values
            )
            conn.commit()
        except sqlite3.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {e}")

    return {"message": "Job updated successfully"}

@app.delete("/jobs/{job_id}")
async def delete_job(job_id: int):
    with get_db() as conn:
        cursor = conn.cursor()

        # Check if the job exists
        cursor.execute("SELECT * FROM Jobs WHERE job_id = ?", (job_id,))
        job = cursor.fetchone()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        # Delete the job
        try:
            cursor.execute("DELETE FROM Jobs WHERE job_id = ?", (job_id,))
            conn.commit()
        except sqlite3.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {e}")

    return {"message": "Job deleted successfully"}

@app.post("/jobs/{job_id}/apply")
async def apply_for_job(job_id: int, application: JobApplication):
    """
    Permite que um candidato aplique para uma vaga usando o ID da vaga e seu e-mail.
    """
    with get_db() as conn:
        cursor = conn.cursor()

        try:
            # Verificar se o candidato existe
            print("Verificando candidato...")
            applicant_query = """
            SELECT user_id
            FROM Users
            WHERE email = ? AND user_type = 'applicant'
            """
            cursor.execute(applicant_query, (application.applicant_email,))
            applicant = cursor.fetchone()
            print("Candidato encontrado:", applicant)

            if not applicant:
                raise HTTPException(status_code=404, detail="Applicant not found")
            applicant_id = applicant['user_id']

            # Verificar se a vaga existe
            print("Verificando vaga...")
            job_query = """
            SELECT job_id
            FROM Jobs
            WHERE job_id = ?
            """
            cursor.execute(job_query, (job_id,))
            job = cursor.fetchone()
            print("Vaga encontrada:", job)

            if not job:
                raise HTTPException(status_code=404, detail="Job not found")

            # Verificar se o candidato já aplicou
            print("Verificando aplicação existente...")
            application_check_query = """
            SELECT *
            FROM Applications
            WHERE user_id = ? AND job_id = ?
            """
            cursor.execute(application_check_query, (applicant_id, job_id))
            existing_application = cursor.fetchone()
            print("Aplicação existente:", existing_application)

            if existing_application:
                raise HTTPException(status_code=400, detail="Applicant already applied for this job")

            # Inserir nova aplicação
            print("Inserindo aplicação...")
            apply_query = """
            INSERT INTO Applications (user_id, job_id, application_date, status)
            VALUES (?, ?, CURRENT_TIMESTAMP, 'pending')
            """
            cursor.execute(apply_query, (applicant_id, job_id))
            conn.commit()
            print("Aplicação inserida com sucesso.")
            return {"message": "Application submitted successfully"}

        except sqlite3.Error as e:
            print("Erro no SQLite:", str(e))
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
@app.put("/applicants/{email}")
async def update_applicant(email: str, applicant: ApplicantCreate):
    with get_db() as conn:
        cursor = conn.cursor()

        # Verify applicant exists
        cursor.execute("SELECT user_id FROM Users WHERE email = ? AND user_type = 'applicant'", (email,))
        existing_user = cursor.fetchone()
        if not existing_user:
            raise HTTPException(status_code=404, detail="Applicant not found")
        
        user_id = existing_user['user_id']

        # Update Users table
        update_user_query = """
        UPDATE Users SET 
            name = ?, 
            phone_number = ?, 
            address = ?, 
            linkedin = ?, 
            social_group = ?
        WHERE user_id = ?
        """
        
        # Update Resume table
        update_resume_query = """
        UPDATE Resumes SET 
            summary = ?, 
            experience = ?, 
            education = ?, 
            skills = ?
        WHERE user_id = ?
        """

        try:
            # Update Users
            cursor.execute(update_user_query, (
                applicant.nome,
                applicant.telefone,
                applicant.localizacao,
                applicant.linkedin,
                ','.join(applicant.grupoSocial) if applicant.grupoSocial else None,
                user_id
            ))

            # Format experiences, education and skills as strings
            experiencias_str = None
            if applicant.experiencias:
                experiencias_str = ','.join(
                    f"{exp['tempo']}:{exp['empresa']}" 
                    for exp in applicant.experiencias
                )
            
            formacoes_str = None
            if applicant.formacoes:
                formacoes_str = ','.join(
                    f"{form['tempo']}:{form['instituicao']}" 
                    for form in applicant.formacoes
                )
            
            habilidades_str = None
            if applicant.habilidades:
                habilidades_str = ','.join(applicant.habilidades)

            # Update Resumes
            cursor.execute(update_resume_query, (
                applicant.resumoProfissional,
                experiencias_str,
                formacoes_str,
                habilidades_str,
                user_id
            ))

            conn.commit()
            return {"message": "Applicant updated successfully"}
            
        except sqlite3.Error as e:
            raise HTTPException(status_code=400, detail=str(e))
        
@app.get("/jobs/{job_id}/candidates")
async def get_job_candidates(job_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        
        query = """
        SELECT 
            u.user_id as id,
            u.name as name,
            u.email as email,
            a.application_date,
            a.status
        FROM Applications a
        INNER JOIN Users u ON u.user_id = a.user_id
        WHERE a.job_id = ?
        ORDER BY a.application_date DESC
        """
        
        try:
            cursor.execute(query, (job_id,))
            candidates = cursor.fetchall()
            return [dict(candidate) for candidate in candidates]
        except sqlite3.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/applications/{job_id}/status")
async def update_application_status(job_id: int, application: JobApplication, status: str):
    """
    Updates the status of a job application based on applicant email and job ID.
    """
    with get_db() as conn:
        cursor = conn.cursor()

        try:
            # Get the user_id from email
            cursor.execute(
                "SELECT user_id FROM Users WHERE email = ? AND user_type = 'applicant'",
                (application.applicant_email,)
            )
            user = cursor.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="Applicant not found")

            # Update the application status
            update_query = """
            UPDATE Applications 
            SET status = ?
            WHERE job_id = ? AND user_id = ?
            """
            cursor.execute(update_query, (status, job_id, user['user_id']))
            
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Application not found")
            
            conn.commit()
            return {"message": "Application status updated successfully"}

        except sqlite3.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


