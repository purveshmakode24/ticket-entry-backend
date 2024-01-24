const STATUS = {
    NEW: 'New',
    ASSIGNED: 'Assigned',
    RESOLVED: 'Resolved'
}
const SEVERITY = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High'
}
const TYPES = {
    HARDWARE_ISSUE: 'Hardware Issue',
    SOFTWARE_ISSUE: 'Software Issue'
}

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

module.exports = { STATUS, SEVERITY, TYPES, HTTP_STATUS };