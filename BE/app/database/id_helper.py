from nanoid import generate as _nanoid_generate


def generate_id(size: int = 10) -> str:
    return _nanoid_generate(size=size)
