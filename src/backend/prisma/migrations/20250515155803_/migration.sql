/*
  Warnings:

  - Made the column `title` on table `LearningObject` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LearningObject" ALTER COLUMN "title" SET NOT NULL;

-- CreateTable
CREATE TABLE "StudentAssignment" (
    "student_id" INTEGER NOT NULL,
    "assignment_id" INTEGER NOT NULL,

    CONSTRAINT "StudentAssignment_pkey" PRIMARY KEY ("student_id","assignment_id")
);

-- AddForeignKey
ALTER TABLE "StudentAssignment" ADD CONSTRAINT "StudentAssignment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentAssignment" ADD CONSTRAINT "StudentAssignment_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
