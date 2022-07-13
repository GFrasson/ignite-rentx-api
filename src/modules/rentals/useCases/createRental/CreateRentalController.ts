import { Request, Response } from "express";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

class CreateRentalController {
    async handle(request: Request, response: Response): Promise<Response> {
        return response.status(200).json();
    }
}

export { CreateRentalController };
