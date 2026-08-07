import { prisma } from "../lib/prisma.js";

/**
 * Global Search Repository encapsulating raw SQL queries for full-text and parameter search.
 * Fulfills SRP by decoupling database querying from caching and HTTP logic.
 */
export class GlobalSearchRepository {
    constructor(db = prisma) {
        this.db = db;
    }

    async searchUsers(search, userId, limit, offset) {
        return await this.db.$queryRaw`
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
    }

    async searchPosts(search, limit, offset) {
        return await this.db.$queryRaw`
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
    }
}

export const defaultGlobalSearchRepository = new GlobalSearchRepository();
