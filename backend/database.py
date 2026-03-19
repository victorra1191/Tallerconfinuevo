from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List, Dict, Any
import os
from models import *
import logging

logger = logging.getLogger(__name__)

class Database:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        
    async def connect(self):
        """Connect to MongoDB"""
        try:
            mongo_url = os.environ.get('MONGO_URL')
            db_name = os.environ.get('DB_NAME', 'confiautos_db')
            
            self.client = AsyncIOMotorClient(mongo_url)
            self.db = self.client[db_name]
            
            # Test connection
            await self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
            
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            logger.info("Disconnected from MongoDB")

    # Product operations
    async def create_product(self, product: Product) -> str:
        """Create a new product"""
        result = await self.db.products.insert_one(product.dict())
        return str(result.inserted_id)
    
    async def get_products(self, filter_params: Optional[ProductFilter] = None) -> List[Product]:
        """Get products with optional filtering"""
        query = {}
        
        if filter_params:
            if filter_params.brand:
                query["brand"] = {"$regex": filter_params.brand, "$options": "i"}
            if filter_params.type:
                query["type"] = {"$regex": filter_params.type, "$options": "i"}
            if filter_params.keyword:
                query["$or"] = [
                    {"name": {"$regex": filter_params.keyword, "$options": "i"}},
                    {"description": {"$regex": filter_params.keyword, "$options": "i"}},
                    {"keywords": {"$in": [filter_params.keyword]}}
                ]
            if filter_params.min_price:
                query["price"] = {"$gte": filter_params.min_price}
            if filter_params.max_price:
                if "price" in query:
                    query["price"]["$lte"] = filter_params.max_price
                else:
                    query["price"] = {"$lte": filter_params.max_price}
        
        cursor = self.db.products.find(query)
        products = await cursor.to_list(length=None)
        return [Product(**product) for product in products]
    
    async def get_product_by_id(self, product_id: str) -> Optional[Product]:
        """Get a product by ID"""
        product = await self.db.products.find_one({"id": product_id})
        return Product(**product) if product else None
    
    async def update_product(self, product_id: str, update_data: dict) -> bool:
        """Update a product"""
        result = await self.db.products.update_one(
            {"id": product_id}, 
            {"$set": update_data}
        )
        return result.modified_count > 0

    async def delete_product(self, product_id: str) -> bool:
        """Delete a product"""
        result = await self.db.products.delete_one({"id": product_id})
        return result.deleted_count > 0

    # Service operations
    async def get_services(self) -> List[Service]:
        """Get all services"""
        cursor = self.db.services.find({})
        services = await cursor.to_list(length=None)
        return [Service(**service) for service in services]
    
    async def get_service_by_id(self, service_id: str) -> Optional[Service]:
        """Get a service by ID"""
        service = await self.db.services.find_one({"id": service_id})
        return Service(**service) if service else None
    
    async def create_service(self, service: Service) -> str:
        """Create a new service"""
        result = await self.db.services.insert_one(service.dict())
        return str(result.inserted_id)

    async def update_service(self, service_id: str, update_data: dict) -> bool:
        """Update a service"""
        result = await self.db.services.update_one(
            {"id": service_id}, 
            {"$set": update_data}
        )
        return result.modified_count > 0

    async def delete_service(self, service_id: str) -> bool:
        """Delete a service"""
        result = await self.db.services.delete_one({"id": service_id})
        return result.deleted_count > 0

    # Customer operations
    async def create_customer(self, customer: Customer) -> str:
        """Create a new customer"""
        # Check if customer with same phone already exists
        existing = await self.db.customers.find_one({"phone": customer.phone})
        if existing:
            return existing["id"]
        
        result = await self.db.customers.insert_one(customer.dict())
        return customer.id
    
    async def get_customer_by_phone(self, phone: str) -> Optional[Customer]:
        """Get customer by phone number"""
        customer = await self.db.customers.find_one({"phone": phone})
        return Customer(**customer) if customer else None
    
    async def get_customer_by_id(self, customer_id: str) -> Optional[Customer]:
        """Get customer by ID"""
        customer = await self.db.customers.find_one({"id": customer_id})
        return Customer(**customer) if customer else None

    # Vehicle operations
    async def create_vehicle(self, vehicle: Vehicle) -> str:
        """Create a new vehicle"""
        result = await self.db.vehicles.insert_one(vehicle.dict())
        return vehicle.id
    
    async def get_vehicles_by_customer(self, customer_id: str) -> List[Vehicle]:
        """Get all vehicles for a customer"""
        cursor = self.db.vehicles.find({"customer_id": customer_id})
        vehicles = await cursor.to_list(length=None)
        return [Vehicle(**vehicle) for vehicle in vehicles]

    # Service Request operations
    async def create_service_request(self, service_request: ServiceRequest) -> str:
        """Create a new service request"""
        result = await self.db.service_requests.insert_one(service_request.dict())
        return service_request.id
    
    async def get_service_requests(self, customer_id: Optional[str] = None) -> List[ServiceRequest]:
        """Get service requests, optionally filtered by customer"""
        query = {"customer_id": customer_id} if customer_id else {}
        cursor = self.db.service_requests.find(query).sort("created_at", -1)
        requests = await cursor.to_list(length=None)
        return [ServiceRequest(**req) for req in requests]

    # Quote operations
    async def create_quote(self, quote: Quote) -> str:
        """Create a new quote"""
        result = await self.db.quotes.insert_one(quote.dict())
        return quote.id
    
    async def get_quotes(self, customer_id: Optional[str] = None) -> List[Quote]:
        """Get quotes, optionally filtered by customer"""
        query = {"customer_id": customer_id} if customer_id else {}
        cursor = self.db.quotes.find(query).sort("created_at", -1)
        quotes = await cursor.to_list(length=None)
        return [Quote(**quote) for quote in quotes]

    # Appointment operations
    async def create_appointment(self, appointment: Appointment) -> str:
        """Create a new appointment"""
        result = await self.db.appointments.insert_one(appointment.dict())
        return appointment.id
    
    async def get_appointments(self, customer_id: Optional[str] = None) -> List[Appointment]:
        """Get appointments, optionally filtered by customer"""
        query = {"customer_id": customer_id} if customer_id else {}
        cursor = self.db.appointments.find(query).sort("appointment_date", 1)
        appointments = await cursor.to_list(length=None)
        return [Appointment(**appt) for appt in appointments]

    # Contact operations
    async def create_contact_message(self, message: ContactMessage) -> str:
        """Create a new contact message"""
        result = await self.db.contact_messages.insert_one(message.dict())
        return message.id
    
    async def get_contact_messages(self) -> List[ContactMessage]:
        """Get all contact messages"""
        cursor = self.db.contact_messages.find({}).sort("created_at", -1)
        messages = await cursor.to_list(length=None)
        return [ContactMessage(**msg) for msg in messages]

    # Newsletter operations
    async def subscribe_newsletter(self, subscription: NewsletterSubscription) -> str:
        """Subscribe to newsletter"""
        # Check if email already exists
        existing = await self.db.newsletter_subscriptions.find_one({"email": subscription.email})
        if existing:
            if existing["status"] == "unsubscribed":
                # Reactivate subscription
                await self.db.newsletter_subscriptions.update_one(
                    {"email": subscription.email},
                    {"$set": {"status": "active", "subscribed_at": subscription.subscribed_at}}
                )
                return existing["id"]
            return existing["id"]
        
        result = await self.db.newsletter_subscriptions.insert_one(subscription.dict())
        return subscription.id

    # Blog operations
    async def get_blog_posts(self, published_only: bool = True) -> List[BlogPost]:
        """Get blog posts"""
        query = {"published": True} if published_only else {}
        cursor = self.db.blog_posts.find(query).sort("created_at", -1)
        posts = await cursor.to_list(length=None)
        return [BlogPost(**post) for post in posts]
    
    async def get_blog_post_by_id(self, post_id: str) -> Optional[BlogPost]:
        """Get a blog post by ID"""
        post = await self.db.blog_posts.find_one({"id": post_id})
        return BlogPost(**post) if post else None
    
    async def get_blog_post_by_slug(self, slug: str) -> Optional[BlogPost]:
        """Get a blog post by slug"""
        post = await self.db.blog_posts.find_one({"slug": slug})
        return BlogPost(**post) if post else None
    
    async def create_blog_post(self, blog_post: BlogPost) -> str:
        """Create a new blog post"""
        result = await self.db.blog_posts.insert_one(blog_post.dict())
        return blog_post.id
    
    async def update_blog_post(self, post_id: str, update_data: dict) -> bool:
        """Update a blog post"""
        update_data["updated_at"] = datetime.utcnow()
        result = await self.db.blog_posts.update_one(
            {"id": post_id}, 
            {"$set": update_data}
        )
        return result.modified_count > 0
    
    async def delete_blog_post(self, post_id: str) -> bool:
        """Delete a blog post"""
        result = await self.db.blog_posts.delete_one({"id": post_id})
        return result.deleted_count > 0
    
    async def increment_blog_views(self, post_id: str) -> bool:
        """Increment view count for a blog post"""
        result = await self.db.blog_posts.update_one(
            {"id": post_id},
            {"$inc": {"view_count": 1}}
        )
        return result.modified_count > 0
    
    async def get_blog_categories(self) -> List[str]:
        """Get all unique blog categories"""
        categories = await self.db.blog_posts.distinct("category")
        return categories
    
    async def get_featured_blog_posts(self, limit: int = 3) -> List[BlogPost]:
        """Get featured blog posts"""
        cursor = self.db.blog_posts.find({"published": True, "featured": True}).sort("created_at", -1).limit(limit)
        posts = await cursor.to_list(length=limit)
        return [BlogPost(**post) for post in posts]

    # Admin User operations
    async def create_admin_user(self, admin_user: AdminUser) -> str:
        """Create a new admin user"""
        result = await self.db.admin_users.insert_one(admin_user.dict())
        return admin_user.id
    
    async def get_admin_user_by_username(self, username: str) -> Optional[AdminUser]:
        """Get admin user by username"""
        try:
            if self.db is None:
                return None
                
            user = await self.db.admin_users.find_one({"username": username})
            return AdminUser(**user) if user else None
        except Exception as e:
            logger.error(f"Error searching for admin user {username}: {e}")
            return None
    
    async def get_admin_user_by_id(self, user_id: str) -> Optional[AdminUser]:
        """Get admin user by ID"""
        user = await self.db.admin_users.find_one({"id": user_id})
        return AdminUser(**user) if user else None
    
    async def update_admin_last_login(self, user_id: str) -> bool:
        """Update admin user's last login time"""
        result = await self.db.admin_users.update_one(
            {"id": user_id},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        return result.modified_count > 0

    # Lead operations
    async def create_lead(self, lead: Lead) -> str:
        """Create a new lead"""
        result = await self.db.leads.insert_one(lead.dict())
        return lead.id
    
    async def get_leads(self, status: Optional[str] = None) -> List[Lead]:
        """Get leads, optionally filtered by status"""
        query = {"status": status} if status else {}
        cursor = self.db.leads.find(query).sort("created_at", -1)
        leads = await cursor.to_list(length=None)
        return [Lead(**lead) for lead in leads]
    
    async def update_lead_status(self, lead_id: str, status: str) -> bool:
        """Update lead status"""
        result = await self.db.leads.update_one(
            {"id": lead_id},
            {"$set": {"status": status, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0

    # Media operations
    async def create_media_file(self, media_file: MediaFile) -> str:
        """Create a new media file record"""
        result = await self.db.media_files.insert_one(media_file.dict())
        return media_file.id
    
    async def get_media_files(self, category: Optional[str] = None) -> List[MediaFile]:
        """Get media files, optionally filtered by category"""
        query = {"category": category} if category else {}
        cursor = self.db.media_files.find(query).sort("created_at", -1)
        files = await cursor.to_list(length=None)
        return [MediaFile(**file) for file in files]
    
    async def delete_media_file(self, file_id: str) -> bool:
        """Delete a media file record"""
        result = await self.db.media_files.delete_one({"id": file_id})
        return result.deleted_count > 0

    # Analytics operations
    async def get_analytics_data(self) -> AnalyticsData:
        """Get comprehensive analytics data"""
        try:
            total_customers = await self.db.customers.count_documents({})
            total_service_requests = await self.db.service_requests.count_documents({})
            total_quotes = await self.db.quotes.count_documents({})
            total_appointments = await self.db.appointments.count_documents({})
            total_blog_posts = await self.db.blog_posts.count_documents({})
            total_leads = await self.db.leads.count_documents({})
            
            # Recent activity (last 10 activities) - simplified to avoid ObjectId issues
            recent_activities = []
            
            # Get recent service requests - convert to dict and handle ObjectId
            recent_requests = await self.db.service_requests.find({}).sort("created_at", -1).limit(5).to_list(5)
            for req in recent_requests:
                recent_activities.append({
                    "type": "service_request",
                    "description": f"Nueva solicitud de servicio",
                    "date": req["created_at"].isoformat() if hasattr(req["created_at"], 'isoformat') else str(req["created_at"]),
                    "id": str(req.get("_id", ""))
                })
            
            # Get recent quotes - convert to dict and handle ObjectId
            recent_quotes = await self.db.quotes.find({}).sort("created_at", -1).limit(5).to_list(5)
            for quote in recent_quotes:
                recent_activities.append({
                    "type": "quote",
                    "description": f"Nueva cotización generada",
                    "date": quote["created_at"].isoformat() if hasattr(quote["created_at"], 'isoformat') else str(quote["created_at"]),
                    "id": str(quote.get("_id", ""))
                })
            
            # Sort recent activities by date
            recent_activities.sort(key=lambda x: x["date"], reverse=True)
            recent_activities = recent_activities[:10]
            
            # Popular services - simplified
            popular_services = [
                {"service_name": "Aire Acondicionado", "request_count": total_service_requests},
                {"service_name": "Mantenimiento Preventivo", "request_count": max(0, total_service_requests - 1)},
                {"service_name": "Chapistería", "request_count": max(0, total_service_requests - 2)}
            ]
            
            return AnalyticsData(
                total_customers=total_customers,
                total_service_requests=total_service_requests,
                total_quotes=total_quotes,
                total_appointments=total_appointments,
                total_blog_posts=total_blog_posts,
                total_leads=total_leads,
                recent_activity=recent_activities,
                popular_services=popular_services,
                revenue_data={"monthly": 0, "yearly": 0}
            )
        except Exception as e:
            logger.error(f"Error getting analytics data: {e}")
            return AnalyticsData(
                total_customers=0,
                total_service_requests=0,
                total_quotes=0,
                total_appointments=0,
                total_blog_posts=0,
                total_leads=0,
                recent_activity=[],
                popular_services=[],
                revenue_data={}
            )

    # Customer operations for admin
    async def get_customers(self) -> List[Customer]:
        """Get all customers"""
        cursor = self.db.customers.find({}).sort("created_at", -1)
        customers = await cursor.to_list(length=None)
        return [Customer(**customer) for customer in customers]

    # Settings operations
    async def get_site_settings(self) -> Optional[SiteSettings]:
        """Get site settings"""
        settings = await self.db.site_settings.find_one({})
        return SiteSettings(**settings) if settings else None
    
    async def update_site_settings(self, settings: SiteSettings) -> bool:
        """Update site settings"""
        settings.updated_at = datetime.utcnow()
        result = await self.db.site_settings.replace_one(
            {},  # No filter - replace the only document
            settings.dict(),
            upsert=True
        )
        return True

# Global database instance
database = Database()
