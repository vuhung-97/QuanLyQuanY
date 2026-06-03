from sqlalchemy import inspect
from sqlalchemy.orm import DeclarativeBase


def normalize_payload(model: type[DeclarativeBase], values: dict) -> None:
    columns = {c.key: c for c in inspect(model).columns}
    for key in list(values.keys()):
        if key not in columns:
            continue
        if isinstance(values[key], str) and values[key] == "" and columns[key].nullable:
            values[key] = None
