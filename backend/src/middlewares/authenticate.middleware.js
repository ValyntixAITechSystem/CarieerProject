import jwt from "jsonwebtoken";
import APIError from "../lib/api-error.lib.js";
import jwtLib from "../lib/jwt.lib.js";
import logger from "../lib/logger.lib.js";

const authenticateMiddleware = (allowRoles = []) => {
  return (req, _res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      logger.warn("Authorization header missing", {
        label: "AuthenticateMiddleware",
      });

      return next(
        new APIError(401, "Authorization header missing", {
          type: "AuthorizationHeaderMissing",
          details: [
            {
              field: "authorization",
              message: "Authorization header is required",
            },
          ],
        })
      );
    }

    const [schema, token] = authorization.split(" ");

    if (schema !== "Bearer" || !token) {
      logger.warn("Invalid authorization header format", {
        label: "AuthenticateMiddleware",
      });

      return next(
        new APIError(401, "Invalid authorization header format", {
          type: "InvalidAuthorizationHeaderFormat",
          details: [
            {
              field: "authorization",
              message: "Expected format: 'Bearer <token>'",
            },
          ],
        })
      );
    }

    try {
      const payload = jwtLib.verifyAccessToken(token);

      if (!payload || !payload.userId || !payload.role) {
        logger.error("Invalid token payload", {
          label: "AuthenticateMiddleware",
          payload,
        });

        return next(
          new APIError(401, "Invalid token payload", {
            type: "InvalidTokenPayload",
            details: [
              {
                field: "authorization",
                message: "Invalid token payload",
              },
            ],
          })
        );
      }

      req.user = {
        userId: payload.userId,
        role: payload.role,
      };

      if (allowRoles.length > 0 && !allowRoles.includes(payload.role)) {
        logger.warn("Insufficient role for this resource", {
          label: "AuthenticateMiddleware",
        });

        return next(
          new APIError(403, "Forbidden - Insufficient role", {
            type: "ForbiddenInsufficientRole",
            details: [
              {
                field: "authorization",
                message: "Insufficient role for this resource",
              },
            ],
          })
        );
      }

      return next();
    } catch (error) {
      logger.error("Authentication failed", {
        label: "AuthenticateMiddleware",
        error: error.message,
      });
      return next(error);
    }
  };
};

export default authenticateMiddleware;
