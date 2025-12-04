import prisma from "../config/db.js";
import uploadImageToImageKit from "../utils/uploadImage.js";
import { storyQueue } from "../queues/storyQueue.js";

export const createStory = async(req, res) => {
  const userId = req?.user?.id;
  try{
    const {mediaType, caption, songName, songType} = req.body;
    const media = req?.files ? req?.files?.media[0] : null;

    if(!userId){
      return res.status(401).json("Unauthorize access");
    }

    if(!mediaType || !media) {
      return res.status(400).json({error: "mediaType and media required" });
    }

    const story = await prisma.story.create({
      data: {
        userId: userId,
        mediaType: mediaType,
        caption,
        songName,
        songType,
        mediaUrl:"",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    console.log("stroy----", story);

    await storyQueue.add("upload-story", {
      storyId: story.id,
      media,
      mediaType,
    });

    console.log("Job added to queue:", story.id);

    return res.status(201).json({
      message: "Story created, processing in background",
      storyId: (await story).id
    })
  } catch(error) {
    console.error("[create story] Error:", {
      userId,
      message: error.message,
      stack: error.stack,
    })
  }
}

export const getStories = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;

    const friendOrFollowingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        following: {
          select: {
            followingId: true,
          },
        },
        receivedFriendShips: {
          where: {
            status: "ACCEPTED",
          },
          select: {
            requesterId: true,
          },
        },
        requestedFriendShips: {
          select: {
            addresseeId: true,
          },
        },
      },
    });

    if (!friendOrFollowingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const userIds = [
      userId,
      ...friendOrFollowingUser.following.map((f) => f.followingId),
      ...friendOrFollowingUser.receivedFriendShips.map((r) => r.requesterId),
      ...friendOrFollowingUser.requestedFriendShips.map((r) => r.addresseeId),
    ];

    const uniqueUserIds = [...new Set(userIds)];

    if (uniqueUserIds.length === 0) {
      return res.status(200).json({
        sucess: true,
        message: "",
        stories: [],
        count: 0,
        nextCursor: null,
      });
    }

    const TWENT_FOUR_HOUR_AGO = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const queryOptions = {
      where: {
        userId: { in: userIds },
        createdAt: { gte: TWENT_FOUR_HOUR_AGO },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit + 1,
    };

    if (cursor) {
      (queryOptions.cursor = { id: cursor }), (queryOptions.skip = 1);
    }

    const stories = await prisma.story.findMany(queryOptions);

    let nextCursor = null;
    if (stories.length > limit) {
      const nextItem = stories[stories.length - 1];
      nextCursor = nextItem.id;
      stories.pop();
    }

    return res.status(200).json({
      message: "Stories Retreived successfully",
      stories: stories,
      count: stories.length,
      nextCursor,
    });
  } catch (error) {
    console.error("[getStories] Error:", {
      userId,
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({ error: "Error in getting stories" });
  }
};
