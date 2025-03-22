
DELETE FROM answer
WHERE date > CURRENT_DATE;

WITH used_languages AS (
  SELECT language_id FROM answer WHERE date >= CURRENT_DATE - INTERVAL '30 days'
  UNION
  SELECT s.language_id
  FROM answer a
  JOIN snippet s ON a.snippet_id = s.id
  WHERE a.date >= CURRENT_DATE - INTERVAL '30 days'
),

available_languages AS (
  SELECT id AS language_id
  FROM language
  WHERE id NOT IN (SELECT language_id FROM used_languages)
),

picked_languages AS (
  SELECT language_id,
    ROW_NUMBER() OVER () AS row_num
  FROM (
    SELECT language_id
    FROM available_languages
    ORDER BY RANDOM()
    LIMIT 60
  ) t
),

language_choices AS (
  SELECT language_id, row_num
  FROM picked_languages
  WHERE row_num <= 30
),

snippet_language_choices AS (
  SELECT language_id, row_num - 30 AS row_num
  FROM picked_languages
  WHERE row_num > 30
),

snippet_choices AS (
  SELECT DISTINCT ON (s.language_id)
    s.id AS snippet_id,
    s.language_id,
    slc.row_num
  FROM snippet s
  JOIN snippet_language_choices slc ON s.language_id = slc.language_id
  ORDER BY s.language_id, RANDOM()
)

INSERT INTO answer (date, language_id, snippet_id)
SELECT
  CURRENT_DATE + (l.row_num * INTERVAL '1 day'),
  l.language_id,
  s.snippet_id
FROM language_choices l
JOIN snippet_choices s ON l.row_num = s.row_num
WHERE l.language_id <> s.language_id;
