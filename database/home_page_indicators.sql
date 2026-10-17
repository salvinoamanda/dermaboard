-- Home page indicators for Brazil
-- projected cases for next year, average yearly deaths, and latest incidence
WITH cases_by_year AS (
    -- National cases and incidence per year, from the rates table
    SELECT year, cases, rate_per_100k
    FROM skin_cancer_annual_rates
    WHERE region = 'Brasil'
),
deaths_by_year AS (
    -- National deaths per year, summed from the daily time series
    SELECT LEFT(date::text, 4)::int AS year, SUM(value) AS deaths
    FROM skin_cancer_time_series
    WHERE variable = 'death_sim'
    GROUP BY 1
),
last_year AS (
    -- Most recent year available in the data
    SELECT MAX(year) AS year FROM cases_by_year
),
yearly_increase AS (
    -- Increase in cases from one year to the next, over the last 5 years
    SELECT year, cases - LAG(cases) OVER (ORDER BY year) AS increase
    FROM cases_by_year
    WHERE year > (SELECT year FROM last_year) - 5
)
SELECT
    l.year + 1 AS projection_year,
    -- Last year's cases + average yearly increase
    ROUND(c.cases + (SELECT AVG(increase) FROM yearly_increase)) AS projected_cases,
    -- Average of the yearly death totals
    (SELECT ROUND(AVG(deaths)::numeric) FROM deaths_by_year) AS avg_deaths_per_year,
    l.year AS incidence_year,
    c.rate_per_100k AS latest_incidence_per_100k
FROM last_year l
JOIN cases_by_year c ON c.year = l.year;