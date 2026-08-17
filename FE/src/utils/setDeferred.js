import { startTransition } from "react";

export function setDeferred(setter, value) {
    startTransition(() => setter(value));
}
