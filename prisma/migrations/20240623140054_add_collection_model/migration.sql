/*
  Warnings:

  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `_CategoryProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CollectionProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryProducts" DROP CONSTRAINT "_CategoryProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryProducts" DROP CONSTRAINT "_CategoryProducts_B_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionProducts" DROP CONSTRAINT "_CollectionProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionProducts" DROP CONSTRAINT "_CollectionProducts_B_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "image",
ADD COLUMN     "collectionId" INTEGER;

-- DropTable
DROP TABLE "_CategoryProducts";

-- DropTable
DROP TABLE "_CollectionProducts";

-- CreateTable
CREATE TABLE "_CategoryToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToProduct_AB_unique" ON "_CategoryToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
