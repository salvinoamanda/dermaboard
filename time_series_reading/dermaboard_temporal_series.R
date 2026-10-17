# ------------------------------ TCC Time Series -------------------------------

library(DBI)
library(RPostgres)
library(dplyr)
library(tidyr)
library(lubridate)
library(sidrar)
library(readxl)

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

# Turns a categorical column into daily counts
create_block <- function(data, column, prefix, prefix_column = NULL, cross_column = NULL) {
  data <- data %>%
    mutate(
      final_prefix = if (!is.null(prefix_column)) {
        paste0(prefix, "_", .data[[prefix_column]])
      } else {
        prefix
      }
    )
  
  filters = if (is.null(cross_column)) {
    !is.na(data[[column]])
  } else {
    !is.na(data[[column]]) & !is.na(data[[cross_column]])
  }

  grouped <- data %>%
    filter(filters) %>%
    {
      if (is.null(cross_column)) {
        count(., admission_date, final_prefix, category = .data[[column]])
      } else {
        count(., admission_date, final_prefix, .data[[cross_column]], category = .data[[column]])
      }
    }
  
  grouped %>%
    mutate(
      category = paste0(
        final_prefix, "_",
        tolower(gsub("[^A-Za-z0-9]", "_", iconv(category, from = "UTF-8", to = "ASCII//TRANSLIT"))),
        if (!is.null(cross_column)) {
          cross_suffix <- paste0("_", tolower(gsub("[^A-Za-z0-9]", "_",
                                                   iconv(.data[[cross_column]],
                                                         from = "UTF-8", to = "ASCII//TRANSLIT")
          )))
          
          if (cross_column == "state") {
            region_suffix <- paste0("_", tolower(gsub("[^A-Za-z0-9]", "_",
                                                      iconv(unname(regionCodes[.data[[cross_column]]]),
                                                            from = "UTF-8", to = "ASCII//TRANSLIT")
            )))
            paste0(cross_suffix, region_suffix)
          } else {
            cross_suffix
          }
        } else ""
      )
    ) %>%
    select(admission_date, category, n)
}

# Cleans raw SIDRA population data into year, state and population
clean_population_data <- function(raw_data, year_value = NULL) {
  cleaned <- raw_data %>%
    select(
      any_of(c(uf_code = "Unidade da Federação (Código)", state = "SIGLA")),
      population = `Valor`,
      any_of(c(year = "Ano"))
    )
  
  if (!"state" %in% names(cleaned)) {
    cleaned <- cleaned %>% mutate(state = ufCodes[uf_code])
  }
    
  if (!is.null(year_value)) {
    cleaned$year <- year_value
  } else {
    cleaned$year <- as.integer(cleaned$year)
  }
  
  cleaned %>% select(year, state, population)
}

# ---------------------- Population Data and Incidence Rate --------------------

ufCodes <- c(
  "11" = "RO", "12" = "AC", "13" = "AM", "14" = "RR", "15" = "PA",
  "16" = "AP", "17" = "TO", "21" = "MA", "22" = "PI", "23" = "CE",
  "24" = "RN", "25" = "PB", "26" = "PE", "27" = "AL", "28" = "SE",
  "29" = "BA", "31" = "MG", "32" = "ES", "33" = "RJ", "35" = "SP",
  "41" = "PR", "42" = "SC", "43" = "RS", "50" = "MS", "51" = "MT",
  "52" = "GO", "53" = "DF"
)

ufNames <- c(
  "Rondônia" = "RO", "Acre" = "AC", "Amazonas" = "AM", "Roraima" = "RR",
  "Pará" = "PA", "Amapá" = "AP", "Tocantins" = "TO", "Maranhão" = "MA",
  "Piauí" = "PI", "Ceará" = "CE", "Rio Grande do Norte" = "RN",
  "Paraíba" = "PB", "Pernambuco" = "PE", "Alagoas" = "AL", "Sergipe" = "SE",
  "Bahia" = "BA", "Minas Gerais" = "MG", "Espírito Santo" = "ES",
  "Rio de Janeiro" = "RJ", "São Paulo" = "SP", "Paraná" = "PR",
  "Santa Catarina" = "SC", "Rio Grande do Sul" = "RS",
  "Mato Grosso do Sul" = "MS", "Mato Grosso" = "MT", "Goiás" = "GO",
  "Distrito Federal" = "DF"
)

regionCodes <- c(
  "RO" = "Norte", "AC" = "Norte", "AM" = "Norte", "RR" = "Norte", "PA" = "Norte", "AP" = "Norte", "TO" = "Norte",
  "MA" = "Nordeste", "PI" = "Nordeste", "CE" = "Nordeste", "RN" = "Nordeste", "PB" = "Nordeste",
  "PE" = "Nordeste", "AL" = "Nordeste", "SE" = "Nordeste", "BA" = "Nordeste",
  "MG" = "Sudeste", "ES" = "Sudeste", "RJ" = "Sudeste", "SP" = "Sudeste",
  "PR" = "Sul", "SC" = "Sul", "RS" = "Sul",
  "MS" = "Centro-Oeste", "MT" = "Centro-Oeste", "GO" = "Centro-Oeste", "DF" = "Centro-Oeste"
)

population_2015_2021 <- clean_population_data(
  get_sidra(x = 6579, geo = "State", period = as.character(2015:2021))
)

population_2022 <- get_sidra(x = 9514, geo = "State", period = "2022") %>%
  filter(
    Sexo == "Total",
    Idade == "Total",
    `Forma de declaração da idade` == "Total"
  ) %>%
    clean_population_data(year_value = 2022)

population_2023 <- read_excel("<caminho/da/pasta/arquivo>.xlsx", skip = 5) %>%
  filter(SEXO == "Ambos", SIGLA %in% ufCodes) %>%
  group_by(SIGLA) %>%
  summarise(Valor = sum(`2023`), .groups = "drop") %>%
  clean_population_data(year_value = 2023)

population_2024 <- read_excel(
  "<caminho/da/pasta/arquivo>.xls",
  sheet = "BRASIL E UFs",
  skip = 2,
  col_names = FALSE
) %>%
  filter(`...1` %in% names(ufNames)) %>%
  transmute(SIGLA = unname(ufNames[`...1`]), Valor = as.numeric(`...2`)) %>%
  clean_population_data(year_value = 2024)

population_2025 <- read_excel(
  "<caminho/da/pasta/arquivo>.xls",
  sheet = "BRASIL E UFs",
  skip = 2,
  col_names = FALSE
) %>%
  filter(`...1` %in% names(ufNames)) %>%
  transmute(SIGLA = unname(ufNames[`...1`]), Valor = as.numeric(`...2`)) %>%
  clean_population_data(year_value = 2025)

population_states <- bind_rows(
  population_2015_2021,
  population_2022,
  population_2023,
  population_2024,
  population_2025
) %>%
  mutate(region = unname(regionCodes[state]))

population_all <- bind_rows(
  population_states,
  population_states %>%
    group_by(year, region) %>%
    summarise(population = sum(population), .groups = "drop") %>%
    mutate(state = NA_character_),
  population_states %>%
    group_by(year) %>%
    summarise(population = sum(population), .groups = "drop") %>%
    mutate(state = NA_character_, region = "Brasil")
) %>%
  select(year, state, region, population)

rm(population_2015_2021, population_2022, population_2023, population_2024,
   population_2025, population_states)

gc()

# ------------------------------- Data reading ---------------------------------

# Reading data straight from the database
data <- dbGetQuery(con, "
  SELECT
    admission_date,
    sex,
    race,
    death,
    admission_type,
    complexity,
    main_diagnosis,
    main_diagnosis_description,
    secondary_diagnosis_description,
    state,
    region,
    city_ibge_code,
    total_value,
    length_of_stay,
    age
  FROM skin_cancer_records
")

data <- data %>%
  mutate(
    diag_group = case_when(
      substr(main_diagnosis, 1, 3) %in% c("C43", "D03") ~ "melanoma",
      substr(main_diagnosis, 1, 3) %in% c("C44", "D04") ~ "nao_melanoma"
    )
  )

data$admission_date <- as.Date(data$admission_date)

# -------------------------- Criation of Time Series ---------------------------

exclude_columns <- c("admission_date", "total_value", "length_of_stay", "age",
                     "city_ibge_code", "main_diagnosis", "main_diagnosis_description")

geo_excluded <- c("state", "region")

category_columns <- setdiff(names(data), c(exclude_columns, geo_excluded))

prefix_overrides <- list(
  admission_type                  = "adm_type",
  complexity                      = "complex",
  secondary_diagnosis_description = "diag_sec"
)

blocks <- list()

for (column_name in category_columns) {
  prefix <- if (!is.null(prefix_overrides[[column_name]])) {
    prefix_overrides[[column_name]]
  } else {
    column_name
  }
  
  blocks[[paste0(column_name, "_nacional")]] <- create_block(data, column_name, prefix)
  blocks[[paste0(column_name, "_state")]] <- create_block(data, column_name, prefix, cross_column = "state")
  blocks[[paste0(column_name, "_region")]] <- create_block(data, column_name, prefix, cross_column = "region")
}

blocks[["state_nacional"]] <- create_block(data, "state", "state")
blocks[["region_nacional"]] <- create_block(data, "region", "region")
blocks[["diag_nacional"]] <- create_block(data, "main_diagnosis_description",
                                          "diag", prefix_column = "diag_group")
blocks[["diag_state"]]    <- create_block(data, "main_diagnosis_description",
                                          "diag", prefix_column = "diag_group",
                                          cross_column = "state")
blocks[["diag_region"]]   <- create_block(data, "main_diagnosis_description",
                                          "diag", prefix_column = "diag_group",
                                          cross_column = "region")

time_series <- bind_rows(blocks) %>%
  rename(date = admission_date, variable = category, value = n)

numeric_aggregates <- data %>%
  group_by(admission_date) %>%
    summarise(
      total_value_sum        = sum(total_value, na.rm = TRUE),
      total_value_avg        = mean(total_value, na.rm = TRUE),
      length_of_stay_avg     = round(mean(length_of_stay, na.rm = TRUE), 0),
      age_avg                = round(mean(age, na.rm = TRUE), 0),
      .groups = "drop"
    ) %>%
      rename(date = admission_date) %>%
      pivot_longer(-date, names_to = "variable", values_to = "value")

time_series <- bind_rows(time_series, numeric_aggregates)

rm(blocks, numeric_aggregates, prefix_overrides, data)
gc()

# ------------------------------ Annual cases ----------------------------------

cases_state <- time_series %>%
  filter(startsWith(variable, "state_")) %>%
  mutate(year = year(date), state = toupper(sub("state_", "", variable))) %>%
  group_by(year, state) %>%
  summarise(cases = sum(value), .groups = "drop") %>%
  mutate(region = unname(regionCodes[state]))

cases_region <- cases_state %>%
  group_by(year, region) %>%
  summarise(cases = sum(cases), .groups = "drop")

cases_brazil <- cases_state %>%
  group_by(year) %>%
  summarise(cases = sum(cases), .groups = "drop") %>%
  mutate(region = "Brasil")

cases_all <- bind_rows(
  cases_state,
  cases_region,
  cases_brazil
)

rm(cases_state, cases_region, cases_brazil)
gc()

# ------------------------------- Incidence rate -------------------------------

skin_cancer_annual_rates <- population_all %>%
  left_join(cases_all, by = c("year", "state", "region")) %>%
  mutate(rate_per_100k = round(cases / population * 100000, 2)) %>%
  select(year, state, region, cases, population, rate_per_100k)

skin_cancer_annual_rates <- skin_cancer_annual_rates %>%
  mutate(across(c(year, cases, population), as.integer))

# ---------------------------------- Saving ------------------------------------

# CSV
write.csv(time_series,
          "<caminho/da/pasta/arquivo>.csv",
          row.names = FALSE,
          na = "")

write.csv(skin_cancer_annual_rates,
          "<caminho/da/pasta/arquivo>.csv",
          row.names = FALSE,
          na = "")

# Postgres
dbWriteTable(con, "skin_cancer_time_series", time_series, overwrite = TRUE, row.names = FALSE)

dbWriteTable(con, "skin_cancer_annual_rates", skin_cancer_annual_rates,
             append = TRUE, row.names = FALSE)

dbDisconnect(con)
