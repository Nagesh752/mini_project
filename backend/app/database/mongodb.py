import json
import os
import asyncio
import logging
from typing import Optional, Dict, Any, List
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logger = logging.getLogger("uvicorn.error")

class DatabaseManager:
    client: Optional[AsyncIOMotorClient] = None
    db = None
    use_fallback: bool = False
    fallback_store: Dict[str, List[Dict[str, Any]]] = {
        "users": [],
        "wishlist": [],
        "search_history": [],
        "comparison_history": [],
        "feedback": []
    }
    fallback_file: str = "backend_storage.json"

    def _load_fallback_from_disk(self):
        if os.path.exists(self.fallback_file):
            try:
                with open(self.fallback_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.fallback_store.update(data)
            except Exception as e:
                logger.warning(f"Could not load fallback store: {e}")

    def _save_fallback_to_disk(self):
        try:
            with open(self.fallback_file, "w", encoding="utf-8") as f:
                json.dump(self.fallback_store, f, indent=2, default=str)
        except Exception as e:
            logger.warning(f"Could not persist fallback store: {e}")

    async def connect(self):
        self._load_fallback_from_disk()
        try:
            # Attempt to connect to MongoDB with a short timeout
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=1500
            )
            # Test ping
            await self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            self.use_fallback = False
            logger.info(f"✅ Connected successfully to MongoDB at {settings.MONGODB_URL} (Database: {settings.DATABASE_NAME})")
        except Exception as e:
            self.use_fallback = True
            logger.warning(f"⚠️ MongoDB not reachable at {settings.MONGODB_URL} ({e}). Running in resilient local storage mode.")

    async def close(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")

    # Generic Collection Methods supporting both MongoDB and Fallback
    async def find_one(self, collection_name: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not self.use_fallback and self.db is not None:
            doc = await self.db[collection_name].find_one(query)
            if doc and "_id" in doc:
                doc["_id"] = str(doc["_id"])
            return doc
        else:
            items = self.fallback_store.get(collection_name, [])
            for item in items:
                matches = True
                for k, v in query.items():
                    if item.get(k) != v:
                        matches = False
                        break
                if matches:
                    return dict(item)
            return None

    async def find_many(self, collection_name: str, query: Dict[str, Any], sort_field: Optional[str] = None, sort_desc: bool = True, limit: int = 50) -> List[Dict[str, Any]]:
        if not self.use_fallback and self.db is not None:
            cursor = self.db[collection_name].find(query)
            if sort_field:
                direction = -1 if sort_desc else 1
                cursor = cursor.sort(sort_field, direction)
            cursor = cursor.limit(limit)
            results = []
            async for doc in cursor:
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
                results.append(doc)
            return results
        else:
            items = self.fallback_store.get(collection_name, [])
            matched = []
            for item in items:
                matches = True
                for k, v in query.items():
                    if item.get(k) != v:
                        matches = False
                        break
                if matches:
                    matched.append(dict(item))
            if sort_field:
                matched.sort(key=lambda x: str(x.get(sort_field, "")), reverse=sort_desc)
            return matched[:limit]

    async def insert_one(self, collection_name: str, document: Dict[str, Any]) -> Dict[str, Any]:
        if not self.use_fallback and self.db is not None:
            res = await self.db[collection_name].insert_one(document)
            document["_id"] = str(res.inserted_id)
            return document
        else:
            if "_id" not in document:
                import uuid
                document["_id"] = str(uuid.uuid4())
            if collection_name not in self.fallback_store:
                self.fallback_store[collection_name] = []
            self.fallback_store[collection_name].append(dict(document))
            self._save_fallback_to_disk()
            return document

    async def delete_one(self, collection_name: str, query: Dict[str, Any]) -> bool:
        if not self.use_fallback and self.db is not None:
            res = await self.db[collection_name].delete_one(query)
            return res.deleted_count > 0
        else:
            items = self.fallback_store.get(collection_name, [])
            for idx, item in enumerate(items):
                matches = True
                for k, v in query.items():
                    if item.get(k) != v:
                        matches = False
                        break
                if matches:
                    items.pop(idx)
                    self._save_fallback_to_disk()
                    return True
            return False

    async def update_one(self, collection_name: str, query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False) -> bool:
        if not self.use_fallback and self.db is not None:
            res = await self.db[collection_name].update_one(query, update, upsert=upsert)
            return res.modified_count > 0 or (upsert and res.upserted_id is not None)
        else:
            items = self.fallback_store.get(collection_name, [])
            for item in items:
                matches = True
                for k, v in query.items():
                    if item.get(k) != v:
                        matches = False
                        break
                if matches:
                    if "$set" in update:
                        item.update(update["$set"])
                    self._save_fallback_to_disk()
                    return True
            if upsert:
                new_doc = dict(query)
                if "$set" in update:
                    new_doc.update(update["$set"])
                await self.insert_one(collection_name, new_doc)
                return True
            return False

db_manager = DatabaseManager()
