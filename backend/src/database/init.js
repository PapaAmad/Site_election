const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const path = require("path");

const dbPath = path.join(__dirname, "../../votesecure.db");
const db = new sqlite3.Database(dbPath);

async function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('admin', 'candidate', 'voter', 'spectator')),
          status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'blocked')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME
        )
      `);

      // Create elections table
      db.run(`
        CREATE TABLE IF NOT EXISTS elections (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          start_date DATETIME,
          end_date DATETIME,
          status TEXT NOT NULL CHECK (status IN ('draft', 'candidacy', 'voting', 'results', 'closed')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create positions table
      db.run(`
        CREATE TABLE IF NOT EXISTS positions (
          id TEXT PRIMARY KEY,
          election_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          max_seats INTEGER DEFAULT 1,
          order_index INTEGER DEFAULT 0,
          FOREIGN KEY (election_id) REFERENCES elections (id) ON DELETE CASCADE
        )
      `);

      // Create candidates table
      db.run(`
        CREATE TABLE IF NOT EXISTS candidates (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          position_id TEXT NOT NULL,
          program TEXT,
          status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (position_id) REFERENCES positions (id) ON DELETE CASCADE
        )
      `);

      // Create votes table
      db.run(`
        CREATE TABLE IF NOT EXISTS votes (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          election_id TEXT NOT NULL,
          position_id TEXT NOT NULL,
          candidate_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (election_id) REFERENCES elections (id) ON DELETE CASCADE,
          FOREIGN KEY (position_id) REFERENCES positions (id) ON DELETE CASCADE,
          FOREIGN KEY (candidate_id) REFERENCES candidates (id) ON DELETE CASCADE,
          UNIQUE(user_id, position_id)
        )
      `);

      // Insert default admin user - SENEGALESE VERSION
      const adminPassword = await bcrypt.hash("admin123", 12);

      db.run(
        `
        INSERT OR IGNORE INTO users (
          id, email, password_hash, first_name, last_name, role, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          "admin_1",
          "admin@votesecure.sn",
          adminPassword,
          "Admin",
          "System",
          "admin",
          "approved",
          new Date().toISOString(),
        ],
      );

      // Insert test users with SENEGALESE NAMES
      const candidatePassword = await bcrypt.hash("candidate123", 12);
      const voterPassword = await bcrypt.hash("voter123", 12);
      const spectatorPassword = await bcrypt.hash("spectator123", 12);

      db.run(
        `
        INSERT OR IGNORE INTO users (
          id, email, password_hash, first_name, last_name, role, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          "candidate_1",
          "aissatou.diop@email.sn",
          candidatePassword,
          "Aissatou",
          "Diop",
          "candidate",
          "approved",
          new Date().toISOString(),
        ],
      );

      db.run(
        `
        INSERT OR IGNORE INTO users (
          id, email, password_hash, first_name, last_name, role, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          "voter_1",
          "mamadou.fall@email.sn",
          voterPassword,
          "Mamadou",
          "Fall",
          "voter",
          "approved",
          new Date().toISOString(),
        ],
      );

      db.run(
        `
        INSERT OR IGNORE INTO users (
          id, email, password_hash, first_name, last_name, role, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          "spectator_1",
          "fatou.sarr@email.sn",
          spectatorPassword,
          "Fatou",
          "Sarr",
          "spectator",
          "approved",
          new Date().toISOString(),
        ],
      );

      // Insert some pending voters for testing - SENEGALESE NAMES
      db.run(
        `
        INSERT OR IGNORE INTO users (
          id, email, password_hash, first_name, last_name, role, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          "voter_pending_1",
          "aminata.ndiaye@email.sn",
          voterPassword,
          "Aminata",
          "Ndiaye",
          "voter",
          "pending",
          new Date().toISOString(),
        ],
      );

      db.run(
        `
        INSERT OR IGNORE INTO users (
          id, email, password_hash, first_name, last_name, role, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          "voter_pending_2",
          "ibrahima.ba@email.sn",
          voterPassword,
          "Ibrahima",
          "Ba",
          "voter",
          "pending",
          new Date().toISOString(),
        ],
        (err) => {
          if (err) {
            console.error("Error inserting test data:", err);
            reject(err);
          } else {
            console.log(
              "✅ Database initialized successfully with Senegalese test data",
            );
            resolve();
          }
        },
      );
    });
  });
}

if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log("Senegalese database initialization completed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Database initialization failed:", err);
      process.exit(1);
    });
}

module.exports = { initDatabase, db };
