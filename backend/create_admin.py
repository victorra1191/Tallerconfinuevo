import asyncio
import os
import sys
from pathlib import Path

# Add the backend directory to Python path
sys.path.append(str(Path(__file__).parent))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

from database import database
from models import AdminUser
import hashlib

async def create_admin_user():
    """Create or update the first admin user"""
    try:
        # Force database connection with same config as server
        await database.connect()
        
        print(f"🗄️ Using database: {database.db.name}")
        print(f"🗄️ MongoDB URL: {os.environ.get('MONGO_URL')}")
        print(f"🗄️ DB Name: {os.environ.get('DB_NAME', 'confiautos_db')}")
        
        # Delete existing admin user
        delete_result = await database.db.admin_users.delete_many({"username": "admin"})
        print(f"🗑️ Removed {delete_result.deleted_count} existing admin user(s)")
        
        # Create new admin user with simple credentials
        password_hash = hashlib.sha256("confiautos123".encode()).hexdigest()
        
        admin_user = AdminUser(
            username="admin",
            email="admin@confiautos.com",
            password_hash=password_hash,
            full_name="Administrador Confiautos",
            role="admin"
        )
        
        user_id = await database.create_admin_user(admin_user)
        print(f"✅ New admin user created successfully!")
        print(f"Username: admin")
        print(f"Password: confiautos123")
        print(f"User ID: {user_id}")
        
        # Verify user was created
        try:
            verify_user = await database.get_admin_user_by_username("admin")
            if verify_user:
                print(f"✅ Verification successful: User {verify_user.username} found in database")
            else:
                print(f"❌ Verification failed: User not found after creation")
        except Exception as verify_error:
            print(f"⚠️ Verification error (but user may still be created): {verify_error}")
        
        print("\n🔐 Use these credentials to login at /admin/login")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await database.disconnect()

if __name__ == "__main__":
    asyncio.run(create_admin_user())