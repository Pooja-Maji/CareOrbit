"""
SthreeCare - Database Seeder Script
Owner: Person B
"""

import sys
from pathlib import Path

server_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(server_root))

from app.main import seed_initial_data

if __name__ == "__main__":
    print("Seeding initial facilities and volunteers...")
    seed_initial_data()
    print("Seeding complete.")
