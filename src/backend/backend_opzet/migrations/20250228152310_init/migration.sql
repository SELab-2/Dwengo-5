-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('text/plain', 'text/markdown', 'image/image-block', 'image/image', 'audio/mpeg', 'application/pdf', 'extern', 'blocky');

-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('multiplechoice', 'image');

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "deadline" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL,
    "learning_path" UUID NOT NULL,
    "class" INTEGER NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassStudent" (
    "classes_id" INTEGER NOT NULL,
    "students_id" INTEGER NOT NULL,

    CONSTRAINT "ClassStudent_pkey" PRIMARY KEY ("classes_id","students_id")
);

-- CreateTable
CREATE TABLE "ClassTeacher" (
    "classes_id" INTEGER NOT NULL,
    "teachers_id" INTEGER NOT NULL,

    CONSTRAINT "ClassTeacher_pkey" PRIMARY KEY ("classes_id","teachers_id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR,
    "learning_object" UUID NOT NULL,
    "teachers" INTEGER NOT NULL,
    "group" INTEGER NOT NULL,
    "assignment" INTEGER NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "class" INTEGER NOT NULL,
    "assignment" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningObject" (
    "_id" VARCHAR NOT NULL,
    "hruid" VARCHAR NOT NULL,
    "uuid" UUID NOT NULL,
    "language" VARCHAR NOT NULL,
    "version" VARCHAR NOT NULL,
    "html_content" VARCHAR NOT NULL,

    CONSTRAINT "LearningObject_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "LearningObjectMetadata" (
    "_id" VARCHAR NOT NULL,
    "uuid" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "language" VARCHAR NOT NULL,
    "title" VARCHAR,
    "description" VARCHAR,
    "content_type" "ContentType",
    "keywords" VARCHAR[],
    "target_ages" INTEGER[],
    "teacher_exclusive" BOOLEAN NOT NULL,
    "skos_concepts" VARCHAR[],
    "educatioanl_goals" JSON,
    "copyright" VARCHAR,
    "license" VARCHAR,
    "difficulty" INTEGER NOT NULL,
    "estimated_time" INTEGER NOT NULL,
    "return_value" JSON,
    "available" BOOLEAN NOT NULL,
    "content_location" VARCHAR NOT NULL,

    CONSTRAINT "LearningObjectMetadata_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "LearningPath" (
    "hruid" VARCHAR NOT NULL,
    "uuid" UUID NOT NULL,
    "language" VARCHAR NOT NULL,
    "title" VARCHAR,
    "description" VARCHAR,
    "image" VARCHAR,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "LearningPathLearningObject" (
    "learning_paths_uuid" UUID NOT NULL,
    "learning_objects_uuid" UUID NOT NULL,

    CONSTRAINT "LearningPathLearningObject_pkey" PRIMARY KEY ("learning_paths_uuid","learning_objects_uuid")
);

-- CreateTable
CREATE TABLE "LearningPathNode" (
    "id" SERIAL NOT NULL,
    "learning_object_id" VARCHAR NOT NULL,
    "start_node" BOOLEAN,
    "learning_path" UUID NOT NULL,

    CONSTRAINT "LearningPathNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR,
    "offset" int8range,
    "is_student" BOOLEAN NOT NULL,
    "student" INTEGER,
    "index" INTEGER NOT NULL,
    "conversation" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR NOT NULL,
    "content" VARCHAR NOT NULL,
    "read" BOOLEAN NOT NULL,
    "student" INTEGER,
    "teacher" INTEGER,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR,
    "active_language" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentGroup" (
    "students_id" INTEGER NOT NULL,
    "groups_id" INTEGER NOT NULL,

    CONSTRAINT "StudentGroup_pkey" PRIMARY KEY ("students_id","groups_id")
);

-- CreateTable
CREATE TABLE "StudentLearningObject" (
    "students_id" INTEGER NOT NULL,
    "learning_objects__id" VARCHAR NOT NULL,

    CONSTRAINT "StudentLearningObject_pkey" PRIMARY KEY ("students_id","learning_objects__id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "group" INTEGER NOT NULL,
    "assignment" INTEGER NOT NULL,
    "submission_type" "SubmissionType" NOT NULL,
    "submission_content" JSON NOT NULL,
    "graded_by" INTEGER,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR NOT NULL,
    "password" VARCHAR,
    "email" VARCHAR NOT NULL,
    "active_language" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherAssignment" (
    "teachers_id" INTEGER NOT NULL,
    "assignments_id" INTEGER NOT NULL,

    CONSTRAINT "TeacherAssignment_pkey" PRIMARY KEY ("teachers_id","assignments_id")
);

-- CreateTable
CREATE TABLE "Transition" (
    "id" SERIAL NOT NULL,
    "condition" VARCHAR,
    "default" BOOLEAN,
    "instruction" int8range,
    "next" INTEGER,

    CONSTRAINT "Transition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningObject_uuid_key" ON "LearningObject"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "LearningObjectMetadata_uuid_key" ON "LearningObjectMetadata"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_class_fkey" FOREIGN KEY ("class") REFERENCES "Class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_learning_path_fkey" FOREIGN KEY ("learning_path") REFERENCES "LearningPath"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ClassStudent" ADD CONSTRAINT "ClassStudent_classes_id_fkey" FOREIGN KEY ("classes_id") REFERENCES "Class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ClassStudent" ADD CONSTRAINT "ClassStudent_students_id_fkey" FOREIGN KEY ("students_id") REFERENCES "Student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ClassTeacher" ADD CONSTRAINT "ClassTeacher_classes_id_fkey" FOREIGN KEY ("classes_id") REFERENCES "Class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ClassTeacher" ADD CONSTRAINT "ClassTeacher_teachers_id_fkey" FOREIGN KEY ("teachers_id") REFERENCES "Teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_assignment_fkey" FOREIGN KEY ("assignment") REFERENCES "Assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_group_fkey" FOREIGN KEY ("group") REFERENCES "Group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_learning_object_fkey" FOREIGN KEY ("learning_object") REFERENCES "LearningObject"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_teachers_fkey" FOREIGN KEY ("teachers") REFERENCES "Teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_assignment_fkey" FOREIGN KEY ("assignment") REFERENCES "Assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_class_fkey" FOREIGN KEY ("class") REFERENCES "Class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearningObjectMetadata" ADD CONSTRAINT "LearningObjectMetadata__id_fkey" FOREIGN KEY ("_id") REFERENCES "LearningObject"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearningPathLearningObject" ADD CONSTRAINT "LearningPathLearningObject_learning_objects_uuid_fkey" FOREIGN KEY ("learning_objects_uuid") REFERENCES "LearningObject"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearningPathLearningObject" ADD CONSTRAINT "LearningPathLearningObject_learning_paths_uuid_fkey" FOREIGN KEY ("learning_paths_uuid") REFERENCES "LearningPath"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearningPathNode" ADD CONSTRAINT "LearningPathNode_learning_object_id_fkey" FOREIGN KEY ("learning_object_id") REFERENCES "LearningObject"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LearningPathNode" ADD CONSTRAINT "LearningPathNode_learning_path_fkey" FOREIGN KEY ("learning_path") REFERENCES "LearningPath"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversation_fkey" FOREIGN KEY ("conversation") REFERENCES "Conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_student_fkey" FOREIGN KEY ("student") REFERENCES "Student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_student_fkey" FOREIGN KEY ("student") REFERENCES "Student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_teacher_fkey" FOREIGN KEY ("teacher") REFERENCES "Teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_groups_id_fkey" FOREIGN KEY ("groups_id") REFERENCES "Group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_students_id_fkey" FOREIGN KEY ("students_id") REFERENCES "Student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentLearningObject" ADD CONSTRAINT "StudentLearningObject_learning_objects__id_fkey" FOREIGN KEY ("learning_objects__id") REFERENCES "LearningObject"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StudentLearningObject" ADD CONSTRAINT "StudentLearningObject_students_id_fkey" FOREIGN KEY ("students_id") REFERENCES "Student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assignment_fkey" FOREIGN KEY ("assignment") REFERENCES "Assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_graded_by_fkey" FOREIGN KEY ("graded_by") REFERENCES "Teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_group_fkey" FOREIGN KEY ("group") REFERENCES "Group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_assignments_id_fkey" FOREIGN KEY ("assignments_id") REFERENCES "Assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_teachers_id_fkey" FOREIGN KEY ("teachers_id") REFERENCES "Teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Transition" ADD CONSTRAINT "Transition_id_fkey" FOREIGN KEY ("id") REFERENCES "LearningPathNode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Transition" ADD CONSTRAINT "Transition_next_fkey" FOREIGN KEY ("next") REFERENCES "LearningPathNode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
