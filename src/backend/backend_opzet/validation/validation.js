"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWebsite = validateWebsite;
exports.validateEmail = validateEmail;
exports.checkEmailFormat = checkEmailFormat;
exports.checkUniqueEmail = checkUniqueEmail;
exports.checkIfUserIsActive = checkIfUserIsActive;
exports.checkStudentInClass = checkStudentInClass;
exports.checkTeacherInClass = checkTeacherInClass;
exports.checkGroupExistence = checkGroupExistence;
exports.checkIfFirstIsSmaller = checkIfFirstIsSmaller;
exports.validateLanguage = validateLanguage;
exports.checkRequiredFields = checkRequiredFields;
exports.checkDateConsistency = checkDateConsistency;
exports.checkDeadlineNotTooFar = checkDeadlineNotTooFar;
exports.checkClassExistence = checkClassExistence;
exports.checkLearningPathExistence = checkLearningPathExistence;
exports.checkUniqueLearningObjectUUID = checkUniqueLearningObjectUUID;
exports.checkValidSubmissionType = checkValidSubmissionType;
exports.checkMessageContent = checkMessageContent;
exports.checkValidLearningObjectVersion = checkValidLearningObjectVersion;
exports.checkKeywordsLength = checkKeywordsLength;
exports.checkSubmissionSize = checkSubmissionSize;
var puppeteer_1 = require("puppeteer");
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function validateWebsite(url) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, results, start, response, end, consoleErrors_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer_1.default.launch({
                        headless: true,
                        channel: 'chrome'
                    })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    results = {
                        websiteUp: false,
                        sslEnabled: url.startsWith('https'),
                        consoleErrors: false,
                        loadTime: null
                    };
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, 7, 9]);
                    start = Date.now();
                    return [4 /*yield*/, page.goto(url, { waitUntil: 'load', timeout: 10000 })];
                case 4:
                    response = _a.sent();
                    end = Date.now();
                    results.websiteUp = (response === null || response === void 0 ? void 0 : response.status()) === 200 || false;
                    results.loadTime = "".concat(((end - start) / 1000).toFixed(2), "s");
                    consoleErrors_1 = [];
                    page.on('console', function (msg) {
                        if (msg.type() === 'error')
                            consoleErrors_1.push(msg.text());
                    });
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 5:
                    _a.sent();
                    results.consoleErrors = consoleErrors_1.length > 0;
                    return [3 /*break*/, 9];
                case 6:
                    error_1 = _a.sent();
                    console.error("Error checking website:", error_1.message);
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, browser.close()];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/, results];
            }
        });
    });
}
function validateEmail(email) {
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
function checkEmailFormat(user) {
    if (user.email && !validateEmail(user.email)) {
        throw new Error("Invalid email format for ".concat(user.username, "."));
    }
}
function checkUniqueEmail(email, prisma) {
    return __awaiter(this, void 0, void 0, function () {
        var studentWithEmail, teacherWithEmail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.student.findUnique({ where: { email: email } })];
                case 1:
                    studentWithEmail = _a.sent();
                    return [4 /*yield*/, prisma.teacher.findUnique({ where: { email: email } })];
                case 2:
                    teacherWithEmail = _a.sent();
                    if (studentWithEmail || teacherWithEmail) {
                        throw new Error("Email is already in use by another user (student or teacher).");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function checkIfUserIsActive(userId, isStudent, prisma) {
    return __awaiter(this, void 0, void 0, function () {
        var user, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!isStudent) return [3 /*break*/, 2];
                    return [4 /*yield*/, prisma.student.findUnique({ where: { id: userId } })];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, prisma.teacher.findUnique({ where: { id: userId } })];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    user = _a;
                    if (!user) {
                        throw new Error("User with ID ".concat(userId, " is not active."));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function checkStudentInClass(classId, studentId, prisma) {
    return __awaiter(this, void 0, void 0, function () {
        var studentInClass;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.classStudent.findFirst({
                        where: { classes_id: classId, students_id: studentId },
                    })];
                case 1:
                    studentInClass = _a.sent();
                    if (!studentInClass) {
                        throw new Error("Student with ID ".concat(studentId, " is not enrolled in class ").concat(classId, "."));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function checkTeacherInClass(classId, teacherId, prisma) {
    return __awaiter(this, void 0, void 0, function () {
        var teacherInClass;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.classTeacher.findFirst({
                        where: { classes_id: classId, teachers_id: teacherId },
                    })];
                case 1:
                    teacherInClass = _a.sent();
                    if (!teacherInClass) {
                        throw new Error("Teacher with ID ".concat(teacherId, " is not assigned to class ").concat(classId, "."));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function checkGroupExistence(groupId, prisma) {
    return __awaiter(this, void 0, void 0, function () {
        var groupExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.group.findUnique({ where: { id: groupId } })];
                case 1:
                    groupExists = _a.sent();
                    if (!groupExists) {
                        throw new Error("Group with ID ".concat(groupId, " does not exist."));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function checkIfFirstIsSmaller(arr) {
    if (arr.length !== 2) {
        throw new Error("The array must contain exactly two integers.");
    }
    var first = arr[0], second = arr[1];
    return first < second;
}
function validateLanguage(language) {
    return typeof language === 'string' && language.length === 2;
}
function checkRequiredFields(assignment) {
    if (!assignment.name || assignment.name.trim() === '') {
        throw new Error("Assignment name cannot be empty.");
    }
    if (!assignment.learning_path) {
        throw new Error("Learning path is required.");
    }
    if (!assignment.class) {
        throw new Error("Class ID is required.");
    }
}
function checkDateConsistency(assignment) {
    if (assignment.deadline && assignment.created_at && new Date(assignment.deadline) < new Date(assignment.created_at)) {
        throw new Error("Assignment deadline cannot be before the creation date.");
    }
}
function checkDeadlineNotTooFar(deadline) {
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    if (new Date(deadline) > oneYearFromNow) {
        throw new Error("Assignment deadline cannot be more than one year in the future.");
    }
}
function checkClassExistence(classId, prisma) {
    return __awaiter(this, void 0, void 0, function () {
        var classExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.class.findUnique({ where: { id: classId } })];
                case 1:
                    classExists = _a.sent();
                    if (!classExists) {
                        throw new Error("Class with ID ".concat(classId, " does not exist."));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function checkLearningPathExistence(learningPathUuid, prisma) {
    return __awaiter(this, void 0, void 0, function () {
        var learningPathExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.learningPath.findUnique({ where: { uuid: learningPathUuid } })];
                case 1:
                    learningPathExists = _a.sent();
                    if (!learningPathExists) {
                        throw new Error("Learning path with UUID ".concat(learningPathUuid, " does not exist."));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function checkUniqueLearningObjectUUID(uuid, prisma) {
    return __awaiter(this, void 0, void 0, function () {
        var uuidExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.learningObject.findUnique({ where: { uuid: uuid } })];
                case 1:
                    uuidExists = _a.sent();
                    if (uuidExists) {
                        throw new Error("Learning object UUID is already in use.");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
var validSubmissionTypes = ['multiplechoice', 'image'];
function checkValidSubmissionType(submissionType) {
    if (!validSubmissionTypes.includes(submissionType)) {
        throw new Error("Invalid submission type.");
    }
}
function checkMessageContent(messageContent) {
    if (!messageContent || messageContent.trim() === '') {
        throw new Error("Message content cannot be empty.");
    }
}
function checkValidLearningObjectVersion(version) {
    if (isNaN(version) || version < 1) {
        throw new Error("Learning object version must be a positive integer.");
    }
}
function checkKeywordsLength(keywords) {
    keywords.forEach(function (keyword) {
        if (keyword.length > 50) {
            throw new Error("Each keyword must be less than 50 characters.");
        }
    });
}
function checkSubmissionSize(submissionContent) {
    var MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (submissionContent.length > MAX_SIZE) {
        throw new Error("Submission exceeds the maximum allowed size of 10 MB.");
    }
}
validateWebsite('https://sel2-5.ugent.be').then(function (results) { return console.log(results); });
