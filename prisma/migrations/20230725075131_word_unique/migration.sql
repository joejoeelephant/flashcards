/*
  Warnings:

  - A unique constraint covering the columns `[word]` on the table `FlashCard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FlashCard_word_key" ON "FlashCard"("word");
