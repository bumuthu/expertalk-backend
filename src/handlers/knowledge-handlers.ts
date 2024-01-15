import { multiHandler } from "../utils/handlers"

export const handler = async (event, _context) => {
    return multiHandler(event, null)
}