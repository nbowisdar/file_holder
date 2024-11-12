# from loguru import Logger as _Logger
from loguru import _Logger, logger


def setup_logging() -> None:
    """
    Setup logging using loguru
    """
    default = {
        "rotation": "10 MB",  # Rotate the log file when it reaches 10 MB
        "retention": "10 days",  # Keep rotated log files for 10 days
        "compression": "zip",  # Compress rotated log files
        "level": "INFO",  # Set log level
        "format": "{time:YYYY-MM-DD at HH:mm:ss} | {level} | {message}",  # Log format
    }

    logger.add(
        "logs/app.log",
        filter=lambda record: "download_file" not in record["extra"],
        **default
    )

    logger.add(
        "logs/downloads.log",
        filter=lambda record: "download_file" in record["extra"],
        **default
    )


def get_download_file_logger() -> _Logger:
    return logger.bind(download_file=True)
