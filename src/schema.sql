BEGIN;

CREATE TABLE IF NOT EXISTS upv_versions (
    id bigserial PRIMARY KEY,
    version integer[] NOT NULL
);

COMMIT;
