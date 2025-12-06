/*
  Warnings:

  - A unique constraint covering the columns `[storyId,viewerId]` on the table `StoryView` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storyId,viewedAt]` on the table `StoryView` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[viewerId,viewedAt]` on the table `StoryView` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StoryView_storyId_viewerId_key" ON "StoryView"("storyId", "viewerId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryView_storyId_viewedAt_key" ON "StoryView"("storyId", "viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "StoryView_viewerId_viewedAt_key" ON "StoryView"("viewerId", "viewedAt");
