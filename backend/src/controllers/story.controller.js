import prisma from "../config/db.js";
import uploadImageToImageKit from "../utils/uploadImage.js";

export const createStory = async (req, res) => {
  try {
    const { mediaType, caption, songName, songType } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized to create story" });
    }
    const media = req.files.media ? req?.files?.media[0] : null;

    if (!mediaType || !media) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const allowedMediaType = ["image", "video"];
    if (!allowedMediaType.includes(mediaType)) {
      return res
        .status(400)
        .json({ error: "Invalid mediaType. Must be image or video" });
    }

    const fileMime = media.mimetype;
    const imageMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const videoMimes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/mov",
    ];

    if (mediaType === "image" && !imageMimes.includes(fileMime)) {
      return res.status(400).json({ error: "Invalid image file format" });
    }

    if (mediaType === "video" && !videoMimes.includes(fileMime)) {
      return res.status(400).json({ error: "Invalid video file format" });
    }

    const folder =
      mediaType === "image" ? "social-hub/imageMedia" : "social-hub/videoMedia";

    const mediaUrl =
      media && mediaType === "image"
        ? await uploadImageToImageKit(media, folder).catch(() => null)
        : null;

    const url = mediaType === "image" ? mediaUrl : mediaVideoUrl.url;

    if (!url) {
      return res.staus(500).json({ error: "Media Uplaod fail" });
    }

    const story = await prisma.story.create({
      data: {
        mediaUrl: url,
        mediaType: mediaType,
        caption: caption,
        songName: songName,
        songType: songType,
        userId: userId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return res.status(201).json({
      message: "Story create successfully",
      story: story,
    });
  } catch (error) {
    console.error("Error while creating story", error.message);
    return res.status(500).json({ error: "Failed to create story" });
  }
};

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
