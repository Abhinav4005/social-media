import { prisma } from "../lib/prisma.js";
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

    console.log("story----", story);

    await storyQueue.add("upload-story", {
      storyId: story.id,
      media,
      mediaType,
    });

    console.log("Job added to queue:", story.id);

    return res.status(201).json({
      message: "Story created, processing in background",
      storyId: story.id
    })
  } catch(error) {
    console.error("[create story] Error:", {
      userId,
      message: error.message,
      stack: error.stack,
    })
  }
}

export const getStories = async(req, res) => {
  try{
    const userId = req?.user?.id;

    if(!userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;

    const queryOption = {
      where: {
        userId: userId,
        story: {
          is: {
            expiresAt: { gt: new Date() },
            mediaUrl: { not: "" },
          }
        }
      },
      include: {
        story: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
            views:{
              where: {
                viewerId: userId,
              },
              select: {id : true }
            }
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1
    };

    if(cursor) {
      queryOption.cursor = { id: cursor };
      queryOption.skip = 1;
    }

    const feed = await prisma.storyFeed.findMany(queryOption);

    let nextCursor = null;
    if(feed.length > limit) {
      const nextItem = feed[feed.length -1];
      nextCursor = nextItem.id;
      feed.pop();
    }

    const rawStories = feed.map((f) => f.story);

    const grouped ={};

    for (const story of rawStories) {
      const uid = story.userId;

      if(grouped[uid]){
        grouped[uid] = {
          userId: uid,
          user: story.user,
          stories:[]
        }
      }

      grouped[uid].stories.push({
        id: story.id,
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        caption: story.caption,
        createdAt: story.createdAt,
        isSeen: story.views.length > 0,
      })
    }

    const groups = Object.values(grouped).map((g) => {
      g.stories.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));

      g.allSeen = g.stories.every((s) => s.isSeen)

      return g;
    })

    return res.status(200).json({
      message: "Stories retreived successfully",
      stories: groups,
      count: groups.length,
      nextCursor: nextCursor
    })
  } catch(error) {
    console.error("[getStories Error]:", error);
    return res.status(500).json({error: "Error fetching stories"})
  }
}

export const markStorySeen = async (req, res) => {
  try{
    const userId = req?.user?.id;
    const storyId = Number(req.query.storyId);

    if(!userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId }
    });

    if(!story) {
      return res.status(404).json({ error: "Story not found" });
    };

    const existingView = await prisma.storyView.findFirst({
      where: {
        storyId,
        viewerId: userId,
      }
    });

    if(!existingView) {
      await prisma.storyView.create({
        data: {
          storyId,
          viewerId: userId
        },
      });
    }

    return res.status(200).json({
      message:"Story marked as seen",
    })
  } catch(error) {
    console.error("[markStorySeen] Error:", error);
    return res.status(500).json({ error: "Error marking story seen"})
  }
}

export const getStoryAnalytics = async (req, res) => {
  try{
    const userId = req?.user?.id;
    const storyId = Number(req.params.storyId);

    if(!userId){
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: {
        id: true,
        userId: true,
        createdAt: true,
        expiresAt: true
      }
    });

    if(!story) {
      return res.status(404).json({error: "Story not found" })
    }

    if(story.id !== userId){
      return res.status(403).json({ error: "Forbidden" });
    }

    const totalViews = await prisma.storyView.count({
      where: { storyId }
    });

    // const reactions = await prisma

    const lastViewers = await prisma.storyView.findMany({
      where: { storyId },
      include: {
        viewer: {
          select:{
            id: true,
            name: true,
            profileImage: true
          },
        },
      },
      orderBy: { viewedAt: "desc" },
      take: 10
    });

    return res.json({
      story:{
        id: story.id,
        createAt: story.createdAt,
        expiresAt: story.expiresAt
      },
      lastViewers: lastViewers.map((v) => ({
        id: v.viewer.id,
        name: v.viewer.name,
        profileImage: v.viewer.profileImage,
        viewedAt: v.viewedAt,
      }))
    })
  } catch(error) {
    console.error("[getStoriesAnalytics] Error:", error);
    return res.status(500).json({ error: "Failed to fetch story analytics" })
  }
}

export const getStoriesSummaryAnalytics = async (req, res) => {
  try{
    const userId = req.user?.id;
    const summaryInterval = req.query.summaryInterval;
    if(!userId){
      return res.status(401).json({ error: "Unauthorized access" })
    }

    const now = new Date();
    const summaryIntervalAgo = new Date(now.getTime() - summaryInterval * 24 * 60 * 60 * 1000);

    const stories = await prisma.story.findMany({
      where: {
        userId,
        createdAt: { gte: summaryIntervalAgo },
      },
      select: {
        id: true,
        createdAt: true
      }
    })

    if(!stories.length) {
      return res.json({
        totalStories: 0,
        totalViews: 0,
        avgViewsPerStory: 0,
        reach: 0,
      })
    };

    const storyIds = stories.map((s) => s.id);

    const totalViews = await prisma.storyView.count({
      where: { storyId: { in: storyIds }},
    })

    const uniqueViewers = await prisma.storyView.groupBy({
      by: ["viewerId"],
      where: { storyId: { in: storyIds }},
      _count: { _all: true}
    })

    const reach = uniqueViewers.length;

    const avgViewsPerStory = stories.length > 0 ? Math.round(totalViews / stories.length) : 0;

    return res.json({
      totalStories: stories.length,
      totalViews,
      avgViewsPerStory,
      reach
    })
  } catch(error){
    console.error("[getStoriesSummaryAnalytics] Error:", error);
    return res.status(500).json({ error: "Failed to fetch summary analytics" });
  }
}

export const getCombinedSummaryAnalytics = async(req, res) => {
  try{
    const userId = req?.user?.id;
    const summaryInterval = Number(req.query.summaryInterval) || 24;

    const storyId = Number(req.query.storyId);

    if(!userId){
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select:{
        id: true,
        userId: true,
        createdAt: true,
        expiresAt: true
      }
    });

    if (!story){
      return res.status(404).json({ error: "Story not found"})
    }

    if(story.userId !== userId) {
      return res.status(403).json({ error: "Forbidden"})
    }

    const totalViews = await prisma.storyView.count({
      where: { storyId },
    })

    const lastViewers = await prisma.storyView.findMany({
      where: { storyId },
      include: {
        viewer:{
          select: {
            id: true,
            name: true,
            profileImage: true,
          }
        }
      },
      orderBy: { viewedAt: "desc" },
      take: 10
    });

    const storyAnalytics ={
      story: {
        id: story.id,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
      },
      totalViews,
      lastViewers: lastViewers.map(lv => ({
        id: lv.viewer.id,
        name: lv.viewer.name,
        profileImage: lv.viewer.profileImage,
        viewedAt: lv.viewedAt
      }))
    }

    // Story Analytics based on the Time/Day

    const now = new Date();
    const summaryIntervalAgo = new Date(now.getTime() - summaryInterval * 24 * 60 * 60 * 1000);

  } catch(error) {

  }
}