BEGIN;

CREATE TABLE IF NOT EXISTS upv_versions (
    id serial PRIMARY KEY, -- id is not bigserial, because node.js doesn't support int64 natively
    version smallint[] NOT NULL,
    platform smallint NOT NULL,
    url text NOT NULL,
    UNIQUE (version, platform)
);

COMMIT;
