/*
  Warnings:

  - The values [image] on the enum `SubmissionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `class` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `learning_path` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `assignment` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `group` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `learning_object` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `assignment` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `class` on the `Group` table. All the data in the column will be lost.
  - The primary key for the `LearningPath` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `LearningPath` table. All the data in the column will be lost.
  - You are about to drop the column `learning_path` on the `LearningPathNode` table. All the data in the column will be lost.
  - You are about to drop the column `conversation` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `index` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `is_student` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `offset` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `student` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `teacher` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `student` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `teacher` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Student` table. All the data in the column will be lost.
  - The primary key for the `StudentGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `groups_id` on the `StudentGroup` table. All the data in the column will be lost.
  - You are about to drop the column `students_id` on the `StudentGroup` table. All the data in the column will be lost.
  - The primary key for the `StudentLearningObject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `learning_objects__id` on the `StudentLearningObject` table. All the data in the column will be lost.
  - You are about to drop the column `students_id` on the `StudentLearningObject` table. All the data in the column will be lost.
  - You are about to drop the column `assignment` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `group` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `condition` on the `Transition` table. All the data in the column will be lost.
  - You are about to drop the column `default` on the `Transition` table. All the data in the column will be lost.
  - You are about to drop the column `instruction` on the `Transition` table. All the data in the column will be lost.
  - You are about to drop the column `next` on the `Transition` table. All the data in the column will be lost.
  - You are about to drop the `ClassStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClassTeacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LearningObjectMetadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LearningPathLearningObject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeacherAssignment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `class_id` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learning_path_id` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignment_id` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learning_object_id` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `Conversation` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `assignment_id` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Group` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `available` to the `LearningObject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_location` to the `LearningObject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `LearningObject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimated_time` to the `LearningObject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_exclusive` to the `LearningObject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `_id` to the `LearningPath` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learning_path_id` to the `LearningPathNode` table without a default value. This is not possible if the table is not empty.
  - Made the column `start_node` on table `LearningPathNode` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `conversation_id` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `StudentGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `StudentGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learning_object_id` to the `StudentLearningObject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `StudentLearningObject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignment_id` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learning_object_id` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condition_max` to the `Transition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condition_min` to the `Transition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destination_node_id` to the `Transition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_node_id` to the `Transition` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('QUESTION', 'INVITE');

-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionType_new" AS ENUM ('multiplechoice', 'plaintext');
ALTER TABLE "Submission" ALTER COLUMN "submission_type" TYPE "SubmissionType_new" USING ("submission_type"::text::"SubmissionType_new");
ALTER TYPE "SubmissionType" RENAME TO "SubmissionType_old";
ALTER TYPE "SubmissionType_new" RENAME TO "SubmissionType";
DROP TYPE "SubmissionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_class_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_learning_path_fkey";

-- DropForeignKey
ALTER TABLE "ClassStudent" DROP CONSTRAINT "ClassStudent_classes_id_fkey";

-- DropForeignKey
ALTER TABLE "ClassStudent" DROP CONSTRAINT "ClassStudent_students_id_fkey";

-- DropForeignKey
ALTER TABLE "ClassTeacher" DROP CONSTRAINT "ClassTeacher_classes_id_fkey";

-- DropForeignKey
ALTER TABLE "ClassTeacher" DROP CONSTRAINT "ClassTeacher_teachers_id_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_assignment_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_group_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_learning_object_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_assignment_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_class_fkey";

-- DropForeignKey
ALTER TABLE "LearningObjectMetadata" DROP CONSTRAINT "LearningObjectMetadata__id_fkey";

-- DropForeignKey
ALTER TABLE "LearningPathLearningObject" DROP CONSTRAINT "LearningPathLearningObject_learning_objects_uuid_fkey";

-- DropForeignKey
ALTER TABLE "LearningPathLearningObject" DROP CONSTRAINT "LearningPathLearningObject_learning_paths_uuid_fkey";

-- DropForeignKey
ALTER TABLE "LearningPathNode" DROP CONSTRAINT "LearningPathNode_learning_object_id_fkey";

-- DropForeignKey
ALTER TABLE "LearningPathNode" DROP CONSTRAINT "LearningPathNode_learning_path_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversation_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_student_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_teacher_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_student_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_teacher_fkey";

-- DropForeignKey
ALTER TABLE "StudentGroup" DROP CONSTRAINT "StudentGroup_groups_id_fkey";

-- DropForeignKey
ALTER TABLE "StudentGroup" DROP CONSTRAINT "StudentGroup_students_id_fkey";

-- DropForeignKey
ALTER TABLE "StudentLearningObject" DROP CONSTRAINT "StudentLearningObject_learning_objects__id_fkey";

-- DropForeignKey
ALTER TABLE "StudentLearningObject" DROP CONSTRAINT "StudentLearningObject_students_id_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_assignment_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_graded_by_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_group_fkey";

-- DropForeignKey
ALTER TABLE "TeacherAssignment" DROP CONSTRAINT "TeacherAssignment_assignments_id_fkey";

-- DropForeignKey
ALTER TABLE "TeacherAssignment" DROP CONSTRAINT "TeacherAssignment_teachers_id_fkey";

-- DropForeignKey
ALTER TABLE "Transition" DROP CONSTRAINT "Transition_id_fkey";

-- DropForeignKey
ALTER TABLE "Transition" DROP CONSTRAINT "Transition_next_fkey";

-- DropIndex
DROP INDEX "Student_email_key";

-- DropIndex
DROP INDEX "Teacher_email_key";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "class",
DROP COLUMN "learning_path",
ADD COLUMN     "class_id" INTEGER NOT NULL,
ADD COLUMN     "learning_path_id" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "assignment",
DROP COLUMN "group",
DROP COLUMN "learning_object",
ADD COLUMN     "assignment_id" INTEGER NOT NULL,
ADD COLUMN     "group_id" INTEGER NOT NULL,
ADD COLUMN     "learning_object_id" VARCHAR NOT NULL,
ADD COLUMN     "student_id" INTEGER NOT NULL,
ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "assignment",
DROP COLUMN "class",
ADD COLUMN     "assignment_id" INTEGER NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "LearningObject" ADD COLUMN     "available" BOOLEAN NOT NULL,
ADD COLUMN     "content_location" VARCHAR NOT NULL,
ADD COLUMN     "content_type" "ContentType",
ADD COLUMN     "copyright" VARCHAR,
ADD COLUMN     "description" VARCHAR,
ADD COLUMN     "difficulty" INTEGER NOT NULL,
ADD COLUMN     "educatioanl_goals" JSON,
ADD COLUMN     "estimated_time" INTEGER NOT NULL,
ADD COLUMN     "keywords" VARCHAR[],
ADD COLUMN     "license" VARCHAR,
ADD COLUMN     "return_value" JSON,
ADD COLUMN     "skos_concepts" VARCHAR[],
ADD COLUMN     "target_ages" INTEGER[],
ADD COLUMN     "teacher_exclusive" BOOLEAN NOT NULL,
ADD COLUMN     "title" VARCHAR;

-- AlterTable
ALTER TABLE "LearningPath" DROP CONSTRAINT "LearningPath_pkey",
DROP COLUMN "uuid",
ADD COLUMN     "_id" VARCHAR NOT NULL,
ADD CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("_id");

-- AlterTable
ALTER TABLE "LearningPathNode" DROP COLUMN "learning_path",
ADD COLUMN     "learning_path_id" VARCHAR NOT NULL,
ALTER COLUMN "start_node" SET NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "conversation",
DROP COLUMN "index",
DROP COLUMN "is_student",
DROP COLUMN "offset",
DROP COLUMN "student",
DROP COLUMN "teacher",
ADD COLUMN     "conversation_id" INTEGER NOT NULL,
ADD COLUMN     "date" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "content",
DROP COLUMN "student",
DROP COLUMN "teacher",
DROP COLUMN "title",
ADD COLUMN     "type" "NotificationType" NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "username",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Student_id_seq";

-- AlterTable
ALTER TABLE "StudentGroup" DROP CONSTRAINT "StudentGroup_pkey",
DROP COLUMN "groups_id",
DROP COLUMN "students_id",
ADD COLUMN     "group_id" INTEGER NOT NULL,
ADD COLUMN     "student_id" INTEGER NOT NULL,
ADD CONSTRAINT "StudentGroup_pkey" PRIMARY KEY ("student_id", "group_id");

-- AlterTable
ALTER TABLE "StudentLearningObject" DROP CONSTRAINT "StudentLearningObject_pkey",
DROP COLUMN "learning_objects__id",
DROP COLUMN "students_id",
ADD COLUMN     "learning_object_id" VARCHAR NOT NULL,
ADD COLUMN     "student_id" INTEGER NOT NULL,
ADD CONSTRAINT "StudentLearningObject_pkey" PRIMARY KEY ("student_id", "learning_object_id");

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "assignment",
DROP COLUMN "group",
ADD COLUMN     "assignment_id" INTEGER NOT NULL,
ADD COLUMN     "grade" INTEGER NOT NULL,
ADD COLUMN     "group_id" INTEGER NOT NULL,
ADD COLUMN     "learning_object_id" VARCHAR NOT NULL,
ALTER COLUMN "submission_content" SET DATA TYPE VARCHAR;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "username",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Teacher_id_seq";

-- AlterTable
ALTER TABLE "Transition" DROP COLUMN "condition",
DROP COLUMN "default",
DROP COLUMN "instruction",
DROP COLUMN "next",
ADD COLUMN     "condition_max" INTEGER NOT NULL,
ADD COLUMN     "condition_min" INTEGER NOT NULL,
ADD COLUMN     "destination_node_id" INTEGER NOT NULL,
ADD COLUMN     "source_node_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ClassStudent";

-- DropTable
DROP TABLE "ClassTeacher";

-- DropTable
DROP TABLE "LearningObjectMetadata";

-- DropTable
DROP TABLE "LearningPathLearningObject";

-- DropTable
DROP TABLE "TeacherAssignment";

-- CreateTable
CREATE TABLE "ClassUser" (
    "class_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "ClassUser_pkey" PRIMARY KEY ("class_id","user_id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitingroomUser" (
    "user_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "WaitingroomUser_pkey" PRIMARY KEY ("user_id","class_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "LearningPath"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ClassUser" ADD CONSTRAINT "ClassUser_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ClassUser" ADD CONSTRAINT "ClassUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_learning_object_id_fkey" FOREIGN KEY ("learning_object_id") REFERENCES "LearningObject"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearningPathNode" ADD CONSTRAINT "LearningPathNode_learning_object_id_fkey" FOREIGN KEY ("learning_object_id") REFERENCES "LearningObject"("_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearningPathNode" ADD CONSTRAINT "LearningPathNode_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "LearningPath"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentLearningObject" ADD CONSTRAINT "StudentLearningObject_learning_object_id_fkey" FOREIGN KEY ("learning_object_id") REFERENCES "LearningObject"("_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentLearningObject" ADD CONSTRAINT "StudentLearningObject_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_graded_by_fkey" FOREIGN KEY ("graded_by") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_learning_object_id_fkey" FOREIGN KEY ("learning_object_id") REFERENCES "LearningObject"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transition" ADD CONSTRAINT "Transition_source_node_id_fkey" FOREIGN KEY ("source_node_id") REFERENCES "LearningPathNode"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Transition" ADD CONSTRAINT "Transition_destination_node_id_fkey" FOREIGN KEY ("destination_node_id") REFERENCES "LearningPathNode"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WaitingroomUser" ADD CONSTRAINT "WaitingroomUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WaitingroomUser" ADD CONSTRAINT "WaitingroomUser_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
