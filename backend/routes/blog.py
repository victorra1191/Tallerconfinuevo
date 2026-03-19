from fastapi import APIRouter, HTTPException
from typing import List
from models import BlogPost
from database import database
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/blog", tags=["blog"])

@router.get("/posts", response_model=List[BlogPost])
async def get_blog_posts(published_only: bool = True):
    """Get all blog posts"""
    try:
        posts = await database.get_blog_posts(published_only=published_only)
        return posts
    except Exception as e:
        logger.error(f"Error getting blog posts: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo posts del blog")

@router.get("/posts/{post_id}", response_model=BlogPost)
async def get_blog_post(post_id: str):
    """Get a specific blog post"""
    try:
        post = await database.get_blog_post_by_id(post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post no encontrado")
        
        # Increment view count
        await database.increment_blog_views(post_id)
        
        return post
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting blog post {post_id}: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo el post")

@router.get("/posts/slug/{slug}", response_model=BlogPost)
async def get_blog_post_by_slug(slug: str):
    """Get a blog post by its slug"""
    try:
        post = await database.get_blog_post_by_slug(slug)
        if not post:
            raise HTTPException(status_code=404, detail="Post no encontrado")
        
        # Increment view count
        await database.increment_blog_views(post.id)
        
        return post
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting blog post by slug {slug}: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo el post")

@router.get("/posts/category/{category}")
async def get_posts_by_category(category: str):
    """Get blog posts by category"""
    try:
        all_posts = await database.get_blog_posts(published_only=True)
        filtered_posts = [post for post in all_posts if post.category.lower() == category.lower()]
        return {"posts": filtered_posts, "category": category, "count": len(filtered_posts)}
    except Exception as e:
        logger.error(f"Error getting posts by category {category}: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo posts por categoría")

@router.get("/featured", response_model=List[BlogPost])
async def get_featured_posts(limit: int = 3):
    """Get featured blog posts"""
    try:
        posts = await database.get_featured_blog_posts(limit=limit)
        return posts
    except Exception as e:
        logger.error(f"Error getting featured posts: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo posts destacados")

@router.get("/categories")
async def get_blog_categories():
    """Get all blog categories"""
    try:
        categories = await database.get_blog_categories()
        return {"categories": categories}
    except Exception as e:
        logger.error(f"Error getting blog categories: {e}")
        raise HTTPException(status_code=500, detail="Error obteniendo categorías del blog")
