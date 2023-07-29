/*
  Warnings:

  - Added the required column `etymology` to the `FlashCard` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FlashCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "word" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "etymology" TEXT NOT NULL,
    "example" TEXT,
    "lastReviewed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER NOT NULL DEFAULT 0,
    "failure" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "FlashCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FlashCard" ("createdAt", "definition", "example", "failure", "id", "lastReviewed", "score", "updatedAt", "userId", "word") SELECT "createdAt", "definition", "example", "failure", "id", "lastReviewed", "score", "updatedAt", "userId", "word" FROM "FlashCard";
DROP TABLE "FlashCard";
ALTER TABLE "new_FlashCard" RENAME TO "FlashCard";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
