-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "variants" TEXT[] DEFAULT ARRAY['360p', '480p', '720p']::TEXT[];
