const puppeteer = require('puppeteer');

async function validateWebsite(url) {
    const browser = await puppeteer.launch({
        headless: true, // Runs Chrome in the background
        channel: 'chrome' // Ensures Puppeteer uses an installed Chrome version
    });

    const page = await browser.newPage();

    let results = {
        websiteUp: false,
        sslEnabled: url.startsWith('https'),
        consoleErrors: false,
        loadTime: null
    };

    try {
        const start = Date.now();
        const response = await page.goto(url, { waitUntil: 'load', timeout: 10000 });
        const end = Date.now();

        results.websiteUp = response.status() === 200;
        results.loadTime = `${((end - start) / 1000).toFixed(2)}s`;

        let consoleErrors = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        results.consoleErrors = consoleErrors.length > 0;

    } catch (error) {
        console.error("Error checking website:", error.message);
    } finally {
        await browser.close();
    }

    return results;
}

function validateEmail(email) {
    // Regular expression to validate the email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    //Check if given email matches the regex
    return emailRegex.test(email);
}

function checkEmailFormat(user) {
    if (user.email && !isValidEmail(user.email)) {
      throw new Error(`Invalid email format for ${user.username}.`);
    }
}

async function checkUniqueEmail(email, prisma) {
    // Check if email exists in students table
    const studentWithEmail = await prisma.students.findUnique({
      where: { email: email },
    });
  
    // Check if email exists in teachers table
    const teacherWithEmail = await prisma.teachers.findUnique({
      where: { email: email },
    });
  
    if (studentWithEmail || teacherWithEmail) {
      throw new Error("Email is already in use by another user (student or teacher).");
    }
}

async function checkIfUserIsActive(userId, isStudent, prisma) {
    const user = isStudent
      ? await prisma.students.findUnique({ where: { id: userId } })
      : await prisma.teachers.findUnique({ where: { id: userId } });
  
    if (!user || !user.active) {
      throw new Error(`User with ID ${userId} is not active.`);
    }
}

async function checkStudentInClass(classId, studentId, prisma) {
    const studentInClass = await prisma.classes_students.findFirst({
      where: {
        classes_id: classId,
        students_id: studentId,
      },
    });
  
    if (!studentInClass) {
      throw new Error(`Student with ID ${studentId} is not enrolled in class ${classId}.`);
    }
}

async function checkTeacherInClass(classId, teacherId, prisma) {
    const teacherInClass = await prisma.classes_teachers.findFirst({
      where: {
        classes_id: classId,
        teachers_id: teacherId,
      },
    });
  
    if (!teacherInClass) {
      throw new Error(`Teacher with ID ${teacherId} is not assigned to class ${classId}.`);
    }
}

async function checkGroupExistence(groupId, prisma) {
    const groupExists = await prisma.groups.findUnique({
      where: { id: groupId },
    });
  
    if (!groupExists) {
      throw new Error(`Group with ID ${groupId} does not exist.`);
    }
}

//Functie om te kijken of de leeftijden in een gegeven array geldig zijn
function checkIfFirstIsSmaller(arr) {
    if (arr.length !== 2) {
        throw new Error("The array must contain exactly two integers.");
    }

    const [first, second] = arr;

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
    if (assignment.deadline && new Date(assignment.deadline) < new Date(assignment.created_at)) {
      throw new Error("Assignment deadline cannot be before the creation date.");
    }
}

function checkDeadlineNotTooFar(deadline) {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  
    if (new Date(deadline) > oneYearFromNow) {
      throw new Error("Assignment deadline cannot be more than one year in the future.");
    }
}
  
async function checkClassExistence(classId, prisma) {
    const classExists = await prisma.classes.findUnique({
      where: { id: classId },
    });
    if (!classExists) {
      throw new Error(`Class with ID ${classId} does not exist.`);
    }
}

async function checkLearningPathExistence(learningPathUuid, prisma) {
    const learningPathExists = await prisma.learning_paths.findUnique({
      where: { uuid: learningPathUuid },
    });
    if (!learningPathExists) {
      throw new Error(`Learning path with UUID ${learningPathUuid} does not exist.`);
    }
}
  
async function checkUniqueLearningObjectUUID(uuid, prisma) {
    const uuidExists = await prisma.learning_objects.findUnique({
      where: { uuid: uuid },
    });
    if (uuidExists) {
      throw new Error("Learning object UUID is already in use.");
    }
}

const validSubmissionTypes = ['multiplechoice', 'image'];

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
    keywords.forEach((keyword) => {
      if (keyword.length > 50) {
        throw new Error("Each keyword must be less than 50 characters.");
      }
    });
}

function checkSubmissionSize(submissionContent) {
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (submissionContent.length > MAX_SIZE) {
      throw new Error("Submission exceeds the maximum allowed size of 10 MB.");
    }
}



validateWebsite('https://sel2-5.ugent.be').then(results => console.log(results));
