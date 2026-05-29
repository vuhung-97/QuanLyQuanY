from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError


def register_error_handlers(app: FastAPI):
    """
    Đăng ký các global error handler cho FastAPI app.
    """
    # Xử lý tất cả HTTPException (raise HTTPException trong code)
    @app.exception_handler(HTTPException)
    def http_exception_handler(request: Request, exc: HTTPException):
        """
        Handler cho HTTPException (ví dụ: raise HTTPException trong endpoint).
        Trả về mã lỗi và nội dung detail đúng chuẩn FastAPI.
        """
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )

    # Xử lý lỗi validate request (ví dụ: thiếu trường, sai kiểu dữ liệu)
    @app.exception_handler(RequestValidationError)
    def validation_exception_handler(request: Request, exc: RequestValidationError):
        """
        Handler cho lỗi validate dữ liệu đầu vào (Pydantic validation error).
        Trả về mã 422 và danh sách lỗi chi tiết.
        """
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": exc.errors()},
        )

    # Xử lý lỗi database (SQLAlchemy)
    @app.exception_handler(SQLAlchemyError)
    def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
        """
        Handler cho lỗi database (SQLAlchemyError).
        Trả về mã 500 và thông báo chung "Database error".
        """
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Database error"},
        )

    # Xử lý tất cả lỗi chưa được catch ở trên (lỗi hệ thống, bug, ...)
    @app.exception_handler(Exception)
    def unhandled_exception_handler(request: Request, exc: Exception):
        """
        Handler cho mọi lỗi chưa được xử lý riêng (Exception chung).
        Trả về mã 500 và thông báo "Internal server error".
        """
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error"},
        )
