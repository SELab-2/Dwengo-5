//databank wordt nog aangepast naar first_name & last_name ipv username
export const createUserValidationSchema = {
    first_name: {
        isLength: {
            options: { min: 3, max: 32 },
            errorMessage: "first_name should be at least 3 characters with a max of 32 characters"
        },
        notEmpty: { errorMessage: "first_name cannot be empty" },
        isString: { errorMessage: "first_name should be a string" }
    },
    last_name: {
        isLength: {
            options: { min: 3, max: 32 },
            errorMessage: "last_name should be at least 3 characters with a max of 32 characters"
        },
        notEmpty: { errorMessage: "last_name cannot be empty" },
        isString: { errorMessage: "last_name should be a string" }
    },
    email: {
        isEmail: { errorMessage: "Invalid email format" },
        notEmpty: { errorMessage: "email cannot be empty" }
    },
    role: {
        isIn: {
            options: [["student", "teacher"]],
            errorMessage: "role must be either 'student' or 'teacher'"
        },
        notEmpty: { errorMessage: "role cannot be empty" }
    },
    active_language: {
        isLength: {
            options: { min: 2, max: 2 },
            errorMessage: "active_language must be exactly 2 characters (ISO 639-1 language code)"
        },
        isAlpha: { errorMessage: "active_language should contain only letters" },
        notEmpty: { errorMessage: "active_language cannot be empty" }
    },
    created_at: {
        isISO8601: { errorMessage: "created_at must be a valid ISO8601 date" },
        notEmpty: { errorMessage: "created_at cannot be empty" }
    }
};

//schema's gebaseerd op huidige databank

export const studentValidationSchema = {
    username: {
        isLength: { options: { min: 3, max: 32 }, errorMessage: "username must be between 3 and 32 characters" },
        notEmpty: { errorMessage: "username cannot be empty" },
        isString: { errorMessage: "username must be a string" }
    },
    email: {
        isEmail: { errorMessage: "Invalid email format" },
        notEmpty: { errorMessage: "email cannot be empty" }
    },
    password: {
        isLength: { options: { min: 8 }, errorMessage: "password must be at least 8 characters long" },
        notEmpty: { errorMessage: "password cannot be empty" }
    },
    active_language: {
        isLength: { options: { min: 2, max: 2 }, errorMessage: "active_language must be a 2-letter language code" },
        isAlpha: { errorMessage: "active_language should contain only letters" }
    },
    created_at: {
        isISO8601: { errorMessage: "created_at must be a valid ISO8601 date" },
        notEmpty: { errorMessage: "created_at cannot be empty" }
    }
};

export const teacherValidationSchema = {
    username: {
        isLength: { options: { min: 3, max: 32 }, errorMessage: "username must be between 3 and 32 characters" },
        notEmpty: { errorMessage: "username cannot be empty" },
        isString: { errorMessage: "username must be a string" }
    },
    email: {
        isEmail: { errorMessage: "Invalid email format" },
        notEmpty: { errorMessage: "email cannot be empty" }
    },
    password: {
        isLength: { options: { min: 8 }, errorMessage: "password must be at least 8 characters long" },
        notEmpty: { errorMessage: "password cannot be empty" }
    },
    active_language: {
        isLength: { options: { min: 2, max: 2 }, errorMessage: "active_language must be a 2-letter language code" },
        isAlpha: { errorMessage: "active_language should contain only letters" }
    },
    created_at: {
        isISO8601: { errorMessage: "created_at must be a valid ISO8601 date" },
        notEmpty: { errorMessage: "created_at cannot be empty" }
    }
};

export const assignmentValidationSchema = {
    name: {
        isString: { errorMessage: "name must be a string" },
        notEmpty: { errorMessage: "name cannot be empty" }
    },
    deadline: {
        optional: true,
        isISO8601: { errorMessage: "deadline must be a valid ISO8601 date" }
    },
    created_at: {
        isISO8601: { errorMessage: "created_at must be a valid ISO8601 date" },
        notEmpty: { errorMessage: "created_at cannot be empty" }
    },
    learning_path: {
        isUUID: { errorMessage: "learning_path must be a valid UUID" },
        notEmpty: { errorMessage: "learning_path cannot be empty" }
    },
    class: {
        isInt: { errorMessage: "class must be an integer" },
        notEmpty: { errorMessage: "class cannot be empty" }
    }
};

export const classValidationSchema = {
    name: {
        optional: true,
        isString: { errorMessage: "name must be a string" }
    }
};

export const learningObjectValidationSchema = {
    id: {
        isString: { errorMessage: "id must be a string" },
        notEmpty: { errorMessage: "id cannot be empty" }
    },
    uuid: {
        isUUID: { errorMessage: "uuid must be a valid UUID" },
        notEmpty: { errorMessage: "uuid cannot be empty" }
    },
    language: {
        isLength: { options: { min: 2, max: 2 }, errorMessage: "language must be a 2-letter language code" },
        isAlpha: { errorMessage: "language should contain only letters" }
    },
    version: {
        isString: { errorMessage: "version must be a string" },
        notEmpty: { errorMessage: "version cannot be empty" }
    },
    html_content: {
        isString: { errorMessage: "html_content must be a string" },
        notEmpty: { errorMessage: "html_content cannot be empty" }
    }
};

export const messageValidationSchema = {
    content: {
        optional: true,
        isString: { errorMessage: "content must be a string" }
    },
    is_student: {
        isBoolean: { errorMessage: "is_student must be a boolean" },
        notEmpty: { errorMessage: "is_student cannot be empty" }
    },
    student: {
        optional: true,
        isInt: { errorMessage: "student must be an integer" }
    },
    index: {
        isInt: { errorMessage: "index must be an integer" },
        notEmpty: { errorMessage: "index cannot be empty" }
    },
    conversation: {
        isInt: { errorMessage: "conversation must be an integer" },
        notEmpty: { errorMessage: "conversation cannot be empty" }
    }
};

export const createAssignmentValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: "name cannot be empty"
        },
        isString: {
            errorMessage: "name should be a string"
        }
    },
    deadline: {
        optional: true,
        isISO8601: {
            errorMessage: "deadline should be a valid date"
        }
    },
    learning_path: {
        isUUID: {
            errorMessage: "learning_path should be a valid UUID"
        }
    },
    class: {
        isInt: {
            errorMessage: "class should be an integer"
        }
    }
};

export const createClassValidationSchema = {
    name: {
        optional: true,
        isString: {
            errorMessage: "name should be a string"
        }
    }
};

export const createMessageValidationSchema = {
    content: {
        optional: true,
        isString: {
            errorMessage: "content should be a string"
        }
    },
    conversation: {
        isInt: {
            errorMessage: "conversation should be an integer"
        }
    },
    is_student: {
        isBoolean: {
            errorMessage: "is_student should be a boolean"
        }
    }
};

export const createNotificationValidationSchema = {
    title: {
        notEmpty: {
            errorMessage: "title cannot be empty"
        },
        isString: {
            errorMessage: "title should be a string"
        }
    },
    content: {
        notEmpty: {
            errorMessage: "content cannot be empty"
        },
        isString: {
            errorMessage: "content should be a string"
        }
    },
    read: {
        isBoolean: {
            errorMessage: "read should be a boolean"
        }
    }
};

export const createSubmissionValidationSchema = {
    group: {
        isInt: {
            errorMessage: "group should be an integer"
        }
    },
    assignment: {
        isInt: {
            errorMessage: "assignment should be an integer"
        }
    },
    submission_type: {
        isIn: {
            options: [["multiplechoice", "image"]],
            errorMessage: "submission_type should be either 'multiplechoice' or 'image'"
        }
    }
};

export const prismaSchema = {
    "assignments": {
      "id": "number",
      "name": "string",
      "deadline": "string | null",
      "created_at": "string",
      "learning_path": "string",
      "class": "number"
    },
    "classes": {
      "id": "number",
      "name": "string | null"
    },
    "classes_students": {
      "classes_id": "number",
      "students_id": "number"
    },
    "classes_teachers": {
      "classes_id": "number",
      "teachers_id": "number"
    },
    "conversation": {
      "id": "number",
      "title": "string | null",
      "learning_object": "string",
      "teachers": "number",
      "group": "number",
      "assignment": "number"
    },
    "groups": {
      "id": "number",
      "name": "string | null",
      "class": "number",
      "assignment": "number"
    },
    "learning_objects": {
      "id": "string",
      "hruid": "string",
      "uuid": "string",
      "language": "string",
      "version": "string",
      "html_content": "string"
    },
    "learning_objects_metadata": {
      "id": "string",
      "uuid": "string",
      "version": "number",
      "language": "string",
      "title": "string | null",
      "description": "string | null",
      "keywords": "string[]",
      "target_ages": "number[]",
      "teacher_exclusive": "boolean",
      "educational_goals": "object | null",
      "copyright": "string | null",
      "license": "string | null",
      "difficulty": "number",
      "estimated_time": "number",
      "available": "boolean",
      "content_location": "string"
    },
    "learning_path_nodes": {
      "id": "number",
      "learning_object_id": "string",
      "start_node": "boolean | null",
      "learning_path": "string"
    },
    "learning_paths": {
      "hruid": "string",
      "uuid": "string",
      "language": "string",
      "title": "string | null",
      "description": "string | null",
      "image": "string | null"
    },
    "message": {
      "id": "number",
      "content": "string | null",
      "offset": "string | null",
      "is_student": "boolean",
      "student": "number | null",
      "index": "number",
      "conversation": "number"
    },
    "notifications": {
      "id": "number",
      "title": "string",
      "content": "string",
      "read": "boolean",
      "student": "number | null",
      "teacher": "number | null"
    },
    "students": {
      "id": "number",
      "username": "string",
      "email": "string",
      "password": "string | null",
      "active_language": "string",
      "created_at": "string"
    },
    "submissions": {
      "id": "number",
      "group": "number",
      "assignment": "number",
      "submission_type": "string",
      "submission_content": "object",
      "graded_by": "number | null"
    },
    "teachers": {
      "id": "number",
      "username": "string",
      "password": "string | null",
      "email": "string",
      "active_language": "string",
      "created_at": "string"
    }
}
