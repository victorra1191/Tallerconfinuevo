#!/usr/bin/env python3
"""
Confiautos Backend API Test Script
This script tests all the backend API endpoints for the Confiautos application.
"""

import requests
import json
import sys
import os
from dotenv import load_dotenv
import time

# Load environment variables from frontend/.env
load_dotenv("frontend/.env")

# Get the backend URL from environment variables
BACKEND_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BACKEND_URL:
    print("Error: REACT_APP_BACKEND_URL environment variable not found.")
    sys.exit(1)

# Ensure the URL has the /api prefix
API_URL = f"{BACKEND_URL}/api"

# Test data
SERVICE_REQUEST_DATA = {
    "name": "Juan Perez",
    "phone": "6234-5678",
    "email": "juan@test.com",
    "vehicle_brand": "Toyota",
    "vehicle_model": "Corolla",
    "vehicle_year": "2020",
    "service_id": "1",
    "urgency": "media",
    "description": "Necesito revisar el aire acondicionado"
}

QUOTE_REQUEST_DATA = {
    "name": "Maria Garcia",
    "phone": "6345-7890",
    "email": "maria@test.com",
    "products": [
        {"id": "1", "quantity": 2, "price": 12.95},
        {"id": "5", "quantity": 1, "price": 18.50}
    ],
    "notes": "Necesito estos productos para mi taller"
}

APPOINTMENT_DATA = {
    "name": "Carlos Silva",
    "phone": "6456-8901",
    "email": "carlos@test.com",
    "vehicle_brand": "Honda",
    "vehicle_model": "Civic",
    "vehicle_year": "2019",
    "appointment_date": "2024-12-20",
    "appointment_time": "10:00",
    "notes": "Mantenimiento general"
}

CONTACT_MESSAGE_DATA = {
    "name": "Pedro Martinez",
    "email": "pedro@test.com",
    "phone": "6567-9012",
    "subject": "Consulta sobre productos",
    "message": "Quisiera saber si tienen disponible el aceite Motul 10W-40 para mi Honda Civic 2018."
}

NEWSLETTER_DATA = "newsletter@test.com"

def test_health_check():
    """Test the health check endpoint"""
    print("\n=== Testing Health Check Endpoint ===")
    try:
        response = requests.get(f"{API_URL}/")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response:", response.json())
            print("✅ Health check endpoint is working")
            return True
        else:
            print("❌ Health check endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Error testing health check endpoint: {e}")
        return False

def test_get_products():
    """Test the get all products endpoint"""
    print("\n=== Testing Get All Products Endpoint ===")
    try:
        response = requests.get(f"{API_URL}/products")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            products = response.json()
            print(f"Number of products: {len(products)}")
            if len(products) == 62:
                print("✅ Get all products endpoint is working (62 products returned)")
                return True
            else:
                print(f"❌ Expected 62 products, but got {len(products)}")
                return False
        else:
            print("❌ Get all products endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Error testing get all products endpoint: {e}")
        return False

def test_filter_products_by_brand():
    """Test filtering products by brand"""
    print("\n=== Testing Filter Products by Brand Endpoint ===")
    brand = "Wurth"
    try:
        response = requests.get(f"{API_URL}/products?brand={brand}")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            products = response.json()
            print(f"Number of {brand} products: {len(products)}")
            # Check if all products have the correct brand
            all_correct_brand = all(product["brand"] == brand for product in products)
            if all_correct_brand and len(products) > 0:
                print(f"✅ Filter products by brand endpoint is working ({len(products)} {brand} products returned)")
                return True
            else:
                print(f"❌ Not all products have the brand {brand} or no products returned")
                return False
        else:
            print("❌ Filter products by brand endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Error testing filter products by brand endpoint: {e}")
        return False

def test_search_products_by_keyword():
    """Test searching products by keyword"""
    print("\n=== Testing Search Products by Keyword Endpoint ===")
    keyword = "aceite"
    try:
        response = requests.get(f"{API_URL}/products?keyword={keyword}")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            products = response.json()
            print(f"Number of products matching '{keyword}': {len(products)}")
            if len(products) > 0:
                print(f"✅ Search products by keyword endpoint is working ({len(products)} products matching '{keyword}')")
                return True
            else:
                print(f"❌ No products found matching '{keyword}'")
                return False
        else:
            print("❌ Search products by keyword endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Error testing search products by keyword endpoint: {e}")
        return False

def test_get_services():
    """Test the get all services endpoint"""
    print("\n=== Testing Get All Services Endpoint ===")
    try:
        response = requests.get(f"{API_URL}/services")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            services = response.json()
            print(f"Number of services: {len(services)}")
            if len(services) == 8:
                print("✅ Get all services endpoint is working (8 services returned)")
                return True
            else:
                print(f"❌ Expected 8 services, but got {len(services)}")
                return False
        else:
            print("❌ Get all services endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Error testing get all services endpoint: {e}")
        return False

def test_service_request():
    """Test the service request endpoint"""
    print("\n=== Testing Service Request Endpoint ===")
    try:
        response = requests.post(f"{API_URL}/services/request", json=SERVICE_REQUEST_DATA)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("Response:", result)
            if result.get("success") and "request_id" in result.get("data", {}):
                print("✅ Service request endpoint is working")
                return True
            else:
                print("❌ Service request endpoint returned unexpected response")
                return False
        else:
            print("❌ Service request endpoint failed")
            print("Response:", response.text)
            return False
    except Exception as e:
        print(f"❌ Error testing service request endpoint: {e}")
        return False

def test_quote_request():
    """Test the quote request endpoint"""
    print("\n=== Testing Quote Request Endpoint ===")
    try:
        response = requests.post(f"{API_URL}/quotes/request", json=QUOTE_REQUEST_DATA)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("Response:", result)
            if result.get("success") and "quote_id" in result.get("data", {}):
                print("✅ Quote request endpoint is working")
                return True
            else:
                print("❌ Quote request endpoint returned unexpected response")
                return False
        else:
            print("❌ Quote request endpoint failed")
            print("Response:", response.text)
            return False
    except Exception as e:
        print(f"❌ Error testing quote request endpoint: {e}")
        return False

def test_appointment_booking():
    """Test the appointment booking endpoint"""
    print("\n=== Testing Appointment Booking Endpoint ===")
    try:
        response = requests.post(f"{API_URL}/appointments/book", json=APPOINTMENT_DATA)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("Response:", result)
            if result.get("success") and "appointment_id" in result.get("data", {}):
                print("✅ Appointment booking endpoint is working")
                return True
            else:
                print("❌ Appointment booking endpoint returned unexpected response")
                return False
        else:
            print("❌ Appointment booking endpoint failed")
            print("Response:", response.text)
            return False
    except Exception as e:
        print(f"❌ Error testing appointment booking endpoint: {e}")
        return False

def test_contact_message():
    """Test the contact message endpoint"""
    print("\n=== Testing Contact Message Endpoint ===")
    try:
        response = requests.post(f"{API_URL}/contact/message", json=CONTACT_MESSAGE_DATA)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("Response:", result)
            if result.get("success") and "message_id" in result.get("data", {}):
                print("✅ Contact message endpoint is working")
                return True
            else:
                print("❌ Contact message endpoint returned unexpected response")
                return False
        else:
            print("❌ Contact message endpoint failed")
            print("Response:", response.text)
            return False
    except Exception as e:
        print(f"❌ Error testing contact message endpoint: {e}")
        return False

def test_newsletter_subscription():
    """Test the newsletter subscription endpoint"""
    print("\n=== Testing Newsletter Subscription Endpoint ===")
    try:
        response = requests.post(f"{API_URL}/newsletter/subscribe?email={NEWSLETTER_DATA}")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("Response:", result)
            if result.get("success") and "subscription_id" in result.get("data", {}):
                print("✅ Newsletter subscription endpoint is working")
                return True
            else:
                print("❌ Newsletter subscription endpoint returned unexpected response")
                return False
        else:
            print("❌ Newsletter subscription endpoint failed")
            print("Response:", response.text)
            return False
    except Exception as e:
        print(f"❌ Error testing newsletter subscription endpoint: {e}")
        return False

def test_get_blog_posts():
    """Test the get blog posts endpoint"""
    print("\n=== Testing Get Blog Posts Endpoint ===")
    try:
        response = requests.get(f"{API_URL}/blog/posts")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            posts = response.json()
            print(f"Number of blog posts: {len(posts)}")
            if len(posts) > 0:
                print(f"✅ Get blog posts endpoint is working ({len(posts)} posts returned)")
                return True
            else:
                print("❌ No blog posts returned")
                return False
        else:
            print("❌ Get blog posts endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Error testing get blog posts endpoint: {e}")
        return False

def run_all_tests():
    """Run all API tests and return results"""
    print(f"Testing Confiautos Backend API at: {API_URL}")
    
    results = {
        "health_check": test_health_check(),
        "get_products": test_get_products(),
        "filter_products_by_brand": test_filter_products_by_brand(),
        "search_products_by_keyword": test_search_products_by_keyword(),
        "get_services": test_get_services(),
        "service_request": test_service_request(),
        "quote_request": test_quote_request(),
        "appointment_booking": test_appointment_booking(),
        "contact_message": test_contact_message(),
        "newsletter_subscription": test_newsletter_subscription(),
        "get_blog_posts": test_get_blog_posts()
    }
    
    # Print summary
    print("\n=== Test Summary ===")
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    # Calculate overall success
    success_count = sum(1 for result in results.values() if result)
    total_count = len(results)
    success_rate = (success_count / total_count) * 100
    
    print(f"\nOverall: {success_count}/{total_count} tests passed ({success_rate:.1f}%)")
    
    return results

if __name__ == "__main__":
    run_all_tests()