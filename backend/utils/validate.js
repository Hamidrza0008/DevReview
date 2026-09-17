const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => {
    if (!email || typeof email !== "string") return "Email is required";
    if (!EMAIL_REGEX.test(email.trim())) return "Please provide a valid email address";
    return null;
};

const validatePassword = (password) => {
    if (!password || typeof password !== "string") return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    return null;
};

// Project validation limits
const PROJECT_LIMITS = {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MIN_LENGTH: 1,
    DESCRIPTION_MAX_LENGTH: 5000,
    TECH_STACK_MAX_ITEMS: 25,
    TECH_ITEM_MIN_LENGTH: 1,
    TECH_ITEM_MAX_LENGTH: 50,
    URL_MAX_LENGTH: 2048,
};

const ALLOWED_PROJECT_FIELDS = new Set([
    "title",
    "description",
    "thumbnail",
    "techStack",
    "githubUrl",
    "GitBranchUrl",
    "liveUrl",
]);

const validateProjectTitle = (title, isRequired = true) => {
    if (title === undefined || title === null) {
        if (isRequired) return "Project title is required";
        return null;
    }
    if (typeof title !== "string") {
        return "Project title must be a string";
    }
    const trimmed = title.trim();
    if (trimmed.length < PROJECT_LIMITS.TITLE_MIN_LENGTH) {
        return "Project title cannot be empty";
    }
    if (trimmed.length > PROJECT_LIMITS.TITLE_MAX_LENGTH) {
        return `Project title must be ${PROJECT_LIMITS.TITLE_MAX_LENGTH} characters or fewer`;
    }
    return null;
};

const validateProjectDescription = (description, isRequired = true) => {
    if (description === undefined || description === null) {
        if (isRequired) return "Project description is required";
        return null;
    }
    if (typeof description !== "string") {
        return "Project description must be a string";
    }
    const trimmed = description.trim();
    if (trimmed.length < PROJECT_LIMITS.DESCRIPTION_MIN_LENGTH) {
        return "Project description cannot be empty";
    }
    if (trimmed.length > PROJECT_LIMITS.DESCRIPTION_MAX_LENGTH) {
        return `Project description must be ${PROJECT_LIMITS.DESCRIPTION_MAX_LENGTH} characters or fewer`;
    }
    return null;
};

const validateTechStack = (techStack, isRequired = false) => {
    if (techStack === undefined || techStack === null) {
        if (isRequired) return "Tech stack is required";
        return null;
    }

    if (!Array.isArray(techStack)) {
        return "Tech stack must be an array of technologies";
    }

    if (techStack.length > PROJECT_LIMITS.TECH_STACK_MAX_ITEMS) {
        return `Tech stack cannot contain more than ${PROJECT_LIMITS.TECH_STACK_MAX_ITEMS} technologies`;
    }

    for (let i = 0; i < techStack.length; i++) {
        const item = techStack[i];
        if (typeof item !== "string") {
            return "Each technology in tech stack must be a string";
        }
        const trimmed = item.trim();
        if (trimmed.length < PROJECT_LIMITS.TECH_ITEM_MIN_LENGTH) {
            return "Technology name cannot be empty";
        }
        if (trimmed.length > PROJECT_LIMITS.TECH_ITEM_MAX_LENGTH) {
            return `Each technology name must be ${PROJECT_LIMITS.TECH_ITEM_MAX_LENGTH} characters or fewer`;
        }
    }

    return null;
};

const validateProjectUrl = (url, label = "URL", isRequired = false) => {
    if (url === undefined || url === null || url === "") {
        if (isRequired) return `${label} is required`;
        return null;
    }

    if (typeof url !== "string") {
        return `${label} must be a valid URL string`;
    }

    const trimmed = url.trim();
    if (trimmed.length === 0) {
        if (isRequired) return `${label} cannot be empty`;
        return null;
    }

    if (trimmed.length > PROJECT_LIMITS.URL_MAX_LENGTH) {
        return `${label} must be ${PROJECT_LIMITS.URL_MAX_LENGTH} characters or fewer`;
    }

    let parsed;
    try {
        parsed = new URL(trimmed);
    } catch {
        return `Please provide a valid URL for ${label}`;
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return `${label} must use http or https protocol`;
    }

    return null;
};

const validateProjectPayload = (payload, { isUpdate = false } = {}) => {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return { isValid: false, error: "Invalid request payload" };
    }

    // Check for unexpected arbitrary fields
    const unknownFields = Object.keys(payload).filter((key) => !ALLOWED_PROJECT_FIELDS.has(key));
    if (unknownFields.length > 0) {
        return { isValid: false, error: `Unexpected field in request: ${unknownFields[0]}` };
    }

    const sanitized = {};

    // 1. Title
    if (!isUpdate || payload.title !== undefined) {
        const titleError = validateProjectTitle(payload.title, !isUpdate);
        if (titleError) return { isValid: false, error: titleError };
        if (payload.title !== undefined) sanitized.title = payload.title.trim();
    }

    // 2. Description
    if (!isUpdate || payload.description !== undefined) {
        const descError = validateProjectDescription(payload.description, !isUpdate);
        if (descError) return { isValid: false, error: descError };
        if (payload.description !== undefined) sanitized.description = payload.description.trim();
    }

    // 3. Tech Stack
    if (!isUpdate || payload.techStack !== undefined) {
        const techError = validateTechStack(payload.techStack, false);
        if (techError) return { isValid: false, error: techError };
        if (payload.techStack !== undefined) {
            sanitized.techStack = Array.isArray(payload.techStack)
                ? [...new Set(payload.techStack.map((t) => t.trim()))]
                : [];
        } else if (!isUpdate) {
            sanitized.techStack = [];
        }
    }

    // 4. URLs
    // githubUrl / GitBranchUrl
    const hasGithub = payload.githubUrl !== undefined;
    const hasGitBranch = payload.GitBranchUrl !== undefined;
    if (!isUpdate || hasGithub || hasGitBranch) {
        const rawGithub = (payload.githubUrl && typeof payload.githubUrl === "string" && payload.githubUrl.trim())
            || payload.GitBranchUrl
            || payload.githubUrl;
        const gitError = validateProjectUrl(rawGithub, "GitHub URL", false);
        if (gitError) return { isValid: false, error: gitError };
        if (hasGithub || hasGitBranch) {
            sanitized.githubUrl = rawGithub && typeof rawGithub === "string" ? rawGithub.trim() : "";
        } else if (!isUpdate) {
            sanitized.githubUrl = "";
        }
    }

    // liveUrl
    if (!isUpdate || payload.liveUrl !== undefined) {
        const liveError = validateProjectUrl(payload.liveUrl, "Live URL", false);
        if (liveError) return { isValid: false, error: liveError };
        if (payload.liveUrl !== undefined) {
            sanitized.liveUrl = payload.liveUrl && typeof payload.liveUrl === "string" ? payload.liveUrl.trim() : "";
        } else if (!isUpdate) {
            sanitized.liveUrl = "";
        }
    }

    // thumbnail
    if (!isUpdate || payload.thumbnail !== undefined) {
        const thumbError = validateProjectUrl(payload.thumbnail, "Thumbnail URL", false);
        if (thumbError) return { isValid: false, error: thumbError };
        if (payload.thumbnail !== undefined) {
            sanitized.thumbnail = payload.thumbnail && typeof payload.thumbnail === "string" ? payload.thumbnail.trim() : "";
        } else if (!isUpdate) {
            sanitized.thumbnail = "";
        }
    }

    return { isValid: true, sanitized };
};

module.exports = {
    validateEmail,
    validatePassword,
    PROJECT_LIMITS,
    ALLOWED_PROJECT_FIELDS,
    validateProjectTitle,
    validateProjectDescription,
    validateTechStack,
    validateProjectUrl,
    validateProjectPayload,
};
