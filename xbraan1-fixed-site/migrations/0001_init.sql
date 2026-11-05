-- xBraan1 form submissions (contact enquiries and booking requests).
-- Idempotent on purpose: safe to re-run.
CREATE TABLE IF NOT EXISTS submissions (
  id         TEXT PRIMARY KEY,
  kind       TEXT NOT NULL CHECK (kind IN ('contact', 'booking')),
  created_at TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'new',
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  message    TEXT,
  details    TEXT,
  ip_hash    TEXT NOT NULL,
  user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions (created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_ip_created ON submissions (ip_hash, created_at);
