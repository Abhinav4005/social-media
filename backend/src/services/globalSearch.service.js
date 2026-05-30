import { prisma } from "../lib/prisma.js";
import redisClient from "../config/rdsClient.js";
import { GLOBALSEARCHTYPE } from "../lib/type.js";

export const globalUserSearch = async (search, type, limit, offset, userId) => {
    const cacheKey = `search:users:${search}:${type}:${limit}:${offset}:${userId}`;

    let cachedResults;
    try {
      try {
        cachedResults = await redisClient.get(cacheKey);
      } catch (error) {
        console.error("Redis get error: ", error);
      }
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
          
        try {
          await redisClient.set(cacheKey, JSON.stringify(users), "EX",30);
        } catch (error) {
          console.error("Redis set error: ", error);
        }
        return users;
    }
    return [];
    } catch (error) {
      console.error("User Search error:", error)
      return [];
    }
}

export const globalPostSearch = async (search, type, limit, offset) => {
  const cacheKey = `search:posts:${search}:${type}:${limit}:${offset}`;

  try {
    let cachedResults;
    try {
      cachedResults = await redisClient.get(cacheKey);
    } catch (error) {
      console.error("Redis get error: ", error);
    }

    if(cachedResults) {
      console.log("Returning cached post search results");
      return JSON.parse(cachedResults);
    }

    if (type === GLOBALSEARCHTYPE.POSTS || type === GLOBALSEARCHTYPE.ALL) {
      const posts = await prisma.$queryRaw`
        SELECT "Post".*,
          json_build_object(
            'id', "User".id,
            'name', "User".name,
            'email', "User".email,
            'profileImage', "User"."profileImage"
          ) AS "user",
          json_build_object(
            'post_likes', (
              SELECT COUNT(*)::int
              FROM "PostLike"
              WHERE "PostLike"."postId" = "Post".id
                AND "PostLike".status = 'LIKE'
            ),
            'comments', (
              SELECT COUNT(*)::int
              FROM "Comment"
              WHERE "Comment"."postId" = "Post".id
                AND "Comment"."isDeleted" = false
            )
          ) AS "_count",
          ts_rank(
            to_tsvector('english', "Post".title || ' ' || "Post".description),
            plainto_tsquery('english', ${search})
          ) AS rank
        FROM "Post" 
        JOIN "User" ON "User".id = "Post"."userId"
        WHERE to_tsvector('english', "Post".title || ' ' || "Post".description)
        @@ plainto_tsquery('english', ${search})
        ORDER BY rank DESC
        LIMIT ${parseInt(limit, 10)} 
        OFFSET ${parseInt(offset, 10)};
      `;
      try {
        await redisClient.set(cacheKey, JSON.stringify(posts), "EX", 30);
      } catch (error) {
        console.error("Redis set error: ", error);
      }
      console.log("Returning Post Search Results from DB:", posts);
      return posts;
  }
  return [];

  } catch (error) {
    console.error("Post Search error:", error);
    return [];
  }
}
