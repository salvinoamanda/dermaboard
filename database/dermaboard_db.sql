-- User table
CREATE TABLE users(
	id				SERIAL PRIMARY KEY,
	name			TEXT NOT NULL,
	email			TEXT NOT NULL UNIQUE,
	password		TEXT NOT NULL,
	profile_photo	TEXT,
	active			BOOLEAN DEFAULT TRUE,
	created_at		TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	updated_at		TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	last_login		TIMESTAMPTZ,
	is_admin		BOOLEAN DEFAULT FALSE
);

-- Search History table
CREATE TABLE search_history(
	id SERIAL	  PRIMARY KEY,
	user_id		  INT,
	search_term   TEXT NOT NULL,
	searched_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Skin Cancer Records table
CREATE TABLE skin_cancer_records(
	id								  BIGSERIAL PRIMARY KEY,
	ano_cmpt						  INT,
	mes_cmpt						  TEXT,
	state							  VARCHAR(2),
	region							  TEXT,
	city_ibge_code                    INT,
	birth_date                        DATE,
	sex                               VARCHAR(17),
	age                               INT,
	race                              TEXT,
	nationality                       TEXT,
	main_diagnosis                    VARCHAR(10),
	main_diagnosis_description        TEXT,
	secondary_diagnosis               VARCHAR(10),
	secondary_diagnosis_description	  TEXT,
	admission_date                    DATE,
	discharge_date                    DATE,
	length_of_stay                    INT,
	death                             VARCHAR(3),
	death_cid                         VARCHAR(10),
	admission_type                    TEXT,
	complexity                        TEXT,
	procedure_performed               TEXT,
	total_value                       NUMERIC(12,2)
);

-- Skin Cancer Records Other Years
CREATE TABLE skin_cancer_records_other_years (
  LIKE skin_cancer_records INCLUDING ALL
);

--Skin Cancer Annual Rates
CREATE TABLE skin_cancer_annual_rates (
	id				SERIAL PRIMARY KEY,
	year			INT NOT NULL,
	state			VARCHAR(2),
	region			TEXT,
	cases			INT NOT NULL,
	population		INT NOT NULL,
	rate_per_100k	NUMERIC(10,2) NOT NULL
);