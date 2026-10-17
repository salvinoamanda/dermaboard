# ----------------------------- TCC Data Reading -------------------------------

library(read.dbc)
library(dplyr)
library(lubridate)
library(readxl)
library(foreign)
library(DBI)
library(RPostgres)
library(tidyr)

rm(list = ls())
gc()

setwd("<caminho/da/pasta>")
getwd()

# Connection to the database
con <- dbConnect(
  RPostgres::Postgres(),
  dbname   = "dermaboard",
  host     = "your-host",
  port     = "your-port",
  user     = "your-user",
  password = rstudioapi::askForPassword("Senha do banco:")
)

# Reads .dbc files with error handling
readFile <- function(files)
{
  tryCatch(
    {
      read.dbc :: read.dbc(files)
    },
    
    error = function(e)
    {
      cat("Error reading file: ", files, "\n", "Error message: ",
           e$message, "\n")
      
      return(NULL)
    }
  )
}

# Reads files in parts
readBatches <- function(startIndex, endIndex, dataList, files, selected)
{
  for (i in startIndex : endIndex)
  {
    dataFrame <- readFile(files[i])
    cat("File: ", files[i], "\n")
    
    if (is.null(dataFrame))
    {
      cat("Failed file: ", files[i], "\n")
    }
    else
    {
      dataList[[i]] <- dataFrame %>% select(all_of(selected))
    }
    
    gc()
  }
  
  return(dataList)
}

# Rename columns to match the database schema
renameToDbSchema <- function(dataFrame)
{
  dataFrame %>%
    rename(
      ano_cmpt             = ANO_CMPT,
      mes_cmpt             = MES_CMPT,
      city_ibge_code       = MUNIC_RES,
      birth_date           = NASC,
      sex                  = SEXO,
      age                  = IDADE,
      race                 = RACA_COR,
      nationality          = NACIONAL,
      main_diagnosis       = DIAG_PRINC,
      secondary_diagnosis  = DIAGSEC1,
      admission_date       = DT_INTER,
      discharge_date       = DT_SAIDA,
      length_of_stay       = DIAS_PERM,
      death                = MORTE,
      death_cid            = CID_MORTE,
      admission_type       = CAR_INT,
      complexity           = COMPLEX,
      procedure_performed  = PROC_REA,
      total_value          = VAL_TOT
    )
}

# Lists all .dbc files
files <- list.files(pattern = '\\.dbc$', full.names = TRUE, ignore.case = TRUE)

dataList <- list()

# ---------------------------------- Reading -----------------------------------

startIndex = 1
endIndex = length(files)

selected_fields <- c(
  "ANO_CMPT", "MES_CMPT", "MUNIC_RES",
  "NASC", "SEXO", "IDADE", "RACA_COR", "NACIONAL",
  "DIAG_PRINC", "DIAGSEC1", "DT_INTER", "DT_SAIDA", "DIAS_PERM", "MORTE", "CID_MORTE",
  "CAR_INT", "COMPLEX", "PROC_REA",
  "VAL_TOT"
)

dataList <- readBatches(startIndex, endIndex, dataList, files, selected_fields)

# ----------------------------- Pre - Processing -------------------------------

dataList <- dataList[!sapply(dataList, is.null)]

dataList <- lapply(dataList, function(dataFrame)
{
  dataFrame %>% distinct()
})

skinCancerCodes <- c("C43",  "C44", "D03", "D04")

dataList <- lapply(dataList, function(dataFrame)
{
    dataFrame %>%
    filter(substr(DIAG_PRINC, 1, 3) %in% skinCancerCodes)
})

gc()

# --------------------------- Data standardization -----------------------------

dataList <- lapply(dataList, function(dataFrame)
{
  dataFrame$DIAG_PRINC <- as.character(dataFrame$DIAG_PRINC)
  dataFrame$DIAGSEC1 <- as.character(dataFrame$DIAGSEC1)
  return(dataFrame)
})

CID_CODES <- read_excel("<caminho/da/pasta/arquivo>.xls",
                        sheet = "CID-10-SUBCATEGORIAS")

dataList <- lapply(dataList, function(dataFrame)
{
  dataFrame %>%
    left_join(CID_CODES, by = c("DIAG_PRINC" = "SUBCAT")) %>%
    left_join(CID_CODES, by = c("DIAGSEC1" = "SUBCAT"), suffix = c("", "_SEC"))
})

dataList <- lapply(dataList, function(dataFrame)
{
  dataFrame %>%
    rename(
      main_diagnosis_description = DESCRICAO,
      secondary_diagnosis_description = DESCRICAO_SEC
    )
})

ufCodes <- c(
  "11" = "RO", "12" = "AC", "13" = "AM", "14" = "RR", "15" = "PA",
  "16" = "AP", "17" = "TO", "21" = "MA", "22" = "PI", "23" = "CE",
  "24" = "RN", "25" = "PB", "26" = "PE", "27" = "AL", "28" = "SE",
  "29" = "BA", "31" = "MG", "32" = "ES", "33" = "RJ", "35" = "SP",
  "41" = "PR", "42" = "SC", "43" = "RS", "50" = "MS", "51" = "MT",
  "52" = "GO", "53" = "DF"
)

regionCodes <- c(
  "RO" = "Norte", "AC" = "Norte", "AM" = "Norte", "RR" = "Norte", "PA" = "Norte", "AP" = "Norte", "TO" = "Norte",
  "MA" = "Nordeste", "PI" = "Nordeste", "CE" = "Nordeste", "RN" = "Nordeste", "PB" = "Nordeste",
  "PE" = "Nordeste", "AL" = "Nordeste", "SE" = "Nordeste", "BA" = "Nordeste",
  "MG" = "Sudeste", "ES" = "Sudeste", "RJ" = "Sudeste", "SP" = "Sudeste",
  "PR" = "Sul", "SC" = "Sul", "RS" = "Sul",
  "MS" = "Centro-Oeste", "MT" = "Centro-Oeste", "GO" = "Centro-Oeste", "DF" = "Centro-Oeste"
)

dataList <- lapply(dataList, function(dataFrame)
{
  dataFrame %>%
    mutate(
      SEXO = case_when(
        SEXO == 3 ~ "Feminino",
        SEXO == 2 ~ "Feminino",
        SEXO == 1 ~ "Masculino",
        SEXO == 0 ~ "Sem identificação",
        TRUE ~ as.character(SEXO)
      ),
      RACA_COR = case_when(
        RACA_COR == "01" ~ "Branca",
        RACA_COR == "02" ~ "Preta",
        RACA_COR == "03" ~ "Parda",
        RACA_COR == "04" ~ "Amarela",
        RACA_COR == "05" ~ "Indígena",
        RACA_COR == "99" ~ "Sem Informação",
        TRUE ~ as.character(RACA_COR)
      ),
      CAR_INT = case_when(
        CAR_INT == "01" ~ "Eletivo",
        CAR_INT == "02" ~ "Urgência",
        CAR_INT == "03" ~ "Acidente no local de trabalho ou a serviço da empresa",
        CAR_INT == "04" ~ "Acidente no trajeto para o trabalho",
        CAR_INT == "05" ~ "Outros tipos de acidente de trânsito",
        CAR_INT == "06" ~ "Outras lesões e envenenamentos por agentes químicos ou físicos",
        TRUE ~ as.character(CAR_INT)
      ),
      COMPLEX = case_when(
        COMPLEX == "01" ~ "Atenção Básica",
        COMPLEX == "02" ~ "Média complexidade",
        COMPLEX == "03" ~ "Alta complexidade",
        TRUE ~ as.character(COMPLEX)
      ),
      MORTE = case_when(
        MORTE == 1 ~ "Sim",
        MORTE == 0 ~ "Não",
        TRUE ~ as.character(MORTE)
      ),
      state = ufCodes[substr(MUNIC_RES, 1, 2)],
      region = regionCodes[state]
    )
})

dataList <- lapply(dataList, function(dataFrame)
{
  dataFrame %>%
    mutate(
      across(c(ANO_CMPT, MUNIC_RES), ~ as.integer(as.character(.x))),
      across(c(MES_CMPT, NACIONAL, CID_MORTE, PROC_REA), ~ as.character(.x)),
      across(c(NASC, DT_INTER, DT_SAIDA), ~ ymd(as.character(.x)))
    )
})

dataList <- lapply(dataList, function(dataFrame)
{
  dataFrame %>%
    mutate(across(where(is.numeric), ~ replace_na(.x, 0)))
})

# Year range
startYear <- 2015
endYear <- 2025

dataOtherYears <- lapply(dataList, function(dataFrame) {
  dataFrame %>%
    filter(year(ymd(DT_INTER)) < startYear | year(ymd(DT_INTER)) > endYear)
})

dataList <- lapply(dataList, function(dataFrame) {
  dataFrame %>%
    filter(year(ymd(DT_INTER)) >= startYear & year(ymd(DT_INTER)) <= endYear)
})

gc()

dataOtherYears <- Filter(function(dataFrame) nrow(dataFrame) > 0, dataOtherYears)

dataList <- lapply(dataList, renameToDbSchema)
dataOtherYears <- lapply(dataOtherYears, renameToDbSchema)

gc()

# --------------------------------- Saving ------------------------------------

finalData <- do.call(rbind, dataList)
otherYearsData <- do.call(rbind, dataOtherYears)

# CSV
write.csv(finalData,
          "<caminho/da/pasta/arquivo>.csv",
          row.names = FALSE,
          na = "")

# Postgres
dbWriteTable(con, "skin_cancer_records", finalData, append = TRUE, row.names = FALSE)

# Other Years
if (!is.null(otherYearsData) && nrow(otherYearsData) > 0)
{
  write.csv(otherYearsData,
            "<caminho/da/pasta/arquivo>.csv",
            row.names = FALSE,
            na = "")
  
  dbWriteTable(con, "skin_cancer_records_other_years", otherYearsData, append = TRUE, row.names = FALSE)
}

dbDisconnect(con)
