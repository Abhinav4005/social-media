import prisma from "../config/db.js";
import redisClient from "../config/rdsClient.js";
import { GLOBALSEARCHTYPE } from "../lib/type.js";

export const globalUserSearch = async (search, type, limit, offset, userId) => {
    const cacheKey = `search:users:${search}:${type}:${limit}:${offset}:${userId}`;

    try {
      const cachedResults = await redisClient.get(cacheKey);
      if (cachedResults) {
          return JSON.parse(cachedResults);
      }

      if (type === GLOBALSEARCHTYPE.USERS || type === GLOBALSEARCHTYPE.ALL) {

        const users = await prisma.$queryRaw`
            SELECT id, name, email, about, bio, location, "profileImage"
            FROM "User"
            WHERE id != ${userId} AND (
                coalesce(name,'') ILIKE '%' || ${search} || '%' OR
                coalesce(email,'') ILIKE '%' || ${search} || '%' OR
                coalesce(about,'') ILIKE '%' || ${search} || '%' OR
                coalesce(bio,'') ILIKE '%' || ${search} || '%' OR
                coalesce(location,'') ILIKE '%' || ${search} || '%'
            )
            ORDER BY name ASC
            LIMIT ${parseInt(limit, 10)}
            OFFSET ${parseInt(offset, 10)}
            `;
            
        await redisClient.set(cacheKey, JSON.stringify(users), "EX", 30)
        return users;
    }
    } catch (error) {
      console.error("User Search error:", error)
      return [];
    }
}

export const globalPostSearch = async (search, type, limit, offset) => {
  const cacheKey = `search:posts:${search}:${type}:${limit}:${offset}`;

  try {
    const cachedResults = await redisClient.get(cacheKey);

    if(cachedResults) {
      console.log("Returning cached post search results");
      return JSON.parse(cachedResults);
    }

    if (type === GLOBALSEARCHTYPE.POSTS || type === GLOBALSEARCHTYPE.ALL) {
      const posts = await prisma.$queryRaw`
        SELECT "Post".*,
          ts_rank(
            to_tsvector('english', "Post".title || ' ' || "Post".description),
            plainto_tsquery('english', ${search})
          ) AS rank
        FROM "Post" 
        WHERE to_tsvector('english', "Post".title || ' ' || "Post".description)
        @@ plainto_tsquery('english', ${search})
        ORDER BY rank DESC
        LIMIT ${parseInt(limit, 10)} 
        OFFSET ${parseInt(offset, 10)};
      `;
      await redisClient.set(cacheKey, JSON.stringify(posts), "EX", 30);
      console.log("Returning Post Search Results from DB:", posts);
      return posts;
  }

  } catch (error) {
    console.error("Post Search error:", error);
    return [];
  }
}