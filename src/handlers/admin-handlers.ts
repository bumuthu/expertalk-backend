import { HandlerFunctionType, multiHandler } from "../utils/handlers"

const createCategories = async (event: any) => {
    return null;
}

const handlerSelector = (key: string): HandlerFunctionType => {
    switch (key) {
        case "POST:/admin/categories":
            return createCategories;
    }
}

export const handler = async (event, _context) => {
    return multiHandler(event, handlerSelector);
}