/*
* This file is part of SudoBot.
*
* Copyright (C) 2021-2023 OSN Developers.
*
* SudoBot is free software; you can redistribute it and/or modify it
* under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* SudoBot is distributed in the hope that it will be useful, but
* WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with SudoBot. If not, see <https://www.gnu.org/licenses/>.
*/

import { NextFunction, Response } from "express";
import Request from "../Request";

export default async function GuildAccessControl(request: Request, response: Response, next: NextFunction) {
    if (!request.params.guild) {
        response.status(401).send({
            error: "Cannot authorize access without a Guild ID."
        });

        return;
    }

    if (!request.user?.guilds.includes(request.params.guild)) {
        response.status(403).send({
            error: "Access denied."
        });

        return;
    }

    next();
}
