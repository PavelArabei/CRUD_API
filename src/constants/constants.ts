export const enum STATUS_CODE {
  OK = 200,
  CREATED = 201,
  DELETED = 204,
  INVALID = 400,
  NOT_EXIST = 404,
  SERVER_ERROR = 500,
}

export const enum MESSAGES {
  INVALID_URL = 'Invalid URL',
  INVALID_ID = 'Invalid user id',
  INVALID_REQUEST_BODY = 'Invalid request body',
  NON_EXISTENT = 'This user does`t exist',
  SERVER_ERROR = 'Error 500 - Internal server error',
  NOTHING = '',
}
