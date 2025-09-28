import { AdminResponseDTO } from "../../DTO/Admin.dto";
import { Admin } from "../../generated/prisma";

export function toAdminResponseDTO(admin: Admin): AdminResponseDTO {
    return {
        id: admin.id,
        name: admin.name,
        email: admin.email
    };
}