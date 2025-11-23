import prisma from "../config/db.js";
import uploadImageToImageKit from "../utils/uploadImage.js";

export const createStory = async(req, res) => {
    try {
        const { mediaType, caption, songName, songType} = req.body;
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({ error: "Unauthorized to create story"});
        }
        const media = req.files.media ? req?.files?.media[0] : null;

        if(!mediaType || !media){
            return res.status(400).json({error: "All fields are required"});
        }

        const allowedMediaType = ['image', 'video'];
        if(!allowedMediaType.includes(mediaType)){
            return res.status(400).json({ error: "Invalid mediaType. Must be image or video"});
        }

        const fileMime = media.mimetype;
        const imageMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        const videoMimes = ["video/mp4", "video/webm", "video/quicktime", "video/mov"];

        if(mediaType === "image" && !imageMimes.includes(fileMime)) {
            return res.status(400).json({ error: "Invalid image file format" });
        }

        if(mediaType === "video" && !videoMimes.includes(fileMime)) {
            return res.status(400).json({ error: "Invalid video file format"})
        }

        const folder = mediaType === 'image' ? "social-hub/imageMedia" : "social-hub/videoMedia";

        const mediaUrl = (media && mediaType === 'image') ? await uploadImageToImageKit(media, folder).catch(()=> null) : null

        const url = mediaType === 'image' ? mediaUrl : mediaVideoUrl.url;

        if(!url){
            return res.staus(500).json({error: "Media Uplaod fail"})
        }

        const story = await prisma.story.create({
            data:{
                mediaUrl: url,
                mediaType: mediaType,
                caption: caption,
                songName: songName,
                songType: songType,
                userId: userId,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        })

        return res.status(201).json({
            message: "Story create successfully",
            story: story,
        })
    } catch (error) {
        console.error("Error while creating story", error.message);
        return res.status(500).json({error: "Failed to create story"})        
    }
}

export const getStories = async(req, res) => {
    try {
        const userId = req.user?.id;

        if(!userId){
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const friendOrFollowingUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                following: {
                    select: {
                        followingId: true,
                    }
                },
                receivedFriendShips:{
                    where: {
                        status: "ACCEPTED"
                    },
                    select: {
                        requesterId:true,
                    }
                },
                requestedFriendShips:{
                    where: {
                        status:"ACCEPTED"
                    },
                    select:{
                        addresseeId: true
                    }
                }
            }
        });

        console.log("frinedOrFollowingUser", friendOrFollowingUser);

        const followingId = friendOrFollowingUser.following.map(f => f.followingId)

        console.log("followingId", followingIds);

        if(friendOrFollowingUser){
            return res.status(200).json({ user: friendOrFollowingUser});
        }


        const stories = await prisma.story.findUnique({
            where: {
                userId: friendOrFollowingUser
            }
        });
    } catch (error) {
        
    }
}